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

const Project = mongoose.model('Project', projectSchema);

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
]
const getTitles = () => {
  let array = [];
  for (let project of database) {
    array.push(project.title);
  }
  return array;
}
/*------------------ Temp DB :) ----------------------*/

// Gets
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

app.post('/project', bParser.urlencoded({ extended: true }), (req, res) => {
  const data = req.body;
  res.send(JSON.stringify(database[data.id]));
});

app.post('/updateProject', bParser.urlencoded({ extended: true }), (req, res) => {
  const data = req.body;
  console.log(`Updated ${data.title}`);
  database[data.id].title = data.title;
  database[data.id].content = data.content;
  res.sendStatus(200);
});

app.post('/addProject', bParser.urlencoded({ extended: true }), (req, res) => {
  const data = req.body;
  console.log(`Added project ${data.title}`);
  const obj = {
    user: '',
    title: '',
    content: '',
  }
  database.push(obj);
  database[database.length - 1].title = data.title;
  database[database.length - 1].content = data.content;
  res.sendStatus(200);
});

app.get('/projects', (req, res) => {
  res.send(getTitles());
});
app.post('/authorize', (req, res) => {
  res.redirect('/index.html?u=' + 'test');
});
app.post('/register', (req, res) => {
  res.redirect('/index.html?u=' + 'test');
});

app.use(express.static('public'));
app.listen(process.env.AP_PORT);