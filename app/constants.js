(function (constants) {
  constants = {
    'CLIENT': {
      'CONNECTION_STATE': {
        'CONNECTED': 0,
        'DISCONNECTED': 1,
      },
      'STATE': {
        'HOST': 0,
        'NONE': 1,
        'PLAYER': 2,
      },
    },
    'GAME_STATE': {
      'ENTRY': 0,
      'PLAYER_JOIN': 1,
      'INTRO': 2,
      'ROUND': 3,
      'SCORE': 4,
      'FINAL_SCORE': 5,
    },
    'INTRO_LENGTH': 15 * 1000,
    'SCORE_LENGTH': 10 * 1000,
    'ROUND_LENGTH': 30 * 1000,
    'ROUNDS_PER_GAME': 5,
    'UPDATE_INTERVAL': 16,
  };

  if (typeof window === 'undefined') {
    module.exports = constants;
  } else {
    window.app.constants = constants;
  }
})({});
