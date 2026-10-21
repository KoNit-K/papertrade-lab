import { createHash } from 'node:crypto';
import { readFileSync, realpathSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { Ajv } from 'ajv';

interface Claim {
  claim_id: string;
  scope_kind: 'unidentified_user_observation' | 'source_description_only';
  provenance_kinds: string[];
  support_status: string;
  observation_ids: string[];
  evidence_ids: string[];
  counterevidence_ids: string[];
  source_dependency_ids: string[];
  version_id: string | null;
  origin_domain?: null;
  observed_at?: null;
  transaction_hash?: null;
}
interface Evidence {
  evidence_id: string;
  source_id: string;
  version_id: string;
  source_dependency_ids: string[];
  timestamp_precision: 'date' | 'client_wall_clock';
  collection_date: string;
  retrieval_started_at: string | null;
  retrieval_finished_at: string | null;
  raw_capture: {
    published: boolean;
    repository_path: string | null;
    redistribution_status: string;
    byte_length: number;
    content_hash: string;
  };
}
interface Version {
  version_id: string;
  source_ids: string[];
  needs_revalidation: boolean;
}
interface Records { claims: Claim[]; evidence: Evidence[]; versions: Version[] }

function requireCondition(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const ms = Date.parse(value);
  return Number.isFinite(ms) && new Date(ms).toISOString().slice(0, 10) === value;
}
function validTime(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,6})?(Z|\+00:00)$/.test(value)
    && validDate(value.slice(0, 10)) && Number.isFinite(Date.parse(value))
    && new Date(value).toISOString().slice(0, 19) === value.slice(0, 19);
}
const ajv = new Ajv({ strict: true, allErrors: false });
ajv.addFormat('date', validDate);
ajv.addFormat('date-time', validTime);
ajv.addFormat('public-https', (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && !url.search && !url.hash;
  } catch { return false; }
});
const schema: object = JSON.parse(readFileSync(new URL('./records.schema.json', import.meta.url), 'utf8'));
const validateShape = ajv.compile<Records>(schema);

function readRecords(root: string): Records {
  const packet: Record<string, unknown> = {};
  for (const name of ['claims', 'evidence', 'versions']) {
    try {
      packet[name] = JSON.parse(readFileSync(resolve(root, 'research/records', name + '.json'), 'utf8'));
    } catch {
      // Do not echo arbitrary raw content or machine-local paths in diagnostics.
      throw new Error(`Cannot read valid JSON from ${name}.json`);
    }
  }
  if (!validateShape(packet)) {
    // Ajv paths and property names can contain submitted text. Emit only a keyword.
    throw new Error(`Record schema rejected input (${validateShape.errors?.[0]?.keyword ?? 'shape'})`);
  }
  return packet;
}
function uniqueIndex<T>(rows: T[], id: (row: T) => string): Map<string, T> {
  const index = new Map<string, T>();
  for (const row of rows) {
    const key = id(row);
    requireCondition(!index.has(key), 'Duplicate record ID');
    index.set(key, row);
  }
  return index;
}
function contained(root: string, path: string): boolean {
  const rel = relative(root, path);
  return rel !== '' && !isAbsolute(rel) && rel !== '..' && !rel.startsWith('..' + sep);
}
function checkCapture(root: string, capture: Evidence['raw_capture']): boolean {
  if (!capture.published) {
    requireCondition(capture.repository_path === null, 'Unpublished capture must not expose a path');
    return false;
  }
  requireCondition(capture.redistribution_status === 'permitted', 'Published capture requires redistribution permission');
  const path = capture.repository_path;
  requireCondition(path !== null && /^evidence\/public\/[A-Za-z0-9_./-]+$/.test(path)
    && !path.split('/').some(part => part === '..' || part === '.' || part === ''), 'Unsafe capture path');
  let bytes: Buffer;
  try {
    const realRoot = realpathSync(root);
    const publicRoot = realpathSync(resolve(root, 'evidence/public'));
    const actual = realpathSync(resolve(root, path));
    requireCondition(publicRoot === resolve(realRoot, 'evidence/public') && contained(publicRoot, actual), 'Unsafe capture path');
    bytes = readFileSync(actual);
  } catch { throw new Error('Unreadable or unsafe capture path'); }
  requireCondition(bytes.byteLength === capture.byte_length, 'Capture byte length mismatch');
  requireCondition(createHash('sha256').update(bytes).digest('hex') === capture.content_hash, 'Capture SHA-256 mismatch');
  return true;
}

/** Offline structural/integrity validation. Never upgrades evidence or executes commands. */
export function validateRecords(root: string) {
  const records = readRecords(root);
  uniqueIndex(records.claims, row => row.claim_id);
  const evidence = uniqueIndex(records.evidence, row => row.evidence_id);
  const versions = uniqueIndex(records.versions, row => row.version_id);
  const checkRefs = (ids: string[]) => {
    for (const id of ids) requireCondition(evidence.has(id), 'Unresolved evidence reference');
  };
  for (const row of records.evidence) checkRefs(row.source_dependency_ids);
  const visiting = new Set<string>();
  const visited = new Set<string>();
  function visit(id: string) {
    requireCondition(!visiting.has(id), 'Cyclic evidence dependency');
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dependency of evidence.get(id)!.source_dependency_ids) visit(dependency);
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of evidence.keys()) visit(id);
  let checkedCaptures = 0;
  for (const row of records.evidence) {
    const version = versions.get(row.version_id);
    requireCondition(version?.source_ids.includes(row.source_id), 'Source missing from applicable version');
    if (row.timestamp_precision === 'date') {
      requireCondition(row.retrieval_started_at === null && row.retrieval_finished_at === null, 'Date precision must retain unknown times');
    } else {
      requireCondition(row.retrieval_started_at !== null && row.retrieval_finished_at !== null, 'Client clock precision requires retrieval interval');
      requireCondition(Date.parse(row.retrieval_started_at) <= Date.parse(row.retrieval_finished_at), 'Reversed retrieval interval');
    }
    if (checkCapture(root, row.raw_capture)) checkedCaptures++;
  }
  for (const version of records.versions) {
    for (const source of version.source_ids) {
      requireCondition(records.evidence.some(row => row.source_id === source && row.version_id === version.version_id), 'Version source lacks evidence record');
    }
  }
  for (const row of records.claims) {
    checkRefs([...row.evidence_ids, ...row.counterevidence_ids, ...row.source_dependency_ids]);
    requireCondition(!row.evidence_ids.some(id => row.counterevidence_ids.includes(id)), 'Evidence cannot support and counter the same claim');
    if (row.scope_kind === 'unidentified_user_observation') {
      requireCondition(row.support_status === 'unverified' && row.version_id === null
        && row.provenance_kinds.length === 1 && row.provenance_kinds[0] === 'user_report'
        && row.observation_ids.length > 0 && row.evidence_ids.length === 0
        && row.origin_domain === null && row.observed_at === null && row.transaction_hash === null,
      'Unidentified observation cannot become supported or borrow deployment identity');
    } else {
      requireCondition(row.provenance_kinds.length === 1 && row.provenance_kinds[0] === 'official_doc'
        && row.observation_ids.length === 0 && row.version_id !== null && versions.has(row.version_id),
      'Source description needs its own documentation version');
      requireCondition(row.support_status !== 'supported' || row.evidence_ids.length > 0, 'Supported claim requires evidence');
      requireCondition(row.support_status !== 'refuted' || row.counterevidence_ids.length > 0, 'Refuted claim requires counterevidence');
      requireCondition(row.support_status !== 'conflicting' || (row.evidence_ids.length > 0 && row.counterevidence_ids.length > 0), 'Conflicting claim requires both evidence roles');
      for (const id of [...row.evidence_ids, ...row.counterevidence_ids]) requireCondition(evidence.get(id)!.version_id === row.version_id, 'Evidence version mismatch');
      requireCondition(row.support_status === 'unverified' || !versions.get(row.version_id)!.needs_revalidation, 'Stale version requires claim revalidation');
    }
  }
  return {
    claims: records.claims.length, evidence: records.evidence.length, versions: records.versions.length,
    checked_capture_files: checkedCaptures,
    unpublished_capture_files: records.evidence.length - checkedCaptures,
    protocol_reproduced: false,
  };
}
