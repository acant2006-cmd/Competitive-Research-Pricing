import {readFile,mkdir,rm,cp,writeFile} from 'node:fs/promises';
import {validate} from '../src/model.js';
const root=new URL('../',import.meta.url),d=JSON.parse(await readFile(new URL('data/defaults.json',root),'utf8'));
validate(d.model);const data=JSON.parse(await readFile(new URL('data/competitor_data.json',root),'utf8'));
if(data.competitors.length!==4||data.pricing_offers.length!==19)throw Error('Unexpected Mission 1 research snapshot.');
for(const file of ['src/app.js','src/model.js','src/report.js','src/style.css','index.html']){const content=await readFile(new URL(file,root),'utf8');if(/\/(Users|workspace)\//.test(content))throw Error('Local path in runtime file '+file);}
await rm(new URL('dist',root),{recursive:true,force:true});await mkdir(new URL('dist',root));
for(const path of ['index.html','src','data'])await cp(new URL(path,root),new URL('dist/'+path,root),{recursive:true});
await writeFile(new URL('dist/.nojekyll',root),'');console.log('Built static laboratory: 24 costs, 4 competitors, 19 offers. No external runtime dependencies.');
