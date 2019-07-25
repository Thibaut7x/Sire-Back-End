var express = require('express');
var mysql = require('mysql');

var ctx = express();
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'sire',
  password : 'sire',
  database : 'sire'
});

db.connect();

ctx.get('/user/:email', function(req, res) {
  db.query('SELECT * from users where email = ?', req.params.id, function(err, row) {
    res.json(row);
  });
});

ctx.post('/user/new', function(req, res) {
  var error = 0;
  db.query('SELECT * from users where username == ?', function(err, row) {
    if (row) {
      error += 1;
    }
  });
  if (error != 0) {
    db.query('INSERT INTO users (displayName, firstName, lastName, password, email, phone, dogBreeder, licensedDogBreeder, petsID, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', req.body.displayName, req.body.firstName, req.body.lastName, req.body.password, req.body.email, req.body.phone, req.body.dogBreeder, req.body.licensedDocBreeder, null, req.body.zipcode, function(err, res) {
      res.json(row);
    });
  }
});

ctx.get('/pets/:ownerEmail', function(req, res) {
  ID = db.query('SELECT petsId from users where email = ?', req.params.ownerEmail);
  if (ID == []) return;
  foreach(ID.petsId as idd)
  {
    db.query('SELECT * from pets where id = ?', ID.petsId, function(err, row) {
      res.json(row);
    });
  }
});

ctx.post('/pets/new', function(req, res) {
  var error = 0;
  db.query('INSERT INTO pets (name, picture, weight, age, gender, temperament, body, head, ears, coat, tail, femaleCycle, description, breed) VALUES (?, ?, ?, ?, ?, ?, ?)', req.body.name, req.body.picture, req.body.weight, req.body.age, req.body.gender, req.body.temperament, req.body.body, req.body.head, req.body.ears, req.body.coat, req.body.tail, req.body.femaleCycle, req.body.description, req.body.breed, function(err, row) {
    res.json(row);
  });
});

ctx.listen(3000);
