// Global Vars
var map;
var marker1;
var marker2;
var geodesicPoly; // Neither of the polylines would be visible to users. Just using as an example.
var poly;
var userLocation;
var shotsFired = new Array(); // Tracks shots fired for future use

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
  
  // This variable needs to be set by grabbing the player's current locaton.
  userLocation = new google.maps.LatLng(40.71435280, -74.0059731);
  opponentLocation = new google.maps.LatLng(48.8566140, 2.35222190)
  
  marker1 = new Location(userLocation, map, 100, 1000);
  marker2 = new Location(opponentLocation, map, 100, 1000);
  
  var bounds = new google.maps.LatLngBounds(marker1.marker.getPosition(), marker2.marker.getPosition());
  map.fitBounds(bounds);
  
  google.maps.event.addListener(marker1.marker, 'position_changed', update);
  google.maps.event.addListener(marker2.marker, 'position_changed', update);
  
  var polyOptions = {
    strokeColor: '#000000',
    strokeOpacity: 1.0,
    strokeWeight: 3,
    map: map
  }
  
  poly = new google.maps.Polyline(polyOptions);
  
  var geodesicOptions = {
    strokeColor: '#FFAAAA',
    strokeOpacity: 1.0,
    strokeWeight: 3,
    geodesic: true,
    map: map
  }
  
  geodesicPoly = new google.maps.Polyline(geodesicOptions);
  
  update();
}

// Update the distance between markers and paths if they are dragged somewhere else.
function update() {
  var path = [marker1.marker.getPosition(), marker2.marker.getPosition()];
  poly.setPath(path);
  geodesicPoly.setPath(path);
}

// Feeds the form params into trajectory calculator
function fireProjectile() {
  var initialVelocity = parseFloat(document.launchVars.initialVelocity.value);
  var launchAngle = parseFloat(document.launchVars.launchAngle.value);    
  var launchHeight = parseFloat(document.launchVars.launchHeight.value);
  var launchHeading = parseFloat(document.launchVars.launchHeading.value);
  var projectile = new Projectile(initialVelocity, launchAngle, launchHeight, launchHeading, marker1.marker.getPosition());
  shotsFired.push(projectile.launch());
  console.log(marker2.getDamageFromShot(shotsFired.last()));
}

// Display the results of a shot fired
function showResults(damageAmount, target) {
  if (target.stillAlive()) {
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
    alert("TARGET DESTROYED");
  }
}

$(document).ready(function() {
  initialize();
});