(function (actions) {
  actions.heartbeat = function () {
    app.dispatcher.dispatch({
      type: 'heartbeat',
      timeStamp: new Date
    });
  };

  actions.viewSelect = function (view) {
    app.dispatcher.dispatch({
      type: 'view-select',
      view: view
    });
  };

  actions.createRoom = function () {
    app.dispatcher.dispatch({
      type: 'create-room',
      remote: true
    });
  };

  actions.playerJoin = function (room, playerName) {
    app.dispatcher.dispatch({
      type: 'player-join',
      player: {
        name: playerName,
        score: 0,
        objectives: [],
        charm: {},
        hasDrunk: false
      },
      room: room.toLowerCase(),
      remote: true,
    });

    app.dispatcher.dispatch({
      type: 'client-name',
      name: playerName
    });

    actions.viewSelect('waiting');
  };

  actions.playerDrink = function (name, roomName) {
    app.dispatcher.dispatch({
      type: 'player-drink',
      name: name,
      room: roomName,
      remote: true
    });
  };

  actions.startGame = function (roomName) {
    app.dispatcher.dispatch({
      type: 'game-start',
      room: roomName,
      remote: true
    });
  };
})(window.app.actions = {});
