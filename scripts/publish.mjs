import fs from 'node:fs/promises';
import path from 'node:path';
import {root,sha,writeExclusive,readEditions} from '../lib/store.mjs';
import {validateEdition,assert} from '../lib/validate.mjs';
const args=process.argv.slice(2),file=args.find(a=>!a.startsWith('--'));assert(file,'Usage: node scripts/publish.mjs path/to/draft.json [--human-reviewed --reviewer=NAME]');
const resolved=path.resolve(root,file),raw=await fs.readFile(resolved,'utf8'),ed=JSON.parse(raw);
const human=args.includes('--human-reviewed'),reviewer=args.find(a=>a.startsWith('--reviewer='))?.slice(11);
if(human){assert(reviewer&&reviewer.trim(),'Human review requires --reviewer=NAME');ed.review={status:'human-reviewed',reviewer,note:'A human editor reviewed source accessibility, date accuracy, source independence, supported facts and contrasting framing.'}}else{const receipt=JSON.parse(await fs.readFile(resolved.replace(/\.json$/,'.receipt.json'),'utf8'));assert(receipt.pass&&receipt.draftSha256===sha(raw),'Draft changed or verification receipt missing; obtain a new review');assert(receipt.date===ed.date&&Date.now()-Date.parse(receipt.checkedAt)<48*3600000,'Verification receipt expired; recheck sources or use explicit human review')}
validateEdition(ed);const editions=await readEditions(),existing=editions.find(d=>d.date===ed.date);
assert(ed.revision.number===(existing?.versions.length||0)+1,'Duplicate day/version or nonconsecutive revision');
if(existing){assert(human,'Corrections require explicit human review');assert(ed.recordedAt===existing.versions[0].data.recordedAt,'Preserve original recordedAt');assert(Date.parse(ed.revision.at)>Date.parse(existing.versions.at(-1).data.revision.at),'Correction must have a new timestamp')}
await writeExclusive(path.join(root,'content','editions',ed.date,`v${ed.revision.number}.json`),ed);
console.log(`Published immutable edition ${ed.date} v${ed.revision.number}. Commit and deploy to make it visible.`);
