function Player(geolocation, playerName, map, strength, effectiveRadius) {
  this.geolocation = geolocation;
  this.playerName = playerName;
  this.map = map;
  this.strength = strength;
  if (!effectiveRadius) {
    this.effectiveRadius = 100;
  } else {
    this.effectiveRadius = effectiveRadius; 
  }
  
  this.marker = new google.maps.Marker({
    map: map,
    draggable: false,
    position: geolocation,
    title: playerName
  });
  
  google.maps.event.addListener(this.marker, 'click', function(e) {
    setAsTarget(this);
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
  
  // Remaining strength > 0 means you're still alive and kicking
  this.stillAlive = function() {
    if (this.strength > 0) {
      return true;
    } else {
      return false;
    }
  }
  
  // Basic damage function. Need to refine. Sets the strength attribute and returns the damage amount.
  this.getDamageFromShot = function(shotPosition, projectileMaxDamage) {
    var shotLandingDistance = google.maps.geometry.spherical.computeDistanceBetween(this.marker.getPosition(), shotPosition) / 100;
    var shotDamage;
    if (shotLandingDistance > this.effectiveRadius) {
      shotDamage = 0;
    } else {
      shotDamage = Math.round((projectileMaxDamage / shotLandingDistance) * 100);
      this.strength = this.strength - shotDamage;
    }
    return shotDamage;
  }
}