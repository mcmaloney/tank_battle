function Location(geolocation, map, strength, effectiveRadius) {
  this.geolocation = location;
  this.map = map;
  this.strength = strength;
  this.effectiveRadius = effectiveRadius;
  
  this.marker = new google.maps.Marker({
    map: map,
    draggable: true,
    position: geolocation
  });
  
  // Is the shot outside of the effective target radius?
  this.shotLandedInTargetRadius = function(distanceFromTarget) {
    if (distanceFromTarget > this.effectiveRadius) {
      return false;
    } else {
      return true;
    }
  }
  
  // Rudimentary damage function.
  this.getDamageFromDistanceDelta = function(delta) {
    if (this.shotLandedInTargetRadius(delta)) {
      return this.strength - (delta / 10);
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



function getShotDamage(shot, target) {
  console.log(calculateDistanceBetween(target, shot));
  marker2.strength = marker2.strength - damageFromShot;
  showResults(damageFromShot, marker2);
}

