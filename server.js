var express = require('express');
var mysql = require('mysql');
const uuidv1 = require('uuid/v5');
const bcrypt = require('bcrypt');
var bodyParser = require("body-parser");
var zipcodes = require('zipcodes');

var DEBUG = true;

var ctx = express();
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'sire',
  password : 'sire',
  database : 'happypuppies'
});

db.connect();

ctx.use(bodyParser.urlencoded({ extended: false }));
ctx.use(bodyParser.json());

if (DEBUG)
{
  ctx.get('/breeders', function(req, res) {
    db.query('SELECT * from breeders', function(err, row) {
      res.json(row);
    });
  });
}

ctx.get('/breeders/:uuid', function(req, res) {
  db.query('SELECT * from breeders where uuid = ?', req.params.id, function(err, row) {
    res.json(row);
  });
});

ctx.post('/breeders/login', function(req, res) {
  if (req.body.password != null && req.body.password != "")
  {
    bcrypt.hash(req.body.password, 10, function(err, hash) {
      var data = {
        login: req.body.login,
        password: hash
      }
      if (login != null && login != "") {
        db.query('SELECT * from breeders where email = ? or displayName = ?', data.login, data.login, function(err, row) {
          bcrypt.compare(res.password, data.password, function(err, res) {
            if(res) {
             res.json(row);
            } else {
             // Passwords don't match
            }
          });
        });
      }
    });
  }
});


ctx.post('/breeders/new', function(req, res) {
  var error = 0;
  console.log(req.body);
  db.query('SELECT * from breeders where email == ?', req.body.email, function(err, row) {
    if (row) {
      error += 1;

    }
  });
  if (error != 0) {
    uuid = uuidv5();
    db.query('INSERT INTO users (displayName, firstName, lastName, uuid, password, email, phone, dogBreeder, licensedDogBreeder, petsID, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', req.body.displayName, req.body.firstName, req.body.lastName, uuid, req.body.password, req.body.email, req.body.phone, req.body.dogBreeder, req.body.licensedDocBreeder, null, req.body.zipcode, function(err, res) {
      console.log(row);
      res.json(row);
    });
  }
});

// ctx.get('/puppies', function(req, res) {
//   db.query('SELECT * from puppiesAvailable', function(err, row) {
//     res.json(row);
//   });
// });

ctx.get('/puppies/:zipcode/:breed', function(req, res) {
  db.query('SELECT * from puppiesAvailable where zipcode = ?', zipcodes.radius(req.params.zipcode, 50), function(err, row) {
    res.json(row);
  });
});
//
// ctx.get('/pets/:zipcode/:breed', function(req, res) {
//   if (req.params.zipcode != null && req.params.breed != null)
//   {
//     console.log(zipcodes.radius(req.params.zipcode, 50));
//     // db.query('SELECT * from users where zipcode = ?', zipcodes.radius(req.params.zipcode, 50), function(users_err, users) {
//     db.query('SELECT pets.name, pets.picture, pets.description, users.displayName, users.picture from pets, users where zipcode = ? and petsID', 94088).then( users_res => {
//       users: users_res;
//       return users.foreach(function(user) {
//     })
//       if (users != [])
//       {
//         var nbPuppies = 0;
//         users.foreach(function(user) {
//           user.petsId.foreach(function(petId) {
//             db.query('SELECT * from pets where id = ?', petId, function(err, row) {
//               res.json(user).concat(json(row));
//               nbPuppies += 1;
//             });
//           });
//         }).then(() => {
//           if (nbPuppies == 0) {
//             res.status(400).json({"error": "No user available in your area"});
//           }
//         })
//       }
//       else
//       {
//         res.status(400).json({"error": "No user available in your area"});
//       }
//     });
//   }
//
// });

ctx.get('/puppies/:ownerEmail', function(req, res) {
  ID = db.query('SELECT petsId from breeders where email = ?', req.params.ownerEmail);
  if (ID == []) return 4;
  // foreach(function(ID.petsId) {
  //   db.query('SELECT * from pets where id = ?', ID.petsId, function(err, row) {
  //     res.json(row);
  //   });
  // });
});

ctx.post('/puppies/new', function(req, res) {
  var error = 0;
  db.query('INSERT INTO pets (name, picture, weight, age, gender, temperament, body, head, ears, coat, tail, femaleCycle, description, breed) VALUES (?, ?, ?, ?, ?, ?, ?)', req.body.name, req.body.picture, req.body.weight, req.body.age, req.body.gender, req.body.temperament, req.body.body, req.body.head, req.body.ears, req.body.coat, req.body.tail, req.body.femaleCycle, req.body.description, req.body.breed, function(err, row) {
    res.json(row);
  });
});

ctx.listen(3000);

console.clear();
console.log("");

console.log(".______        ___       ______  __  ___         _______ .__   __.  _______");
console.log("|   _  \\      /   \\     /      ||  |/  /        |   ____||  \\ |  | |       \\ ");
console.log("|  |_)  |    /  ^  \\   |  ,----'|  '  /   ______|  |__   |   \\|  | |  .--.  | ");
console.log("|   _  <    /  /_\\  \\  |  |     |    <   |______|   __|  |  . `  | |  |  |  | ");
console.log("|  |_)  |  /  _____  \\ |  `----.|  .  \\         |  |____ |  |\\   | |  '--'  | ");
console.log("|______/  /__/     \\__\\ \\______||__|\\__\\        |_______||__| \\__| |_______/ ");

console.log("");
console.log("Listening on port 3000");
console.log("");
