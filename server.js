const mongoose = require('mongoose');
const bParser = require('body-parser');
const session = require('express-session');
const http = require('http');
const https = require('https');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passwordHash = require('password-hash');
const express = require('express');
require('dotenv').config();
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB}`).then(() => {
  console.log('Connected successfully.');
}, err => {
  console.log('Connection to db failed: ' + err);
});

const Schema = mongoose.Schema;
const projectSchema = new Schema({
  user: String,
  title: String,
  content: String,
});
const proUserSchema = new Schema({
  username: String,
  password: String,
});

const Project = mongoose.model('Project', projectSchema);
const ProUser = mongoose.model('ProUser', proUserSchema);

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

// add the user in session
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
app.use(express.static('public'));
app.use(session({
  secret: 'asd',
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

/*------------------ Temp DB :) ----------------------*/
let database = [
  {
    user: 'test',
    title: 'firstproject',
    content: 'wasdwasdwasd qwerqwerqwre project!'
  },
  {
    user: 'test',
    title: 'proper project',
    content: 'Kissa (ransk. chat) on eräänlainen tappavaa eläintä muistuttava hirvittävä peto, joka on ulkonäöltään karvainen olento (Myös karvattomia löytyy). Se kiljaisee hännän päälle astuttaessa ja saattaa pahimmillaan syödä koskemattomuuttaan loukanneen henkilön. Kissalla on tunnusomaiset korvat, silmät, etujalat ja valkotäpläinen ruotomainen häntä, jonka avulla se kykenee muun muassa tasapainoilemaan piha-aidan harjalla ja koivunoksalla. Kun kissa tapaa vihollisen, jonka se arvioi olevan sitä itseään voimakkaampi, se tipauttaa kaikki karvansa ja pakenee karvanlähdön suoman paniikinomaisen hämmästyksen turvin.',
  }
];
const getTitles = () => {
  let array = [];
  for (let project of database) {
    array.push(project.title);
  }
  return array;
};
/*------------------ Temp DB :) ----------------------*/

// ProUser.find((err, results) => {
//   console.log(results);
// });

// Gets
app.get('/', (req, res) => {
  res.redirect('/index.html');
});
app.post('/project', (req, res) => {
  res.send(JSON.stringify(database[req.body.id]));
});
app.post('/updateProject', (req, res) => {
  console.log(`Updated ${req.body.title}`);
  database[req.body.id].title = req.body.title;
  database[req.body.id].content = req.body.content;
  res.sendStatus(200);
});
app.post('/addProject', (req, res) => {
  console.log(`Added project ${req.body.title}`);
  const obj = {
    user: '',
    title: '',
    content: '',
  };
  database.push(obj);
  database[database.length - 1].title = req.body.title;
  database[database.length - 1].content = req.body.content;
  res.sendStatus(200);
});
app.get('/projects', (req, res) => {
  res.send(getTitles());
});
app.post('/authorize',
  passport.authenticate('local', {
    successRedirect: '/index.html',
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

app.listen(3000);