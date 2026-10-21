import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test } from 'node:test';

const source = resolve(import.meta.dirname, '..');
const cli = join(source, 'packages/evidence/cli.ts');
// Mutations exercise the public CLI and real files, never a mocked validator.
function fixture(t: { after: (fn: () => void) => void }) {
  const root = mkdtempSync(join(tmpdir(), 'ptlab-record-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'research'));
  cpSync(join(source, 'research/records'), join(root, 'research/records'), { recursive: true });
  return root;
}
function mutate(root: string, name: string, fn: (rows: any[]) => void) {
  const path = join(root, 'research/records', name + '.json');
  const rows = JSON.parse(readFileSync(path, 'utf8'));
  fn(rows);
  writeFileSync(path, JSON.stringify(rows));
}
function run(root: string) {
  return spawnSync(process.execPath, [cli, root], { encoding: 'utf8' });
}

test('existing records validate without pretending unpublished hashes were checked', () => {
  const result = run(source);
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.claims, 13);
  assert.equal(report.evidence, 6);
  assert.equal(report.versions, 1);
  assert.equal(report.checked_capture_files, 0);
  assert.equal(report.unpublished_capture_files, 6);
  assert.equal(report.protocol_reproduced, false);
});

const invalid: [string, string, (rows: any[]) => void][] = [
  ['duplicate IDs with different contents', 'claims', rows => rows.push({ ...rows[0], statement: 'A different synthetic statement with the same ID.' })],
  ['unknown support status', 'claims', rows => rows[0].support_status = 'verified'],
  ['missing statement', 'claims', rows => delete rows[0].statement],
  ['wrong field type', 'claims', rows => rows[0].limitations = 1],
  ['unexpected field', 'claims', rows => rows[0].secret_extra = 'synthetic-only'],
  ['evidence-free reproduction', 'claims', rows => rows[0].reproduction_status = 'reproduced'],
  ['document-only reproduction', 'claims', rows => rows[7].reproduction_status = 'reproduced'],
  ['unsupported chain provenance', 'evidence', rows => rows[0].provenance_kind = 'chain_observation'],
  ['dangling support reference', 'claims', rows => rows[7].evidence_ids = ['EVD-MISSING']],
  ['dangling counterevidence reference', 'claims', rows => rows[7].counterevidence_ids = ['EVD-MISSING']],
  ['dangling dependency reference', 'evidence', rows => rows[0].source_dependency_ids = ['EVD-MISSING']],
  ['cyclic evidence dependency', 'evidence', rows => { rows[0].source_dependency_ids = [rows[1].evidence_id]; rows[1].source_dependency_ids = [rows[0].evidence_id]; }],
  ['dangling version reference', 'claims', rows => rows[7].version_id = 'VER-MISSING'],
  ['source outside version', 'versions', rows => rows[0].source_ids = ['S2']],
  ['unsupported deployment identity', 'versions', rows => rows[0].chain_id = '999'],
  ['malformed hash', 'evidence', rows => rows[0].raw_capture.content_hash = 'xyz'],
  ['missing content identity', 'evidence', rows => delete rows[0].raw_capture],
  ['unpublished path disclosure', 'evidence', rows => rows[0].raw_capture.repository_path = 'evidence/public/hidden.txt'],
  ['missing retrieval time', 'evidence', rows => rows[0].timestamp_precision = 'client_wall_clock'],
  ['invalid calendar date', 'evidence', rows => rows[0].collection_date = '2026-02-30'],
  ['reversed retrieval interval', 'evidence', rows => { rows[2].retrieval_started_at = '2026-10-21T09:00:00Z'; rows[2].retrieval_finished_at = '2026-10-21T08:00:00Z'; }],
  ['credential-bearing URL', 'evidence', rows => rows[0].url = 'https://example.com/?token=synthetic-only'],
  ['unsupported URI scheme', 'evidence', rows => rows[0].url = 'file:///example'],
  ['observation falsely supported', 'claims', rows => rows[0].support_status = 'supported'],
  ['unbacked source description', 'claims', rows => rows[7].evidence_ids = []],
];
for (const [name, file, change] of invalid) {
  test('rejects ' + name, t => {
    const root = fixture(t);
    mutate(root, file, change);
    const result = run(root);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, /Record validation failed/);
    assert.equal(result.stdout, '');
  });
}

// This fixture tests file integrity only and is explicitly synthetic.
function publishSynthetic(root: string, path = 'evidence/public/synthetic.txt') {
  mkdirSync(join(root, 'evidence/public'), { recursive: true });
  writeFileSync(join(root, 'evidence/public/synthetic.txt'), 'synthetic\n');
  mutate(root, 'evidence', rows => Object.assign(rows[0].raw_capture, {
    published: true, repository_path: path, redistribution_status: 'permitted',
    byte_length: 10, content_hash: createHash('sha256').update('synthetic\n').digest('hex'),
  }));
}
test('checks published capture bytes against digest and length', t => {
  const root = fixture(t);
  publishSynthetic(root);
  const result = run(root);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).checked_capture_files, 1);
});
for (const path of ['../outside.txt', '/tmp/outside.txt', 'evidence/public/../private.txt', 'evidence\\public\\data.txt']) {
  test('rejects unsafe capture path ' + path, t => {
    const root = fixture(t);
    publishSynthetic(root, path);
    const result = run(root);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, /Record validation failed/);
  });
}
test('rejects a symlink escaping the public directory', t => {
  const root = fixture(t);
  publishSynthetic(root);
  rmSync(join(root, 'evidence/public/synthetic.txt'));
  symlinkSync(join(root, 'research/records/claims.json'), join(root, 'evidence/public/synthetic.txt'));
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /capture path/);
});
for (const kind of ['digest', 'length', 'missing', 'rights']) {
  test('rejects published capture with invalid ' + kind, t => {
    const root = fixture(t);
    publishSynthetic(root);
    if (kind === 'digest') writeFileSync(join(root, 'evidence/public/synthetic.txt'), 'different\n');
    if (kind === 'length') mutate(root, 'evidence', rows => rows[0].raw_capture.byte_length = 1);
    if (kind === 'missing') rmSync(join(root, 'evidence/public/synthetic.txt'));
    if (kind === 'rights') mutate(root, 'evidence', rows => rows[0].raw_capture.redistribution_status = 'not_established');
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Record validation failed/);
  });
}
test('fails closed for malformed JSON without echoing input', t => {
  const root = fixture(t);
  writeFileSync(join(root, 'research/records/claims.json'), '{ synthetic-sensitive-input');
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Record validation failed/);
  assert.doesNotMatch(result.stderr, /synthetic-sensitive-input/);
});
test('fails closed when a required records file is absent', t => {
  const root = fixture(t);
  rmSync(join(root, 'research/records/versions.json'));
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Record validation failed/);
});

test('rejects an empty evidence foundation', t => {
  const root = fixture(t);
  for (const name of ['claims', 'evidence', 'versions']) mutate(root, name, rows => rows.splice(0));
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Record validation failed/);
});
test('rejects a public-directory symlink into private repository data', t => {
  const root = fixture(t);
  publishSynthetic(root);
  rmSync(join(root, 'evidence/public'), { recursive: true });
  mkdirSync(join(root, 'private'));
  writeFileSync(join(root, 'private/synthetic.txt'), 'synthetic\n');
  symlinkSync(join(root, 'private'), join(root, 'evidence/public'));
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /capture path/);
});
for (const [name, file, change] of [
  ['stale source support', 'versions', (rows: any[]) => rows[0].needs_revalidation = true],
  ['overlapping evidence roles', 'claims', (rows: any[]) => rows[7].counterevidence_ids = rows[7].evidence_ids],
  ['refutation without counterevidence', 'claims', (rows: any[]) => rows[7].support_status = 'refuted'],
  ['conflict without counterevidence', 'claims', (rows: any[]) => rows[7].support_status = 'conflicting'],
] as const) {
  test('rejects ' + name, t => {
    const root = fixture(t);
    mutate(root, file, change);
    assert.equal(run(root).status, 1);
  });
}

test('rejects refutation borrowed from a different documentation version', t => {
  const root = fixture(t);
  mutate(root, 'versions', rows => rows.push({ ...rows[0], version_id: 'VER-OLDER', source_ids: ['S2'] }));
  mutate(root, 'evidence', rows => rows.push({ ...rows[0], evidence_id: 'EVD-OLDER', version_id: 'VER-OLDER' }));
  mutate(root, 'claims', rows => Object.assign(rows[7], {
    support_status: 'refuted', evidence_ids: [], counterevidence_ids: ['EVD-OLDER'],
  }));
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /version mismatch/);
});
for (const status of ['refuted', 'conflicting']) {
  test('rejects stale ' + status + ' conclusions', t => {
    const root = fixture(t);
    mutate(root, 'claims', rows => {
      for (const row of rows) if (row.scope_kind === 'source_description_only') row.support_status = 'unverified';
      Object.assign(rows[7], { support_status: status, counterevidence_ids: ['EVD-DOC-S3'] });
    });
    mutate(root, 'versions', rows => rows[0].needs_revalidation = true);
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /revalidation/);
  });
}

for (const name of ['evidence', 'versions']) {
  test('rejects duplicate ' + name + ' IDs with different contents', t => {
    const root = fixture(t);
    mutate(root, name, rows => rows.push({ ...rows[0], limitations: ['Synthetic changed content.'] }));
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Duplicate record ID/);
  });
}
for (const status of ['refuted', 'conflicting']) {
  test('accepts same-version ' + status + ' evidence roles', t => {
    const root = fixture(t);
    // Synthetic relationship only; it does not assert that S3 actually refutes S2.
    mutate(root, 'claims', rows => Object.assign(rows[7], {
      support_status: status, counterevidence_ids: ['EVD-DOC-S3'],
    }));
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).protocol_reproduced, false);
  });
}
test('accepts an unverified claim awaiting version revalidation', t => {
  const root = fixture(t);
  mutate(root, 'claims', rows => {
    for (const row of rows) if (row.scope_kind === 'source_description_only') row.support_status = 'unverified';
  });
  mutate(root, 'versions', rows => rows[0].needs_revalidation = true);
  const result = run(root);
  assert.equal(result.status, 0, result.stderr);
});
