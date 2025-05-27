const express = require("express");
const mongoose = require("mongoose");
const axios = require('axios');
const { clearInterval, setInterval } = require("timers");
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Import routes
const routes = require("./routes/api");
const routesChat = require("./routes/chat");

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
  app.use(express.static("client/build"));
}

// Set up a timer to trigger an API request every 10 minutes
let times = 1;
const timerFunction = () => {
  axios.get("https://dworld.onrender.com/api/users")
    .then(() => {
      console.log('Trigger awake', times);
      if (times === 9000) clearInterval(timer);
      times += 1;
    })
    .catch((err) => {
      console.error("Unable to fetch -", err.message);
    });
};
const timer = setInterval(timerFunction, 600 * 1000);

// Define common API URL base and headers
const selected = { version: "v4", competition: "2018" };
const apiHeaders = { 'X-Auth-Token': process.env.FOOTBALL_API_KEY, };

// Function to make the API request and handle response
const fetchFootballData = (endpoint, res) => {
  const apiUrl = `https://api.football-data.org/${selected.version}/competitions/${selected.competition}/${endpoint}`;
  axios.get(apiUrl, { headers: apiHeaders })
    .then(response => {
      res.setHeader('Content-Type', 'application/json');
      res.status(response.status).json(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};

// Set up routes for football data
app.get('/api/db/matches', (req, res) => {
  fetchFootballData("matches", res);
});

app.get('/groups/api/db/standings', (req, res) => {
  fetchFootballData("standings", res);
});

app.get('/api/db/teams', (req, res) => {
  fetchFootballData("teams", res);
});

// Use the imported routes
app.use("/api", routes);
app.use("/chat", routesChat);

// Start server
app.listen(PORT, () => console.log(`Server is starting at ${PORT}`));
