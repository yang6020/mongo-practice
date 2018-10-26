const express = require('express');
const app = express();
const engines = require('consolidate');
const MongoClient = require('mongodb').MongoClient;

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

MongoClient.connect(
  'mongodb://localhost:27017/mongotest',
  { useNewUrlParser: true },
  (err, client) => {
    db = client.db('mongotest');
    app.get('/', (req, res) => {
      db.collection('mongotest')
        .find({})
        .toArray((err, people) => {
          console.log(people);
          res.render('people', { people });
        });
    });

    app.get('/:user', (req, res) => {
      let reqQuery = req.params.user.split('');
      reqQuery[0] = reqQuery[0].toUpperCase();
      reqQuery = reqQuery.join('');
      db.collection('mongotest')
        .find({ user: reqQuery })
        .toArray((err, person) => {
          console.log(person[0]);
          res.render('person', { person: person[0] });
        });
    });

    app.use((req, res) => {
      res.sendStatus(404);
    });

    const server = app.listen(3000, () => {
      const portNum = server.address().port;
      console.log('server is listening on port ' + portNum);
    });
  },
);
