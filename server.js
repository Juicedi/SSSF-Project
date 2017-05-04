'use strict';
const mongoose = require('mongoose');
const bParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passwordHash = require('password-hash');
const http = require('http');
const https = require('https');
const express = require('express');
const app = express();
require('dotenv').config();
const middlewares = require('./modules/middlewares.js');
const socketFunc = require('./modules/socketFunc.js');

const sessionConfig = {
  secret: 'asd',
  resave: true,
  saveUninitialized: true,
};
const openedFiles = {};
const saveFromMemory = (id, content) => {
  console.log('autosaving :: ' + content);
  const query = {
    _id: id,
  };
  const data = {
    _id: id,
    content: content,
  };
  Project.update(query, data).then(() => {
    console.log('Updated project');
  });
};

if (process.env.ENV == 'dev') {
  console.log('starting server and socket (Local)');
  const fs = require('fs');
  // Handle incoming connections from clients
  const sslkey = fs.readFileSync('ssl-key.pem');
  const sslcert = fs.readFileSync('ssl-cert.pem');
  const options = {
    key: sslkey,
    cert: sslcert
  };
  const server = https.createServer(options, app);
  const io = require('socket.io').listen(server);
  io.sockets.on('connection', (socket) => {
    console.log('Socket connected');
    socket.on('room', (data) => {
      socket.leave(data.oldRoom);
      if (data.oldRoom != null) {
        if (typeof io.sockets.adapter.rooms[data.oldRoom] == 'undefined' && typeof openedFiles[data.oldRoom] != 'undefined') {
          saveFromMemory(data.oldRoom, openedFiles[data.oldRoom]);
          delete openedFiles[data.oldRoom];
        }
      }
      socket.join(data.newRoom);
    });
    socket.on('message', (jsonMsg) => {
      // console.log('received message from client: ' + JSON.stringify(jsonMsg));
      const response = {
        msg: jsonMsg.text,
      };
      openedFiles[jsonMsg.room] = jsonMsg.text;
      io.in(jsonMsg.room).emit('message', response);
    });
    socketFunc.initSockets(socket, io);
  });
  server.listen(3000);
} else {
  console.log('starting server and socket (Jelastic)');
  app.enable('trust proxy');
  app.use((req, res, next) => {
    if (req.secure) {
      console.log('connected using https');
      // request was via https, so do no special handling
      next();
    } else {
      console.log('connected using http... redirecting to https');
      // request was via http, so redirect to https
      res.redirect('https://' + req.headers.host + req.url);
    }
  });
  const server = app.listen(3000, () => { console.log('server up?'); });
  const io = require('socket.io').listen(server);
  io.sockets.on('connection', (socket) => {
    console.log('Socket connected');
    socket.on('room', (data) => {
      socket.leave(data.oldRoom);
      if (data.oldRoom != null) {
        if (typeof io.sockets.adapter.rooms[data.oldRoom] == 'undefined' && typeof openedFiles[data.oldRoom] != 'undefined') {
          saveFromMemory(data.oldRoom, openedFiles[data.oldRoom]);
          delete openedFiles[data.oldRoom];
        }
      }
      socket.join(data.newRoom);
    });
    socket.on('message', (jsonMsg) => {
      // console.log('received message from client: ' + JSON.stringify(jsonMsg));
      const response = {
        msg: jsonMsg.text,
      };
      openedFiles[jsonMsg.room] = jsonMsg.text;
      io.in(jsonMsg.room).emit('message', response);
    });
    socketFunc.initSockets(socket, io);
  });
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
  return done(null, user.username);
});
passport.deserializeUser((user, done) => {
  return done(null, user);
});
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(middlewares.redirectIfNotUser);
app.use(express.static('public'));

// Project.find().exec().then((projects) => {
//   console.log(projects);
// });

app.get('/', (req, res) => {
  res.redirect('/login.html');
});
app.get('/app', (req, res) => {
  res.redirect('/app.html?u=' + req.user);
});
app.post('/project', (req, res) => {
  console.log(openedFiles);
  if (typeof openedFiles[req.body.id] !== 'undefined') {
    const data = [{
      _id: req.body.id,
      content: openedFiles[req.body.id],
    }];
    console.log(data);
    res.send(data);
  } else {
    Project.find().where('_id').equals(req.body.id).exec().then((project) => {
      res.send(project);
    });
  }

});
app.post('/addProject', (req, res) => {
  console.log(`Added project ${req.body.username}`);
  const obj = {
    user: req.body.username,
    group: '',
    shared: [],
    comments: [],
    title: 'New Project',
    content: 'Placeholder Text',
  };
  Project.create(obj).then((post) => {
    console.log('Added project ' + post);
  });
  res.sendStatus(200);
});
app.post('/updateProject', (req, res) => {
  const query = {
    _id: req.body.id,
  };
  const data = {
    _id: req.body.id,
    content: req.body.content,
  };
  Project.update(query, data).then((post) => {
    console.log('Updated project ' + post.result);
  });
  res.sendStatus(200);
});
app.post('/addShare', (req, res) => {
  Project.findOne().where('_id').equals(req.body.id).exec().then((project) => {
    let array = project.shared.slice();
    array.push(req.body.user);
    const query = { _id: req.body.id };
    const data = {
      _id: req.body.id,
      shared: array,
    };
    if (project.shared.indexOf(req.body.user) === -1 && project.user !== req.body.user) {
      Project.update(query, data).then(() => {
        res.send('Project shared with new user');
      });
    } else {
      res.send('This is already shared with given user');
    }
  });
});
app.post('/removeShare', (req, res) => {
  Project.findOne().where('_id').equals(req.body.id).exec().then((project) => {
    let array = project.shared.slice();
    const itemIndex = project.shared.indexOf(req.body.user);
    if (itemIndex > -1) {
      array.splice(itemIndex, 1);
    }
    const query = { _id: req.body.id };
    const data = {
      _id: req.body.id,
      shared: array,
    };
    Project.update(query, data).then(() => {
      res.send('Removed user from shared list');
    });
  });
});
app.post('/getShared', (req, res) => {
  Project.findOne().where('_id').equals(req.body.id).exec().then((project) => {
    res.send(project.shared);
  });
});
app.post('/updateProjectTitle', (req, res) => {
  const query = {
    _id: req.body.id,
  };
  const data = {
    _id: req.body.id,
    title: req.body.title,
  };
  Project.update(query, data).then((post) => {
    console.log('title updated');
  });
  res.sendStatus(200);
});
app.post('/projects', (req, res) => {
  console.log('Searching titles for the user: ' + req.body.username);
  Project.find().where('user').equals(req.body.username).exec().then((results, err) => {
    if (err) {
      res.status(500).send(err);
    }
    res.send(results);
  });
});
app.post('/getSharedProjects', (req, res) => {
  Project.find({ shared: req.body.username }).exec().then((results, err) => {
    if (err) {
      res.status(500).send(err);
    }
    res.send(results);
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
  res.redirect('/login');
});
app.get('/login', (req, res) => {
  res.redirect('login.html');
});
app.post('/removeProject', (req, res) => {
  Project.remove({ _id: req.body.id }).then((post) => {
    console.log(post);
    res.sendStatus(200);
  });
});

http.createServer((req, res) => {
  res.writeHead(301, { 'Location': 'https://localhost:' + req.url });
  res.end();
}).listen(8080);
