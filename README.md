==== TO DO ====
  
- Draw circle around target with radius that shows actual target size
  - Scale per distance to target (long distance, bigger effective radius, etc.)
  
- Add location name attribute and flag that shows name
  
- FB Share on target destruction
  - FB login
  - Callback on target destroyed with share modal "I destroyed [target.name] in X tries"
  
- Set player target location with FB
  - authorize, get location from FB
  - get name from FB
  
- Zoom map based on target distance scale
  - Add global variable for distance scale
  - Set scale at init
  - Modify throughout

- Zoom map to location of shot
  - Modify target distance scale to control zoom
  - Base map center around last shot

- Scale factor for distances
  - Max power should have upper bounds set based on distance to target
