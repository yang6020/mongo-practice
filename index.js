const express = require('express');
const app = express();
const engines = require('consolidate');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

MongoClient.connect(
  'mongodb://localhost:27017/mongotest',
  { useNewUrlParser: true },
  (err, client) => {
    db = client.db('mongotest');
    app.get('/', (req, res) => {
      db.collection('mongotest')
        .find({})
        .toArray((err, people) => {
          res.render('people', { people });
        });
    });

    app.post('/', (req, res) => {
      let reqUser = req.body.user.trim().split('');
      reqUser[0] = reqUser[0].toUpperCase();
      reqUser = reqUser.join('');
      db.collection('mongotest').insertOne({
        user: reqUser,
        age: req.body.age,
      });
      res.redirect('/' + req.body.user);
    });

    app.get('/:user', (req, res) => {
      let reqQuery = req.params.user.split('');
      reqQuery[0] = reqQuery[0].toUpperCase();
      reqQuery = reqQuery.join('');
      db.collection('mongotest')
        .find({ user: reqQuery })
        .toArray((err, person) => {
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
