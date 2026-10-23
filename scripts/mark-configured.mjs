import fs from 'node:fs/promises';
import path from 'node:path';
import {root} from '../lib/store.mjs';
const file=path.join(root,'config.json'),config=JSON.parse(await fs.readFile(file,'utf8'));
const repo=process.env.GITHUB_REPOSITORY;if(!repo||!/^[-\w.]+\/[-\w.]+$/.test(repo))throw new Error('Valid GitHub repository context required');
config.repositoryUrl='https://github.com/'+repo;
config.automationStatus='active';
config.automationNote='A daily research run completed successfully on '+new Date().toISOString()+'. GitHub Actions is configured for 05:17 UTC each day, covering the previous UTC date. Failed evidence checks leave a visible gap. '+(process.env.PUBLISH_MODE==='review'?'New editions require a pull-request review before publication.':'Verified new editions publish automatically.');
await fs.writeFile(file,JSON.stringify(config,null,2)+'\n');
