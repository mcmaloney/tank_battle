function Projectile(launchVelocity, launchAngle, launchHeight, launchHeading, launchOrigin) {
  this.launchVelocity = launchVelocity;
  this.launchAngle = launchAngle;
  this.launchHeight = launchHeight;
  this.launchHeading = launchHeading;
  this.launchOrigin = launchOrigin; // google.maps.LatLng
  this.maxDamage = 100; // This can be variable depending on what kind of weapon is being simulated
  
  // Trajectory calculator outputs map marker where shot lands based on launch variables.
  this.launch = function() {
    if ((this.launchAngle > 90.0)||(this.launchAngle < 0.0)||(this.launchVelocity < 0.0)) {
      alert("You must enter appropriate launch values.");
    }

    this.launchAngle = this.launchAngle.toRad(); // convert to radians

    var Ge = parseFloat(9.81);          // acceleration of gravity -- meters/sec/sec
    var Vx = launchVelocity*Math.cos(launchAngle);  // init horizontal launchVelocity
    var Vy = launchVelocity*Math.sin(launchAngle);  // init vertical launchVelocity

    var hgt = launchHeight + Vy*Vy/(2*Ge); // max height

    if (hgt < 0.0) return;

    var upt = Vy/Ge;                      // time to max height
    var dnt = Math.sqrt(2*hgt/Ge);        // time from max height to impact
    var rng = Vx*(upt + dnt);             // horizontal range at impact

    // Put a marker where the shot lands
    var shotMarker = new google.maps.Marker({
       position: this.launchOrigin.destinationPoint(launchHeading, rng),
       map: map
    });
    
    return shotMarker.getPosition();
  }
}

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