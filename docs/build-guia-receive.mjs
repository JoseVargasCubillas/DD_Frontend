import http from 'node:http';
import fs from 'node:fs';
const out = process.argv[2];
http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.end();
  const chunks = [];
  req.on('data', c => chunks.push(c));
  req.on('end', () => {
    const body = Buffer.concat(chunks);
    fs.writeFileSync(out, body);
    console.log('saved', body.length);
    res.end('ok');
    setTimeout(() => process.exit(0), 200);
  });
}).listen(4399, () => console.log('listening 4399'));
