// const mongoose = require('mongoose');
const bParser = require('body-parser');
const express = require('express');
const app = express();

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://myTester:xyz123@localhost:27017/test').then(() => {
//   console.log('Connected successfully.');
// }, err => {
//   console.log('Connection to db failed: ' + err);
// });

// const Schema = mongoose.Schema;
// const spySchema = new Schema({
//   category: String,
//   title: String,
//   description: String,
//   img: String
// });

// const Spy = mongoose.model('Spy', spySchema);

// Spy.find().exec().then((spies) => {
//   console.log(`Got ${spies.length} cats`);
//   console.log(spies);
// });

// app.get('/spies', (req, res) => {
//   Spy
//     .where('age').gt(10)
//     .where('weight').gt(10)
//     .where('gender').equals('male').exec()
//     .then(data => {
//       console.log('sending cats');
//       console.log(data);
//       res.send(data);
//     });
// });


// Receive cat form
// app.post('/addSpy', bParser.urlencoded({ extended: true }), (req, res) => {
//   const data = req.body;

//   Spy.create(data).then(post => {
//     console.log(post);
//   });

//   res.sendStatus(200);
// });

/*------------------ Temp DB :) ----------------------*/
let database = [
  {
    title: 'firstproject',
    content: 'wasdwasdwasd qwerqwerqwre project!'
  },
  {
    title: 'proper project',
    content: 'Kissa (ransk. chat) on eräänlainen tappavaa eläintä muistuttava hirvittävä peto, joka on ulkonäöltään karvainen olento (Myös karvattomia löytyy). Se kiljaisee hännän päälle astuttaessa ja saattaa pahimmillaan syödä koskemattomuuttaan loukanneen henkilön. Kissalla on tunnusomaiset korvat, silmät, etujalat ja valkotäpläinen ruotomainen häntä, jonka avulla se kykenee muun muassa tasapainoilemaan piha-aidan harjalla ja koivunoksalla. Kun kissa tapaa vihollisen, jonka se arvioi olevan sitä itseään voimakkaampi, se tipauttaa kaikki karvansa ja pakenee karvanlähdön suoman paniikinomaisen hämmästyksen turvin.'
  }
]
const getTitles = () => {
  let array = [];
  for (project of database) {
    array.push(project.title);
  }
  return array;
}
/*------------------ Temp DB :) ----------------------*/

// Gets
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

app.post('/project', bParser.urlencoded({extended: true}), (req, res) => {
  const data = req.body;
  res.send(JSON.stringify(database[data.id]));
});

app.post('/updateProject', bParser.urlencoded({extended: true}), (req, res) => {
  const data = req.body;
  console.log(`Updated ${data.title}`);
  database[data.id].title = data.title;
  database[data.id].content = data.content;
  res.sendStatus(200);
});

app.post('/addProject', bParser.urlencoded({extended: true}), (req, res) => {
  const data = req.body;
  console.log(`Added project ${data.title}`);
  const obj = {
    title: '',
    content: ''
  }
  database.push(obj);
  database[database.length-1].title = data.title;
  database[database.length-1].content = data.content;
  res.sendStatus(200);
});

app.get('/projects', (req, res) => {
  res.send(getTitles());
});

app.use(express.static('public'));
app.listen(3000);