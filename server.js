'use strict';
const mongoose = require('mongoose');
const bParser = require('body-parser');
const session = require('express-session');
const http = require('http');
const https = require('https');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passwordHash = require('password-hash');
const express = require('express');
const app = express();
require('dotenv').config();
const fs = require('fs');
const middlewares = require('./modules/middlewares.js');
const socketFunc = require('./modules/socketFunc.js');

const io = require('socket.io')(3001);

// handle incoming connections from clients
io.sockets.on('connection', (socket) => {
  // once a client has connected, we expect to get a ping from them saying what room they want to join
  console.log(socket.id + ' connected');
  socket.on('room', (room) => {
    socket.leaveAll();
    console.log(room);
    socket.join(room);
    console.log(socket.rooms);
  });
  socket.on('message', (jsonMsg) => {
    console.log('received message from client: ' + JSON.stringify(jsonMsg));
    const response = {
      username: jsonMsg.username,
      msg: jsonMsg.text
    };
    io.in(jsonMsg.room).emit('message', response);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const sessionConfig = {
  secret: 'asd',
  resave: true,
  saveUninitialized: true,
};

if (process.env.ENV == 'dev') {
  const sslkey = fs.readFileSync('ssl-key.pem');
  const sslcert = fs.readFileSync('ssl-cert.pem');
  const options = {
    key: sslkey,
    cert: sslcert
  };
  https.createServer(options, app).listen(3000);
} else {
  app.enable('trust proxy');
  app.use((req, res, next) => {
    if (req.secure) {
      // request was via https, so do no special handling
      next();
    } else {
      // request was via http, so redirect to https
      res.redirect('https://' + req.headers.host + req.url);
    }
  });
  app.listen(3000);
}

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB}`).then(() => {
  console.log('Connected to database successfully.');
}, err => {
  console.log('Connection to db failed: ' + err);
});

const Project = require('./modules/projectSchema.js');
const ProUser = require('./modules/projectUserSchema.js');

app.use(bParser.urlencoded({ extended: true }));

// Passport setup
passport.use(new LocalStrategy(
  (username, password, done) => {
    ProUser.find().where('username').equals(username).exec().then((users) => {
      if (users.length > 0) {
        if (username === users[0].username &&
          passwordHash.verify(password, users[0].password) === true) {
          return done(null, {
            username: username,
          });
        } else {
          return done(null, false, {
            error: 'Incorrect credentials.',
          });
        }
      }
      return done(null, false, {
        error: 'Incorrect credentials.',
      });
    });
  }
));

// Add the user in session
passport.serializeUser((user, done) => {
  console.log('serializeUser');
  console.log(user.username);
  return done(null, user.username);
});
passport.deserializeUser((user, done) => {
  console.log('deserializeUser');
  console.log(user);
  return done(null, user);
});
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(middlewares.redirectIfNotUser);
app.use(express.static('public'));


app.get('/', (req, res) => {
  res.redirect('/login.html');
});
app.get('/app', (req, res) => {
  res.redirect('/app.html?u=' + req.user);
});
app.post('/addProject', (req, res) => {
  console.log(`Added project ${req.body.username}`);
  const obj = {
    user: req.body.username,
    group: '',
    shared: [],
    comments: [],
    title: 'new project',
    content: '',
  };
  Project.create(obj).then((post) => {
    console.log(post);
  });
  res.sendStatus(200);
});
app.post('/projects', (req, res) => {
  console.log('Searching titles for the user: ' + req.body.username);
  Project.find().where('user').equals(req.body.username).exec().then((results, err) => {
    if (err) {
      res.status(500).send(err);
    }
    let titles = [];
    for (const object of results) {
      titles.push(object.title);
    }
    res.send(titles);
  });
});
app.post('/authorize',
  passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/login',
    failureFlash: true,
  })
);
app.post('/register', (req, res) => {
  console.log(req.body);
  const hashPass = passwordHash.generate(req.body.password);
  const data = {
    username: req.body.username,
    password: hashPass,
  };
  ProUser.create(data).then((post) => {
    console.log(post.result);
  });
  res.sendStatus(200);
});
app.get('/login', (req, res) => {
  res.redirect('login.html');
});

http.createServer((req, res) => {
  res.writeHead(301, { 'Location': 'https://localhost:3000' + req.url });
  res.end();
}).listen(8080);
