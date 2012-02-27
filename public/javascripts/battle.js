// Global Vars
var map;
var marker1;
var marker2;
var geodesicPoly; // Neither of the polylines would be visible to users. Just using as an example.
var poly;
var shotsFired = new Array(); // Tracks shots fired for future use
var players = new Array(); // All of the players (Location objects)

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
  
  // Put in an imaginary opponent
  var opponentLocation = new google.maps.LatLng(48.8566140, 2.35222190);
  players.push(new Player(opponentLocation, "Nadav", map, 100));
}

function joinGame() {
  var userName;
  // WTF is wrong with this get current location shit?????
  var myLocation = new google.maps.LatLng(40.714269, -74.005972);
  FB.api('/me', function(user) {
    if (user) {
      userName = user.name;
    }
  });
  var player = new Player(myLocation, "Michael", map, 100)
  players.push(player);
  savePlayer(player);
  $('.joinButton').hide('slow');
}

function savePlayer(player) {
  console.log("POST");
  $.post('/players', {
    player_name: player.playerName,
    player_latitude: 40.714269,
    player_longitude: -74.005972,
    strength: player.strength
  });
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