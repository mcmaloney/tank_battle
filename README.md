==== TO DO ====

- Marker1 should be current location, not draggable

- Add a damage feedback
  - Red text fades in if there's damage, displays value
  - "MISS" if there's no damage
  
- Draw circle around target with radius that shows actual target size
  - Scale per distance to target (long distance, bigger effective radius, etc.)
  
- Zoom map based on target distance scale
  - Add global variable for distance scale
  - Set scale at init
  - Modify throughout

- Zoom map to location of shot
  - Modify target distance scale to control zoom
  - Base map center around last shot

- Scale factor for distances
  - Max power should have upper bounds set based on distance to target
