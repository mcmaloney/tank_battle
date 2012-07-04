==== TO DO ====

- Identify my marker
  - Different color
  - Set my marker as origin (for launching projectiles from)

- Clicking on markers sets target
  - Click event loads player that marker belongs to as target object (has to be type Player)
    - May have to change title attribute of marker to fb_id so we can load the player. Otherwise we have no info to get the Player object.
  - Can't click on your own target
  - Change color of active target marker (can only be one at a time for now)

- Shots from origin to target
  - Launch projectile from origin position to current target position
  - Calculate damage to target
  - Save target strength to DB (current strength - strength after hit)
  - Need to remember (save after each shot) target strength in case I switch targets before I destroy the current target
  - Max allowable shots on target at once?
  - This will have to be turns eventually
  - Save shot location to DB to remember shots and display on page reload?
  
- FB Share on target destruction
  - FB login
  - Callback on target destroyed with share modal "I destroyed [target.name] in X tries"
  
- Set player target location with FB
  - authorize, get location from FB
  - get name from FB
  
- FB Leaderboard?
  - Save scores/users, etc.
  
- Stop arbitrary unit shit. Figure out what's meters and what's KM. At least 2 variables are set to different scales.
  
- Zoom map based on target distance scale
  - Add global variable for distance scale
  - Set scale at init
  - Modify throughout

- Zoom map to location of shot
  - Modify target distance scale to control zoom
  - Base map center around last shot

- Scale factor for distances
  - Max power should have upper bounds set based on distance to target
