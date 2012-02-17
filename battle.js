// Global Vars
var map;
var marker1;
var marker2;
var geodesicPoly; // Neither of the polylines would be visible to users. Just using as an example.
var poly;
var userLocation;
var shotsFired = new Array(); // Tracks shots fired for future use
var maxDistanceFromTarget = 1000; // Radius to target outside of which projectile is ineffective

Number.prototype.toRad = function() {
  return this * Math.PI / 180;
}

Number.prototype.toDeg = function() {
  return this * 180 / Math.PI;
}

// Set a destination point based on a heading and a distance from another point
google.maps.LatLng.prototype.destinationPoint = function(heading, dist) {
   dist = dist / 6371;  
   heading = heading.toRad();  

   var lat1 = this.lat().toRad(), lon1 = this.lng().toRad();

   var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) + 
                        Math.cos(lat1) * Math.sin(dist) * Math.cos(heading));

   var lon2 = lon1 + Math.atan2(Math.sin(heading) * Math.sin(dist) *
                                Math.cos(lat1), 
                                Math.cos(dist) - Math.sin(lat1) *
                                Math.sin(lat2));

   if (isNaN(lat2) || isNaN(lon2)) return null;

   return new google.maps.LatLng(lat2.toDeg(), lon2.toDeg());
}

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
  
  // Place marker 1 on where the current user is.
  marker1 = new google.maps.Marker({
    map: map,
    draggable: false,
    position: userLocation
  });
  
  // Marker 2 goes to a random location for testing.
  marker2 = new google.maps.Marker({
    map: map,
    draggable: true,
    position: new google.maps.LatLng(48.8566140, 2.35222190)
  });
  
  var bounds = new google.maps.LatLngBounds(marker1.getPosition(), marker2.getPosition());
  map.fitBounds(bounds);
  
  google.maps.event.addListener(marker1, 'position_changed', update);
  google.maps.event.addListener(marker2, 'position_changed', update);
  
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
  var path = [marker1.getPosition(), marker2.getPosition()];
  poly.setPath(path);
  geodesicPoly.setPath(path);
}

// Spherical/geodesic distance
function calculateDistanceBetween(origin, destination) {
  var distance = google.maps.geometry.spherical.computeDistanceBetween(origin, destination) / 100;
  return distance;
}

// Feeds the form params into trajectory calculator
function fireProjectile() {
  var initialVelocity = parseFloat(document.launchVars.initialVelocity.value);
  var launchAngle = parseFloat(document.launchVars.launchAngle.value);    
  var launchHeight = parseFloat(document.launchVars.launchHeight.value);
  var launchHeading = parseFloat(document.launchVars.launchHeading.value);
  findLaunchResults(initialVelocity, launchAngle, launchHeight, launchHeading);
}

// Trajectory calculator outputs map marker where shot lands based on launch variables.
function findLaunchResults(velocity, angle, height, heading) {
  if ((angle > 90.0)||(angle < 0.0)||(velocity < 0.0)) {
    alert("You must enter appropriate launch values.");
  }

  angle = angle.toRad(); // convert to radians

  var Ge = parseFloat(9.81);          // acceleration of gravity -- meters/sec/sec
  var Vx = velocity*Math.cos(angle);  // init horizontal velocity
  var Vy = velocity*Math.sin(angle);  // init vertical velocity

  var hgt = height + Vy*Vy/(2*Ge); // max height

  if (hgt < 0.0) return;

  var upt = Vy/Ge;                      // time to max height
  var dnt = Math.sqrt(2*hgt/Ge);        // time from max height to impact
  var rng = Vx*(upt + dnt);             // horizontal range at impact
  
  // Put a marker where the shot lands
  var shotMarker = new google.maps.Marker({
     position: userLocation.destinationPoint(heading, rng),
     map: map
  });
  
  shotsFired.push(shotMarker.getPosition());
  showResults(getDamageFromDistanceDelta(calculateDistanceBetween(marker2.getPosition(), shotsFired.last())));
}

// Display the results of a shot fired
function showResults(damageAmount) {
  damageAmount = Math.round(damageAmount);
  if (damageAmount == 0) {
    $("#feedback").css({'background-color': 'gray'});
    $("#feedback").html("MISS")
    $("#feedback").fadeIn("slow").delay(1000).fadeOut("slow");
  } else {
    $("#feedback").css({'background-color': 'red'});
    $("#feedback").html("HIT! " + damageAmount + " DAMAGE");
    $("#feedback").fadeIn("slow").delay(1000).fadeOut("slow");
  }
}

// Rudimentary damage function.
function getDamageFromDistanceDelta(delta) {
  var maxDamage = 100;
  if (shotLandedInTargetRadius(delta)) {
    return maxDamage - (delta / 10);
  } else {
    $("#feedback").fadeIn("slow");
    return 0;
  }
}

// Is the shot outside of the effective target radius?
function shotLandedInTargetRadius(distanceFromTarget) {
  if (distanceFromTarget > maxDistanceFromTarget) {
    return false;
  } else {
    return true;
  }
}

$(document).ready(function() {
  initialize();
});
