// Global Vars
var map;
var marker1;
var marker2;
var geodesicPoly; // Neither of the polylines would be visible to users. Just using as an example.
var poly;
var shotsFired = new Array(); // Tracks shots fired for future use
var players = new Array(); // All of the players (Location objects)
var markers = new Array();

Array.prototype.last = function() {
  return this[this.length - 1];
}

// Setup map, initial markers, paths.
function initialize() {
  var myOptions = {
    center: new google.maps.LatLng(40.71435280, -74.0059731),
    zoom: 4,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  
  map.controls[google.maps.ControlPosition.TOP].push(document.getElementById("info"));
  
  load_players();  
}

function load_players() {
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/players",
    success: function(data) {
      for (var i=0; i<data.length; i++) {
        add_player_to_map(data[i].fb_id);
      }
    }, error: function(a,b,c) {
      cosnole.log(a + " " + b + " " + c);
    }
  });
}

// See if a player exists
function lookup_player(fb_id) {
  var player_found = true;
  
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/players/" + fb_id,
    success: function(data) {
      console.log(data);
    }, error: function(a, b, c) {
      console.log(a + " " + b + " " + c);
    }
  });
  
  return player_found;
}

// Update a player's info
function update_player_with_fb_id(fb_id) {
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/players/" + fb_id,
    data: {latitude: "40.714269", longitude: "-74.005972"}, // Need to get current location dynamically?
    success: function(data) {
      console.log(data);
    }, error: function(a,b,c) {
      console.log(a + " " + b + " " + c);
    }
  });
}

// Add any player to the map by querying db with fb_id
function add_player_to_map(fb_id) {
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/players/" + fb_id,
    success: function(data) {
      var playerLoc = new google.maps.LatLng(data.latitude, data.longitude);
      players.push(new Player(playerLoc, data.name, map, data.strength));
    }
  });
}

// Called from Player model when marker is created. BAD.
function setAsTarget(marker) {
  console.log(marker);
}

function getCurrentLocation() {
  var currentLocation = new Array();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      currentLocation[0] = position.coords.latitude;
      currentLocation[1] = position.coords.longitude;
    });
    return currentLocation;
  } else {
    alert("Geolocation isn't available");
  }
}

// Invite FB friends dialog
function inviteFriends() {
  FB.ui({
    method: 'apprequests',
    message: 'Come play Tank Battle with me!'
  }, function() {
    // callback something here.
  });
}

// Set the effective radius of targets proportional to the distance between them
function setEffectiveTargetRadius(location1, location2) {
  var distanceBetweenTargets = google.maps.geometry.spherical.computeDistanceBetween(location1, location2) / 100;
  var radius = Math.round(distanceBetweenTargets * 0.02); // Abritrary scale factor could be changed based on difficulty settings.
  if (radius < 1) {
    radius = 1;
  }
  return radius;
}

// Feeds the fire control params into trajectory calculator
function fireProjectile() {
  var initialVelocity = parseFloat(document.launchVars.initialVelocity.value);
  var launchAngle = parseFloat(document.launchVars.launchAngle.value);    
  var launchHeight = parseFloat(document.launchVars.launchHeight.value);
  var launchHeading = parseFloat(document.launchVars.launchHeading.value);
  var projectile = new Projectile(initialVelocity, launchAngle, launchHeight, launchHeading, players[0].marker.getPosition());
  shotsFired.push(projectile.launch());
  var damage = players[1].getDamageFromShot(shotsFired.last(), projectile.maxDamage);
  showResults(damage, players[1]);
}

// Display the results of a shot fired
function showResults(damageAmount, location) {
  if (location.stillAlive()) {
    if (damageAmount == 0) {
      $("#feedback").css({'background-color': 'gray'});
      $("#feedback").html("MISS")
      $("#feedback").fadeIn("slow").delay(1000).fadeOut("slow");
    } else {
      $("#feedback").css({'background-color': 'red'});
      $("#feedback").html("HIT! " + damageAmount + " DAMAGE");
      $("#feedback").fadeIn("slow").delay(1000).fadeOut("slow");
    }
  } else {
    alert("TARGET DESTROYED IN " + shotsFired.length + " TRIES");
    resetGame();
  }
}

function resetGame() {
  // Clear locations
  // Clear shotsFired
  // Clear projectiles from field
  return;
}

$(document).ready(function() {
  initialize();
});