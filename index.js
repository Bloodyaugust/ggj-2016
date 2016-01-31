var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var constants = require('./app/constants.js');
var mustache = require('mustache');

var rooms = {};

var testMode = (process.argv[2] === 'test');

if (!testMode) {
  io.on('connection', function(socket){
    socket.on('', handleClientMessage.bind(socket));
    socket.emit('', {type: 'client-connect'});
  });

  http.listen(3000, function(){
    console.log('listening on *:3000');
  });

  app.use(express.static('app'));
  app.use(express.static('bower_components'));
  app.use(express.static('res'));
  app.use(express.static('styles'));
  app.use(express.static('styles'));
  app.listen(80, function () {
    console.log('Server started.')
  });
} else {
  constants['INTRO_LENGTH'] = 1000;
  (function () {
    var testRoom = createRoom(),
      testRoomName = testRoom.name;

    console.log('Running tests, starting game');

    testRoom.intervalId = setInterval(gameUpdate.bind(testRoom), constants['UPDATE_INTERVAL']);

    console.log('Adding test players');
  })();
}

function handleClientMessage(data) {
  var socket = this,
    game;

  if (data.type === 'create-room') {
    var room = createRoom();
    socket.join(room.name);
    socket.gameRoom = room.name;

    rooms[socket.gameRoom].intervalId = setInterval(gameUpdate.bind(rooms[socket.gameRoom]), constants['UPDATE_INTERVAL']);
    console.log('game created', room.name, constants['UPDATE_INTERVAL']);
  }

  if (data.type === 'player-join') {
    socket.join(data.room);
    socket.gameRoom = data.room;
    handlePlayerJoin(data);
  }

  if (data.type === 'game-start') {
    handleGameStart(socket.gameRoom);
  }
}

function handlePlayerJoin(data) {
  rooms[data.room].players.push(data.player);
  rooms[data.room].dirty = true;

  console.log('player joined: ' + data.player.name + ' ' + data.room);
}

function handleGameStart(gameRoom) {
  configurePlayers(gameRoom);
  rooms[gameRoom].dirty = true;
  console.log('Starting new game with players: ');
  for (var i = 0; i < rooms[gameRoom].players.length; i++) {
    console.log(rooms[gameRoom].players[i].name);
  }
}

function createRoom() {
  //pulled from http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
  var s = "abcdefghijklmnopqrstuvwxyz";
  var roomName = '';
  var roomFound = false;

  while(!roomFound) {
    roomName = Array(4).join().split(',').map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');

    if (!rooms[roomName]) {
      roomFound = true;
    }
  }

  rooms[roomName] = {
    players: [],
    state: constants['GAME_STATE']['PLAYER_JOIN'],
    round: 1,
    roundStart: 0,
    scoreStart: 0,
    dirty: true,
    name: roomName,
    objectives: [],
    addedObjectives: [],
    lastObjectiveAdd: constants['OBJECTIVE_ADD_INTERVAL'],
    winner: {
      name: '',
      score: 0
    }
  };

  console.log('room created: ', roomName);
  return rooms[roomName];
}

function configurePlayers(roomName) {
  var game = rooms[roomName];
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
    firstObjective = Math.floor(Math.random() * objectiveSelection.length);
    secondObjective = Math.floor(Math.random() * objectiveSelection.length);

    while (secondObjective === firstObjective) {
      secondObjective = Math.floor(Math.random() * objectiveSelection.length);
    }
    players[i].objectives.push(firstObjective);
    players[i].objectives.push(secondObjective);
  }

  game.timeStarted = new Date().valueOf();
  game.state = constants['GAME_STATE']['INTRO'];
  game.objectives = objectiveSelection.slice(0);
}

function generateFortune(name) {
  return mustache.render('{{name}} will {{a}} {{b}} {{c}} in {{d}}.', {
    name: name,
    a: constants['FORTUNE'][0][Math.floor(Math.random() * constants['FORTUNE'][0].length)],
    b: constants['FORTUNE'][1][Math.floor(Math.random() * constants['FORTUNE'][1].length)],
    c: constants['FORTUNE'][2][Math.floor(Math.random() * constants['FORTUNE'][2].length)],
    d: constants['FORTUNE'][3][Math.floor(Math.random() * constants['FORTUNE'][3].length)],
  });
}

function gameUpdate() {
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

    if (new Date().valueOf() - game.roundStart >= constants['ROUND_LENGTH']) {
      game.round++;

      if (game.round > constants['ROUNDS_PER_GAME']) {
        game.state = constants['GAME_STATE']['FINAL_SCORE'];
      } else {
        game.state = constants['GAME_STATE']['SCORE'];
        game.scoreStart = new Date().valueOf();
      }

      game.dirty = true;
    }
  }

  if (game.state === constants['GAME_STATE']['SCORE']) {
    if (new Date().valueOf() - game.scoreStart >= constants['OBJECTIVE_ADD_INTERVAL']) {
      game.addedObjectives.push(game.objectives[Math.floor(Math.random() * game.objectives.length)]);
      game.lastObjectiveAdd = new Date().valueOf();
      game.dirty = true;
    }

    if (new Date().valueOf() - game.roundStart >= constants['SCORE_LENGTH']) {
      game.state = constants['GAME_STATE']['ROUND'];
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
      fortune: generateFortune(game.players[highScoreIndex].name)
    };

    game.dirty = true;
  }

  if (!testMode && game.dirty) {
    io.to(game.name).emit('', {
      type: 'game',
      game: game
    });
    console.log('game is in: ' + game.state + ' state');

    game.dirty = false;
  }
}
