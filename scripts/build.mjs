import fs from 'node:fs/promises';
import path from 'node:path';
import {root,readEditions,sha} from '../lib/store.mjs';
const editions=await readEditions(),config=JSON.parse(await fs.readFile(path.join(root,'config.json'),'utf8'));
const dist=path.join(root,'dist');await fs.mkdir(dist,{recursive:true});
for(const f of ['index.html','app.js','style.css','favicon.svg'])await fs.copyFile(path.join(root,'web',f),path.join(dist,f));
const catalog={schemaVersion:1,builtAt:new Date().toISOString(),config:{title:config.title,repositoryUrl:config.repositoryUrl,automationStatus:config.automationStatus,automationNote:config.automationNote},editions:[]};
for(const day of editions){for(const v of day.versions){const dest=path.join(dist,v.path);await fs.mkdir(path.dirname(dest),{recursive:true});await fs.copyFile(path.join(root,'content','editions',day.date,`v${v.data.revision.number}.json`),dest)}const ed=day.versions.at(-1).data;catalog.editions.push({date:day.date,kind:ed.kind,versions:day.versions.map(v=>({...v.data.revision,path:v.path,sha256:v.sha256})),stories:ed.stories.map(st=>({id:st.id,eventId:st.eventId,region:st.region,tags:st.tags,searchText:[st.title,st.summary,st.eventId,st.whyItMatters,...st.tags,...st.articles.flatMap(a=>[a.headline,a.outlet.name,a.outlet.country,a.lens.label,a.lens.rationale]),...st.commonFacts.map(f=>f.text)].join(' ')}))})}
await fs.mkdir(path.join(dist,'data'),{recursive:true});await fs.writeFile(path.join(dist,'data','archive.json'),JSON.stringify(catalog)+'\n');await fs.writeFile(path.join(dist,'.nojekyll'),'');
await fs.writeFile(path.join(dist,'robots.txt'),'User-agent: *\nAllow: /\n');
console.log(`Built ${editions.length} editions, ${editions.length*9} linked articles. Static output: dist/`);
