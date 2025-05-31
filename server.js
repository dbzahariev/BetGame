const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const DIST = path.join(__dirname, 'client', 'dist', 'client', 'browser', 'browser');

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/db/matches') && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([
      { id: 1, name: 'Match One' },
      { id: 2, name: 'Match Two' },
      { id: 3, name: 'Match Three' }
    ]));
    return;
  }

  // Static file
  let file = req.url === '/' ? 'index.html' : req.url.split('?')[0];
  let filePath = path.join(DIST, file);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const types = {
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.html': 'text/html',
      '.ico': 'image/x-icon',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg'
    };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    return fs.createReadStream(filePath).pipe(res);
  }

  // SPA fallback
  fs.readFile(path.join(DIST, 'index.html'), (err, data) => {
    if (err) return res.writeHead(500).end('Internal Server Error');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
io.on('connection', s => {
  console.log('User connected:', s.id);
  s.on('disconnect', () => console.log('User disconnected:', s.id));
});

const HOST = '0.0.0.0';
server.listen(PORT, HOST, () => console.log(`Server running at http://${HOST}:${PORT}/`));