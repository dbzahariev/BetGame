const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store'
};
const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/db/matches') && req.method === 'GET') {
    const matches = [
      { id: 1, name: 'Match One' },
      { id: 2, name: 'Match Two' },
      { id: 3, name: 'Match Three' }
    ];
    res.writeHead(200, headers);
    res.end(JSON.stringify(matches));
    return;
  }

  // Serve static files from Angular build (after ng build)
  const distPath = path.join(__dirname, 'client', 'dist', 'client', 'browser', 'browser');
  const filePath = path.join(distPath, req.url.split('?')[0]);
  if (req.url !== '/' && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType =
      ext === '.js' ? 'application/javascript' :
        ext === '.css' ? 'text/css' :
          ext === '.html' ? 'text/html' :
            ext === '.ico' ? 'image/x-icon' :
              ext === '.json' ? 'application/json' :
                ext === '.png' ? 'image/png' :
                  ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                    'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // Fallback: serve index.html for SPA routes
  fs.readFile(path.join(distPath, 'index.html'), (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});