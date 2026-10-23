import {readEditions} from '../lib/store.mjs';
const editions=await readEditions();
console.log(`Validated ${editions.length} editions and ${editions.reduce((n,d)=>n+d.versions.length,0)} immutable versions.`);
