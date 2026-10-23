import {execFileSync} from 'node:child_process';
const base=process.argv[2];if(!base||/^0+$/.test(base)){console.log('Initial commit: no prior editions to compare.');process.exit(0)}
if(!/^[a-f0-9]{40,64}$/.test(base))throw new Error('Expected a full base commit SHA');
const changed=execFileSync('git',['diff','--name-status',base,'HEAD','--','content/editions'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const bad=changed.filter(line=>!line.startsWith('A\t'));
if(bad.length)throw new Error('Published edition files are immutable. Add the next version instead of modifying/removing old files.\n'+bad.join('\n'));
console.log('Existing edition files are unchanged.');
