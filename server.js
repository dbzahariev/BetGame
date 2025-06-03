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
let users = [];

const matches = [
  { id: 1, name: 'Match One' },
  { id: 2, name: 'Match Two' },
  { id: 3, name: 'Match Three' },
  { id: 4, name: 'Match Four' },
  { id: 5, name: 'Match Five' }
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
    console.log('somone join', data)
    s.join(data.room)
    emitData();

    if (data.room === 'users') {
      console.log('User joined users room');
      getUsers(io);
    }
  });

  s.on('leave', (data) => {
    s.leave(data.room);
    emitData();
  });


  // s.on('getUsersFromDb', async () => {
  //   getUsers(io);
  //   // try {
  //   //   let Game;
  //   //   try {
  //   //     Game = mongoose.model('Game');
  //   //   } catch (e) {
  //   //     Game = mongoose.model('Game', new mongoose.Schema({}, { strict: false }), 'games');
  //   //   }
  //   //   const gamesRes = await Game.find({}).lean();
  //   //   console.log('on getGamesFromDb', gamesRes);
  //   //   s.emit('gamesFromDb', gamesRes);
  //   // } catch (err) {
  //   //   s.emit('gamesFromDb', { error: 'Failed to fetch games', details: err.message });
  //   // }
  // });
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
  let isHaveMatche = (io.sockets.adapter.rooms.get('matches')?.size || 0) > 0;
  if (isHaveMatche) {
    io.to('matches').emit('matches', matches);
  }
}

function getUsers(io) {
  try {
    let Game;
    try {
      Game = mongoose.model('Game');
    } catch (e) {
      Game = mongoose.model('Game', new mongoose.Schema({}, { strict: false }), 'games');
    }
    Game.find({}).lean().then(usersRes => {
      if (JSON.stringify(usersRes) !== JSON.stringify(users)) {
        users = usersRes;
        io.to('users').emit('usersFromDb', users);
      }
    });
  } catch (err) {
    console.error('Failed to fetch users', err);
  }
}

setInterval(() => {
  let isHaveUser = (io.sockets.adapter.rooms.get('users')?.size || 0) > 0;
  if (isHaveUser) {
    getUsers(io);
  }
}, 3 * 1000);

// Periodically emit matches every 3 seconds
setInterval(() => {
  emitData();
}, 3 * 1000); // every 3 seconds
