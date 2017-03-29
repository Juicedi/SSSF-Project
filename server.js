const mongoose = require('mongoose');
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

// Gets
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

app.get('/project', (req, res) => {
  res.send('{"title": "New project", "content": "Non voluptate proident esse sit anim Lorem duis dolor nostrud aliquip mollit sit."}');
});

app.use(express.static('public'));
app.listen(3000);