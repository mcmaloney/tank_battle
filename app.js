var express = require('express');
var app = express.createServer();

var databaseUrl = "tank_battle_test";
var collections = ["players"];
var db = require("mongojs").connect(databaseUrl, collections);

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set("view options", {layout: false});
  app.register('.html', {
    compile: function(str, options){
      return function(locals){
        return str;
      };
    }
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

function getPlayers() {
  db.players.find(function(err, players) {
    if (err || !players) {
      console.log("No players found. " + err);
    } else {
      console.log(players);
    }
  });
}

app.get('/', function(req, res) {
  getPlayers();
  res.render('index.html');
});

app.post('/players', function(req, res) {
  db.players.save({ 
    player_name: req.body.player_name, 
    strength: req.body.strength, 
    player_latitude: req.body.player_latitude,
    player_longitude: req.body.player_longitude
  }, function(err, saved) {
    if( err || !saved ) console.log(err);
    else console.log("Player saved.");
  });
});

app.listen(3000);
console.log("App started. Listening on port 3000.");