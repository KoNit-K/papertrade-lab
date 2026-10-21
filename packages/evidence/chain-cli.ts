import { readFileSync } from 'node:fs';
import { validateChainPacket } from './chain.ts';
try{
 if(process.argv.length!==3)throw new Error('usage');
 console.log(JSON.stringify(validateChainPacket(JSON.parse(readFileSync(process.argv[2],'utf8')))));
}catch{console.error('Chain validation failed. Usage: pnpm validate:chain <packet.json>.');process.exitCode=1;}
