import { mkdirSync, realpathSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
/** Exclusive output into a dedicated directory; never traverses directory symlinks. */
export function writeNew(root:string,area:'data/private'|'evidence/public',name:string,bytes:string){
  if(!/^[A-Z0-9][A-Z0-9-]{0,79}\.json$/.test(name))throw new Error('Unsafe output file name');
  let base:string;
  try{base=realpathSync(root);}catch{throw new Error('Output root directory unavailable');}
  let directory=base;
  for(const part of area.split('/')){
    directory=join(directory,part);
    try{mkdirSync(directory,{mode:area==='data/private'?0o700:0o755});}catch(error){if((error as NodeJS.ErrnoException).code!=='EEXIST')throw new Error('Output directory unavailable');}
    if(realpathSync(directory)!==resolve(directory))throw new Error('Unsafe output directory');
  }
  try{writeFileSync(join(directory,name),bytes,{flag:'wx',mode:area==='data/private'?0o600:0o644});}
  catch(error){throw new Error((error as NodeJS.ErrnoException).code==='EEXIST'?'Output file already exists':'Output write failed');}
  return area+'/'+name;
}
