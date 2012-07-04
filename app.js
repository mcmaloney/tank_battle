var express = require('express');
var app = express.createServer();

var databaseUrl = "tank_battle_test";
var collections = ["players"];
var db = require("mongojs").connect(databaseUrl, collections);

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set("view options", {layout: false});
  app.engine('html', require('ejs').renderFile);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// Decode the signed request from FB registration to get user info for DB.
function decodeSignedRequest(signedRequest) {
	var b64url = require('b64url');
	var encodedData = signedRequest.split('.', 2);
	var sig = encodedData[0];
	var json = b64url.decode(encodedData[1]);
	var data = JSON.parse(json);
	return data;
}

// Validate that we have no player record with this fb_id
function before_save_validate(fb_id) {
	db.players.findOne({ fb_id: fb_id }, function(err, player) {
    if (player) {
      return false;
    } else {
      return true;
    }
	});
}

// Main screen
app.get('/', function(req, res) {
  res.render('index.html');
});

// Signup
app.get('/players/new', function(req, res) {
	res.render('players/new.html');
});

// Find a single player by fb_id
app.get('/players/:id', function(req, res){
  db.players.findOne({ fb_id: req.params.id }, function(err, player) {
    if (player) {
      res.send(player);
    } else {
      res.send("User not found");
    }
  });
});

// Update a player by fb_id
app.post('/players/:id', function(req, res) {
  db.players.update({ fb_id: req.params.id }, {$set: { latitude: req.body.latitude, longitude: req.body.longitude }}, function(err, updated) {
    if (err || !updated) {
      console.log("Player not updated");
      res.redirect('/');
    } else {
      console.log("Player updated");
      res.redirect('/');
    }
  });
});

// List all players
app.get('/players', function(req, res) {
  db.players.find(function(err, players) {
    if (err || !players) {
      console.log("No players found. " + err);
    } else {
      res.send(players);
    }
  });
});

// Create a player
app.post('/players', function(req, res) {  
  if (req.body.signed_request) {
    var signed_request = decodeSignedRequest(req.body.signed_request);
  	if (before_save_validate(signed_request.user_id)) {
  		db.players.save({
  			name: signed_request.registration.name,
  			email: signed_request.registration.email,
  			gender: signed_request.registration.gender,
  			birthday: signed_request.registration.birthday,
  			fb_id: signed_request.user_id,
  			latitude: "",
  			longitude: "",
  			strength: 100
  		}, function(err, saved) {
  			if (err || !saved) {
  				console.log(err);
  			} else {
  				console.log("Player saved.");
  				res.redirect('/');
  			}
  		});
  	} else {
  		res.redirect('/');
  	}
  } else {
    console.log(req.body);
    db.players.save({
			name: req.body.name,
			email: req.body.email,
			gender: req.body.gender,
			birthday: req.body.birthday,
			fb_id: req.body.fb_id,
			latitude: req.body.latitude,
			longitude: req.body.longitude,
			strength: 100
		}, function(err, saved) {
			if (err || !saved) {
				console.log(err);
			} else {
				console.log("Player saved.");
				res.redirect('/');
			}
		});
  }
});

app.listen(3000);
console.log("App started. Listening on port 3000.");