export const springs = {
  // Default UI — critically damped, no overshoot
  default: { type: 'spring', damping: 26, stiffness: 180, mass: 1 },

  // Drawer / bottom sheet — slight yield, feels weighty
  sheet:   { type: 'spring', damping: 28, stiffness: 200, mass: 1.1 },

  // Cards entering viewport — snappy, decisive
  card:    { type: 'spring', damping: 24, stiffness: 220, mass: 0.9 },

  // Status badge pop — momentum-feel on state change
  badge:   { type: 'spring', damping: 18, stiffness: 320, mass: 0.7 },

  // Verification reveal — dramatic, slow settle
  verify:  { type: 'spring', damping: 30, stiffness: 120, mass: 1.4 },

  // Micro-interaction — button press feedback
  micro:   { type: 'spring', damping: 20, stiffness: 400, mass: 0.6 },
};
