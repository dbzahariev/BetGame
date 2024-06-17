const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const axios = require('axios');
const { clearInterval, setInterval } = require("timers");

var cors = require('cors')

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8080; // Step 1

const routes = require("./routes/api");
const routesChat = require("./routes/chat")

require("dotenv").config();

// Step 2
let newUrl =
  "mongodb+srv://ramsess90:Abc123456@cluster0.ewmw7.mongodb.net/db1?retryWrites=true&w=majority";
let oldUrl = "mongodb://localhost/mern_youtube";

if (process.env.MONGODB_URI === undefined) {
  console.log("Not found DB (process.env.MONGODB_URI)!");
}

mongoose.connect(process.env.MONGODB_URI || newUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected!!!!");
});

// Data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Step 3

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Timer
let times = 1
function bb() {
  axios.get("https://dworld.onrender.com/api/users")
    .then((response) => {
      console.log('Triger awake', times)
      if (times === 9000) {
        clearInterval(timer)
      }
      times += 1
    })
    .catch((err) => {
      console.log("Unable to fetch -", err.message);
    });
}
const timer = setInterval(bb, 600 * 1000);

// HTTP request logger
app.use(morgan("tiny"));



const selected = { version: "v4", competition: "2018" }



app.get('/api/db/matches', (req, res) => {
  const apiUrl = `https://api.football-data.org/${selected.version}/competitions/${selected.competition}/matches`;
  const apiHeaders = {
    'X-Auth-Token': 'c8d23279fec54671a43fcd93068762d1'
  };

  axios.get(apiUrl, { headers: apiHeaders })
    .then(response => {
      res.setHeader('Content-Type', 'application/json');
      res.status(response.status).json(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.get('/groups/api/db/matches', (req, res) => {
  const apiUrl = `https://api.football-data.org/${selected.version}/competitions/${selected.competition}/matches`;
  const apiHeaders = {
    'X-Auth-Token': 'c8d23279fec54671a43fcd93068762d1'
  };

  axios.get(apiUrl, { headers: apiHeaders })
    .then(response => {
      res.setHeader('Content-Type', 'application/json');
      res.status(response.status).json(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.get('/groups/api/db/standings', (req, res) => {
  const apiUrl = `https://api.football-data.org/${selected.version}/competitions/${selected.competition}/standings`;
  const apiHeaders = {
    'X-Auth-Token': 'c8d23279fec54671a43fcd93068762d1'
  };

  axios.get(apiUrl, { headers: apiHeaders })
    .then(response => {
      res.setHeader('Content-Type', 'application/json');
      res.status(response.status).json(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.get('/api/db/teams', (req, res) => {
  console.log("get Tems")
  const apiUrl = `https://api.football-data.org/${selected.version}/competitions/${selected.competition}/teams`;
  const apiHeaders = {
    'X-Auth-Token': 'c8d23279fec54671a43fcd93068762d1'
  };

  axios.get(apiUrl, { headers: apiHeaders })
    .then(response => {
      res.setHeader('Content-Type', 'application/json');
      res.status(response.status).json(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});






app.use("/api", routes);
app.use("/chat", routesChat);

app.listen(PORT, console.log(`Server is starting at ${PORT}`));
