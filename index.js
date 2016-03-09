var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var constants = require('./app/constants.js');
var mystiko = require('./app/WitchesBrew.js')

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

    testRoom.intervalId = setInterval(mystiko.update.bind(testRoom, io), constants['UPDATE_INTERVAL']);

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

    rooms[socket.gameRoom].intervalId = setInterval(mystiko.update.bind(rooms[socket.gameRoom], io), constants['UPDATE_INTERVAL']);
    console.log('game created', room.name);
  } else if (data.type === 'player-join') {
    socket.join(data.room);
    socket.gameRoom = data.room;
    mystiko.trigger(data.type, [rooms[data.room], data]);
  } else {
    mystiko.trigger(data.type, [rooms[data.room], data]);
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

  rooms[roomName] = mystiko.trigger('create-room', [roomName]);

  console.log('room created: ', roomName);
  return rooms[roomName];
}
