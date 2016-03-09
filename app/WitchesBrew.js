var constants = require('./constants.js');
var mustache = require('mustache');

module.exports = function () {
  var mystiko = {};

  mystiko.createGame = function(roomName) {
    return {
      players: [],
      state: constants['GAME_STATE']['PLAYER_JOIN'],
      round: 1,
      roundStart: 0,
      scoreStart: 0,
      dirty: true,
      name: roomName,
      objectives: [],
      addedObjectives: [],
      addedObjectivesCount: [],
      lastObjectiveAdd: constants['OBJECTIVE_ADD_INTERVAL'],
      leadPlayer: 0,
      winner: {
        name: '',
        score: 0
      }
    };
  };

  mystiko.configurePlayers = function (game, data) {
    var players = game.players;
    var objectiveSelection = [];
    var possibleObjective = 0;
    var objectiveFound = true;
    var firstObjective = 0;
    var secondObjective = 0;

    while (objectiveSelection.length < constants['OBJECTIVE_SELECTION']) {
      objectiveFound = true;
      possibleObjective = Math.floor(Math.random() * constants['OBJECTIVES'].length);

      for (var i = 0; i < objectiveSelection.length; i++) {
        if (constants['OBJECTIVES'][possibleObjective].name === constants['OBJECTIVES'][objectiveSelection[i]].name ||
            constants['OBJECTIVES'][possibleObjective].color === constants['OBJECTIVES'][objectiveSelection[i]].color ||
            constants['OBJECTIVES'][possibleObjective].shape === constants['OBJECTIVES'][objectiveSelection[i]].shape) {
          objectiveFound = false;
          break;
        }
      }

      if (objectiveFound) {
        objectiveSelection.push(possibleObjective);
      }
    }

    for (i = 0; i < players.length; i++) {
      firstObjective = objectiveSelection[Math.floor(Math.random() * objectiveSelection.length)];
      secondObjective = objectiveSelection[Math.floor(Math.random() * objectiveSelection.length)];

      while (secondObjective === firstObjective) {
        secondObjective = objectiveSelection[Math.floor(Math.random() * objectiveSelection.length)];
      }
      players[i].objectives.push(firstObjective);
      players[i].objectives.push(secondObjective);
    }

    game.dirty = true;
    game.timeStarted = new Date().valueOf();
    game.state = constants['GAME_STATE']['INTRO'];
    game.objectives = objectiveSelection.slice(0);

    console.log('Starting new game with players: ');
    for (var i = 0; i < game.players.length; i++) {
      console.log(game.players[i].name);
    }
  };

  mystiko.generateFortune = function (name) {
    return mustache.render('{{name}} will {{a}} {{b}} {{c}} in {{d}}.', {
      name: name,
      a: constants['FORTUNE'][0][Math.floor(Math.random() * constants['FORTUNE'][0].length)],
      b: constants['FORTUNE'][1][Math.floor(Math.random() * constants['FORTUNE'][1].length)],
      c: constants['FORTUNE'][2][Math.floor(Math.random() * constants['FORTUNE'][2].length)],
      d: constants['FORTUNE'][3][Math.floor(Math.random() * constants['FORTUNE'][3].length)],
    });
  };

  mystiko.playerDrink = function (game, data) {
    console.log('looking for drinking player ' + data.name);
    for (var i = 0; i < game.players.length; i++) {
      if (game.players[i].name === data.name && !game.players[i].hasDrunk) {
        console.log('drinking player found ' + game.players[i].name);
        game.players[i].hasDrunk = true;

        for (var i2 = 0; i2 < game.addedObjectives.length; i2++) {
          if (game.addedObjectives[i2] === game.players[i].objectives[0] ||
              game.addedObjectives[i2] === game.players[i].objectives[1]) {
            game.players[i].score++;
          }
        }

        console.log(game.players[i] + ' just drank and their score is now ' + game.players[i].score);
        game.isDirty = true;
        break;
      }
    }
  };
  mystiko.playerJoin = function (game, data) {
    game.players.push(data.player);
    game.dirty = true;

    console.log('player joined: ' + data.player.name + ' ' + data.room);
  };

  mystiko.trigger = function (event, args) {
    if (mystiko.triggers[event]) {
      return mystiko.triggers[event].apply(this, args);
    }
  };
  mystiko.triggers = {
    'create-room': mystiko.createGame,
    'game-start': mystiko.configurePlayers,
    'player-join': mystiko.playerJoin,
    'player-drink': mystiko.playerDrink
  };

  mystiko.update = function (io) {
    var game = this;

    if (game.state === constants['GAME_STATE']['PLAYER_JOIN']) {

    }

    if (game.state === constants['GAME_STATE']['INTRO']) {
      if (new Date().valueOf() - game.timeStarted >= constants['INTRO_LENGTH']) {
        game.state = constants['GAME_STATE']['ROUND'];
        game.roundStart = new Date().valueOf();
        game.dirty = true;
      }
    }

    if (game.state === constants['GAME_STATE']['ROUND']) {
      if (new Date().valueOf() - game.lastObjectiveAdd >= constants['OBJECTIVE_ADD_INTERVAL']) {
        game.addedObjectives.push(game.objectives[Math.floor(Math.random() * game.objectives.length)]);
        game.lastObjectiveAdd = new Date().valueOf();
        game.dirty = true;
      }

      if (new Date().valueOf() - game.roundStart >= constants['ROUND_LENGTH_MINIMUM']) {
        if (Math.random() <= (new Date().valueOf() - game.roundStart) / constants['ROUND_LENGTH_TARGET']) {
          game.round++;

          if (game.round > constants['ROUNDS_PER_GAME']) {
            game.state = constants['GAME_STATE']['FINAL_SCORE'];
          } else {
            game.state = constants['GAME_STATE']['SCORE'];
            game.scoreStart = new Date().valueOf();

            game.addedObjectivesCount = [];
            for (var i = 0; i < game.addedObjectives.length; i++) {
              if (game.addedObjectivesCount[game.addedObjectives[i]]) {
                game.addedObjectivesCount[game.addedObjectives[i]]++;
              } else {
                game.addedObjectivesCount[game.addedObjectives[i]] = 1;
              }
            }

            game.addedObjectives = [];

            game.leadPlayer = 0;
            for (i = 0; i < game.players.length; i++) {
              if (game.players[i].score > game.players[game.leadPlayer].score) {
                game.leadPlayer = i;
              }

              game.players[i].hasDrunk = false;
            }
          }

          game.dirty = true;
        }
      }
    }

    if (game.state === constants['GAME_STATE']['SCORE']) {
      if (new Date().valueOf() - game.scoreStart >= constants['SCORE_LENGTH']) {
        game.state = constants['GAME_STATE']['ROUND'];
        game.roundStart = new Date().valueOf();
        game.dirty = true;
      }
    }

    if (game.state === constants['GAME_STATE']['FINAL_SCORE']) {
      var highScore = game.players[0].score;
      var highScoreIndex = 0;

      console.log('game stopped');
      clearInterval(game.intervalId);

      for (var i = 1; i < game.players.length; i++) {
        if (game.players[i].score > highScore) {
          highScore = game.players[i].score;
          highScoreIndex = i;
        }
      }

      game.winner = {
        name: game.players[highScoreIndex].name,
        score: highScore,
        fortune: mystiko.generateFortune(game.players[highScoreIndex].name)
      };

      game.dirty = true;
    }

    if (game.dirty) {
      io.to(game.name).emit('', {
        type: 'game',
        game: game
      });
      //console.log('game is in: ' + game.state + ' state at ' + game.round + ' round');

      game.dirty = false;
    }
  };

  return mystiko;
}();
