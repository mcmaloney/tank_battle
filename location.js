function Location(geolocation, map, strength, effectiveRadius) {
  this.geolocation = location;
  this.map = map;
  this.strength = strength;
  this.effectiveRadius = effectiveRadius; // should scale based on distance between player locations
  
  this.marker = new google.maps.Marker({
    map: map,
    draggable: true,
    position: geolocation
  });
  
  var targetCircle = new google.maps.Circle({
    strokeColor: "#FF0000",
    strokeOpacity: 0.5,
    strokeWeight: 1,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    map: map,
    center: geolocation,
    radius: effectiveRadius * 100 // need to figure out units here so this is accurate
  });
  
  // Is the shot outside of the effective target radius?
  this.shotLandedInTargetRadius = function(distanceFromTarget) {
    if (distanceFromTarget > this.effectiveRadius) {
      return false;
    } else {
      return true;
    }
  }
  
  // Rudimentary damage function - depletes location strength but returns the amount of damage caused by a shot 
  // landing somewhere near it.
  this.getDamageFromDistanceDelta = function(delta) {
    if (this.shotLandedInTargetRadius(delta)) {
      this.strength = this.strength - (delta / 10);
      return delta / 10;
    } else {
      return 0;
    }
  }
  
  // Remaining strength > 0 means you're still alive and kicking
  this.stillAlive = function() {
    if (this.strength > 0) {
      return true;
    } else {
      return false;
    }
  }
    
  this.getDamageFromShot = function(shotPosition) {
    var shotDamage = this.getDamageFromDistanceDelta(google.maps.geometry.spherical.computeDistanceBetween(this.marker.getPosition(), shotPosition) / 100);
    return Math.round(shotDamage);
  }
}