const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const publicFiles = new Set(['index.html', 'styles.css', 'app.js']);
http.createServer((req, res) => {
  let requested;
  try { requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, '') || 'index.html'; } catch { res.writeHead(400).end(); return; }
  const file = path.resolve(root, requested);
  if (!file.startsWith(root + path.sep) || !(publicFiles.has(requested) || requested.startsWith('assets/'))) { res.writeHead(404).end('Não encontrado'); return; }
  fs.readFile(file, (err, bytes) => {
    if (err) { res.writeHead(404).end('Não encontrado'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }); res.end(bytes);
  });
}).listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));
