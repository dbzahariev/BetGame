require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Mongoose connected to MongoDB'))
  .catch(err => console.error('Mongoose connection error:', err));

const PORT = 8080;
const DIST = path.join(__dirname, 'client', 'dist', 'client', 'browser', 'browser');

const matches = [
  { id: 1, name: 'Match One' },
  { id: 2, name: 'Match Two' },
  { id: 3, name: 'Match Three' },
  { id: 4, name: 'Match Four' },
  { id: 5, name: 'Match Five' }
];

const users = [
  { id: 1, name: 'User One' },
  { id: 2, name: 'User Two' },
  { id: 3, name: 'User Three' },
  { id: 4, name: 'User Four' },
  { id: 5, name: 'User Five' }
];

const server = http.createServer((req, res) => {
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

  s.on('join', (data) => {
    s.join(data.room)
    emitData();
  });

  s.on('leave', (data) => {
    s.leave(data.room);
    emitData();
  });

  s.on('getGamesFromDb', async () => {
    try {
      const Game = mongoose.model('Game', new mongoose.Schema({}, { strict: false }), 'games');
      const games = await Game.find({}).lean();
      s.emit('gamesFromDb', games);
    } catch (err) {
      s.emit('gamesFromDb', { error: 'Failed to fetch games', details: err.message });
    }
  });

  s.on('getMatchesFromDb', () => {
    // Example: Replace with your DB logic
    // If you use mongoose: Matches.find({}, ...)
    // Here, just send the matches array
    s.emit('matchesFromDb', matches);
  });

  s.on('getUsersFromDb', () => {
    // Example: Replace with your DB logic
    // If you use mongoose: Users.find({}, ...)
    // Here, just send the users array
    s.emit('usersFromDb', users);
  });
});

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

function emitData() {
  let isHaveUser = (io.sockets.adapter.rooms.get('users')?.size || 0) > 0;
  let isHaveMatche = (io.sockets.adapter.rooms.get('matches')?.size || 0) > 0;
  if (isHaveMatche) {
    console.log('Emitting matches');
    io.to('matches').emit('matches', matches);
  }
  if (isHaveUser) {
    console.log('Emitting users');
    io.to('users').emit('users', users);
  }
}

// Periodically emit matches every 3 seconds
setInterval(() => {
  emitData();
}, 3 * 1000); // every 3 seconds
