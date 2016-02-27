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
    'OBJECTIVES': [
    {
      'name': 'Tiger Entrails',
      'color': 'red',
      'shape': 'tangle',
      'filename': 'TigerEntrails.png'
    },
    {
      'name': 'Adder Fork',
      'color': 'red',
      'shape': 'branch',
      'filename': 'AdderFork.png'
    },
    {
      'name': 'Goat Gall',
      'color': 'red',
      'shape': 'sphere',
      'filename': 'GoatGall.png'
    },
    {
      'name': 'Baby Finger',
      'color': 'red',
      'shape': 'straight',
      'filename': 'BabyFinger.png'
    },
    {
      'name': 'Baboon Blood',
      'color': 'red',
      'shape': 'vial',
      'filename': 'BaboonBlood.png'
    },
    {
      'name': 'Poisoned Entrails',
      'color': 'green',
      'shape': 'tangle',
      'filename': 'PoisonEntrails.png'
    },
    {
      'name': 'Lizard Leg',
      'color': 'green',
      'shape': 'branch',
      'filename': 'LizardLeg.png'
    },
    {
      'name': 'Drop of Mucus',
      'color': 'green',
      'shape': 'sphere',
      'filename': 'DropOfMucus.png'
    },
    {
      'name': 'Frog Toe',
      'color': 'green',
      'shape': 'straight',
      'filename': 'FrogToe.png'
    },
    {
      'name': 'Toad Venom',
      'color': 'green',
      'shape': 'vial',
      'filename': 'ToadVenom.png'
    },
    {
      'name': 'Snake Fillet',
      'color': 'brown',
      'shape': 'tangle',
      'filename': 'SnakeFillet.png'
    },
    {
      'name': 'Hemlock Root',
      'color': 'brown',
      'shape': 'branch',
      'filename': 'HemlockRoot.png'
    },
    {
      'name': 'Bat Wool',
      'color': 'brown',
      'shape': 'sphere',
      'filename': 'BatsWool.png'
    },
    {
      'name': 'Wolf Tooth',
      'color': 'brown',
      'shape': 'straight',
      'filename': 'WolfsTooth.png'
    },
    {
      'name': 'Sands of Time',
      'color': 'brown',
      'shape': 'vial',
      'filename': 'SandsOfTime.png'
    },
    {
      'name': 'Silvered Yew',
      'color': 'white',
      'shape': 'branch',
      'filename': 'SilveredYew.png'
    },
    {
      'name': 'Eye of Newt',
      'color': 'white',
      'shape': 'sphere',
      'filename': 'EyeOfNewt.png'
    },
    {
      'name': 'Dragon Scale',
      'color': 'white',
      'shape': 'straight',
      'filename': 'DragonScale.png'
    },
    {
      'name': 'Bone Dust',
      'color': 'white',
      'shape': 'vial',
      'filename': 'BoneDust.png'
    }
    ],
    'SCORE_STATUS': [
    ' turned into a newt',
    ' turned into a frog',
    ' turned into a bat',
    ' turned into a mouse',
    ' grew a third arm',
    ' grew a third eye',
    ' grew a second head',
    '\'s bones turned into jelly',
    '\'s skin is now covered in scales',
    '\'s skin turned green',
    '\'s skin turned blue',
    '\'s skin turned purple',
    '\'s hair fell out',
    ' became blind',
    ' became deaf',
    ' became mute',
    ' became drunk',
    ' became deathly afraid of clowns',
    ' became invisible',
    ' became a vampire',
    ' became a werewolf',
    ' became incredibly muscular',
    ' craves human flesh',
    ' got the munchies',
    ' fell asleep',
    ' broke the fourth wall',
    ' let one rip',
    ' began having regrets',
    ' got struck by lightning',
    ' heard disembodied voices'
    ],
    'FORTUNE': [
    [
    'definitely',
    'probably',
    'not'
    ],
    [
    'find',
    'lose',
    'create',
    'destroy',
    'understand'
    ],
    [
    'love',
    'money',
    'power',
    'fame',
    'answers'
    ],
    [
    'all the right places',
    'all the wrong places',
    'the big city',
    'the woods',
    'a foreign country',
    'an airplane',
    'a taxi',
    'a fever dream'
    ],
  ],
    'INTRO_LENGTH': 15 * 1000,
    'OBJECTIVE_SELECTION': 4,
    'OBJECTIVE_ADD_INTERVAL': 1000,
    'SCORE_LENGTH': 10 * 1000,
    'ROUND_LENGTH_TARGET': 30 * 1000,
    'ROUND_LENGTH_MINIMUM': 10 * 1000,
    'ROUNDS_PER_GAME': 5,
    'UPDATE_INTERVAL': 16,
  };

  if (typeof window === 'undefined') {
    module.exports = constants;
  } else {
    window.app.constants = constants;
  }
})({});
