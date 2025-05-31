const http = require('http');
const { Server } = require('socket.io');

const headers = { 'Content-Type': 'application/json' };
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

  if (
    (req.url === '/' && req.method === 'GET') ||
    (req.url === '/api/hello' && req.method === 'GET')
  ) {
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