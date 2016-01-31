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
    state: constants['GAME_STATE']['SETUP'],
    day: 1,
    dirty: true,
    name: roomName,
  };

  console.log('room created: ', roomName);
  return rooms[roomName];
}

function configurePlayers(roomName) {
  var game = rooms[roomName];
  var players = game.players;

  game.timeStarted = new Date().valueOf();
  game.state = constants['GAME_STATE']['INTRO'];
}

function gameUpdate() {
  var game = this;

  if (game.state === constants['GAME_STATE']['SETUP']) {

  }

  if (game.state === constants['GAME_STATE']['INTRO']) {
    if (new Date().valueOf() - game.timeStarted >= constants['INTRO_LENGTH']) {
      game.state = constants['GAME_STATE']['ROUND'];
      game.dirty = true;
    }
  }

  if (game.state === constants['GAME_STATE']['ROUND']) {

  }

  if (game.state === constants['GAME_STATE']['END']) {
    clearInterval(game.intervalId);
    game.dirty = true;
  }

  if (!testMode && game.dirty) {
    io.to(game.name).emit('', {
      type: 'game',
      game: game
    });

    game.dirty = false;
  }
}
