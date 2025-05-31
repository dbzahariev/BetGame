const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const DIST = path.join(__dirname, 'client', 'dist', 'client', 'browser', 'browser');

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/db/matches') && req.method === 'GET') {
    const matches = [
      { id: 1, name: 'Match One' },
      { id: 2, name: 'Match Two' },
      { id: 3, name: 'Match Three' }
    ];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(matches));
    io.emit('matches', matches); // emit on success
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
  s.on('disconnect', () => { });
})

function getServerUrl() {
  const address = server.address();
  if (!address) return null;
  let host = address.address;
  if (host === '::') host = 'localhost';
  return `http://${host}:${address.port}/`;
}
server.listen(PORT, () => {
  console.log('Server running at:', getServerUrl());
});

// Periodically emit matches every 3 seconds
setInterval(() => {
  const matches = [
    { id: 1, name: 'Match One' },
    { id: 2, name: 'Match Two' },
    { id: 3, name: 'Match Three' },
    { id: 4, name: 'Match Four' },
    { id: 5, name: 'Match Five' }
  ];
  io.emit('matches', matches);
}, 3 * 1000); // every 3 seconds