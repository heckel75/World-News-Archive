import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {root} from '../lib/store.mjs';
const base=path.join(root,'dist'),port=Number(process.env.PORT||4173),types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(base,'.'+(name.endsWith('/')?name+'index.html':name));if(!file.startsWith(base+path.sep))throw new Error();const bytes=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'text/plain','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});res.end(bytes)}catch{res.writeHead(404);res.end('Not found')}}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
