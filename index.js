var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var constants = require('./app/constants.js');

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
    dirty: true,
    name: roomName,
    objectives: []
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

function gameUpdate() {
  var game = this;

  if (game.state === constants['GAME_STATE']['PLAYER_JOIN']) {

  }

  if (game.state === constants['GAME_STATE']['INTRO']) {
    if (new Date().valueOf() - game.timeStarted >= constants['INTRO_LENGTH']) {
      game.state = constants['GAME_STATE']['ROUND'];
      game.dirty = true;
    }
  }

  if (game.state === constants['GAME_STATE']['ROUND']) {

  }

  if (game.state === constants['GAME_STATE']['FINAL_SCORE']) {
    console.log('game stopped');
    clearInterval(game.intervalId);
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
