const express = require("express");
const mongoose = require("mongoose");
const { clearInterval, setInterval } = require("timers");
const cors = require('cors');
// const backupNow = require('./backup/Backup2024.json')
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

require('dotenv').config();

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const app = express();
const PORT = process.env.PORT || 8080;

// Set up middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Mongoose is connected!'))
  .catch(err => console.error('Connection error:', err));

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const angularDistPath = path.join(__dirname, 'client', 'dist', 'client', 'browser');
  app.use(express.static(angularDistPath));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(angularDistPath, 'index.html'));
  });
}
// if (process.env.NODE_ENV === "production") {
//   const angularDistPath = path.join(__dirname, 'client', 'dist', 'client', 'browser'); // провери името на проекта!
//   app.use(express.static(angularDistPath));

//   // Catch-all for Angular routing
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(angularDistPath, 'index.html'));
//   });
// }

// Set up a timer to trigger an API request every 10 minutes
let times = 1;
const timerFunction = async () => {
  // try {
  //   const response = await fetch("https://dworld.onrender.com/api/users");
  //   if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  //   console.log('Trigger awake', times);
  //   if (times === 9000) clearInterval(timer);
  //   times += 1;
  // } catch (err) {
  //   console.error("Unable to fetch -", err.message);
  // }
};
const timer = setInterval(timerFunction, 600 * 1000);

// Function to make the API request and handle response
const fetchFootballData = async (endpoint, res) => {
  const selected = { version: "v4", competition: "2018" };

  const apiUrl = `https://api.football-data.org/${selected.version}/competitions/${selected.competition}/${endpoint}`;
  try {
    const response = await fetch(apiUrl, { headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY } });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    res.setHeader('Content-Type', 'application/json');
    res.status(response.status).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// In-memory cache for standings
let standingsCache = null;
let standingsCacheTime = 0;
const STANDINGS_TTL = 10 * 1000; // 10 секунди в ms

// Set up routes for football data
app.get('/api/db/matches', (req, res) => {
  console.log('Using backup data for matches');
  try {
    fetchFootballData("matches", res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.get('/groups/api/db/standings', async (req, res) => {
//   try {
//     res.setHeader('Content-Type', 'application/json');
//     const now = Date.now();
//     if (standingsCache && (now - standingsCacheTime < STANDINGS_TTL)) {
//       io.emit('data-updated', { message: 'Cached data on standings', data: standingsCache });
//       return res.status(200).json(standingsCache);
//     }
//     const selected = { version: "v4", competition: "2018" };
//     const apiUrl = `https://api.football-data.org/${selected.version}/competitions/${selected.competition}/standings`;
//     const response = await fetch(apiUrl, { headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY } });
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     const data = await response.json();
//     standingsCache = data;
//     standingsCacheTime = now;
//     io.emit('data-updated', { message: 'Refreshed data on standings', data: standingsCache });
//     res.status(200).json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.get('/api/db/teams', (req, res) => {
  fetchFootballData("teams", res);
});

// function simulateChange() {
//   io.emit('data-updated', { message: 'New data available', timestamp: new Date() });
// }
// setInterval(simulateChange, STANDINGS_TTL);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => { });
});

// Start server
server.listen(PORT, () => console.log(`Server is starting at ${PORT}`));
