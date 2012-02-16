==== TO DO ====

- Place marker where projectile lands after launch
  - Add launch horizontal angle
  - Place marker at geolocation of distance traveled at launch heading (horizontal angle)

- Damage function
  - Projectile has fixed damage amount
  - Damage to target is a function of impact proximity to target
    - Damage multiplier outside a certain radius to target is zero
    - Inside radius the multiplier increases from 0.0 to 1.0 

- Scale factor for distances
  - Max power should have upper bounds set based on distance to target
