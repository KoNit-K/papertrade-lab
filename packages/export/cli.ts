import { readFileSync } from 'node:fs';
import { exportReviewed } from './safe.ts';
try{
 if(process.argv.length!==4)throw new Error('usage');
 const raw=readFileSync(process.argv[2]),approval=JSON.parse(readFileSync(process.argv[3],'utf8'));
 console.log(JSON.stringify(exportReviewed(raw,approval,process.cwd())));
}catch{console.error('Export rejected. Usage: pnpm export:metadata <private-packet.json> <approval.json>. Review the exact bytes and declaration.');process.exitCode=1;}
