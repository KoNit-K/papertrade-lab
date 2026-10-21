import { readFileSync } from 'node:fs';
import { runPlan } from './run.ts';
import { writeNew } from '../evidence/files.ts';

try {
 if(process.argv.length!==4 || !/^[A-Z0-9][A-Z0-9-]{0,79}$/.test(process.argv[3]))throw new Error('usage');
 const plan=JSON.parse(readFileSync(process.argv[2],'utf8'));
 const run=await runPlan(plan);
 const path=writeNew(process.cwd(),'data/private',process.argv[3]+'.json',JSON.stringify(run,null,2)+'\n');
 console.log(JSON.stringify({path,status:run.status,requests:run.outcomes.length}));
 if(run.status!=='completed')process.exitCode=2;
} catch {console.error('Collection failed. Usage: pnpm collect <plan.json> <RUN-ID>. No automatic retry or endpoint fallback.');process.exitCode=1;}
