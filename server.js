const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');

const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store'
};
const server = http.createServer((req, res) => {
  if (req.url === '/api/db/matches' && req.method === 'GET') {
    const matches = [
      { id: 1, name: 'Match One' },
      { id: 2, name: 'Match Two' },
      { id: 3, name: 'Match Three' }
    ];
    res.writeHead(200, headers);
    res.end(JSON.stringify(matches));
    return;
  }

  if (req.url === '/' && req.method === 'GET') {
    // Serve the Angular index.html for the root URL
    fs.readFile(__dirname + '/client/src/index.html', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  if (req.url === '/api/hello' && req.method === 'GET') {
    io.emit('message', 'A request was made to the server');
    res.writeHead(200, headers);
    res.end(JSON.stringify({ message: 'Hello, world!' }));
  } else {
    res.writeHead(404, headers);
    res.end(JSON.stringify({ message: 'Not found' }));
  }
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