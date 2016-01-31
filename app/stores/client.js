(function (client) {
  var state = {
    game: {},
    roomState: app.constants['CLIENT']['CONNECTION_STATE']['DISCONNECTED'],
    room: '',
    clientName: '',
    clientType: app.constants['CLIENT']['STATE']['NONE'],
    view: 'make-connection'
  },
  listeners = [];

  client.update = function (data) {
    if (data.type === 'client-connect') {
      state.roomState = app.constants['CLIENT']['CONNECTION_STATE']['CONNECTED'];
      client.emit();
    }

    if (data.type === 'client-name') {
      state.clientName = data.name;
      client.emit();
    }

    if (data.type === 'new-room') {
      room = data.room;
      client.emit();
    }

    if (data.type === 'game') {
      state.game = data.game;
      state.room = data.game.name;
      state.roomState = app.constants['CLIENT']['CONNECTION_STATE']['CONNECTED'];

      if (state.clientType === app.constants['CLIENT']['STATE']['HOST']) {
        if (data.game.state === app.constants['GAME_STATE']['INTRO']) {
          state.view = 'host-intro';
        }

        if (data.game.state === app.constants['GAME_STATE']['ROUND']) {
          state.view = 'host-round';
        }

        if (data.game.state === app.constants['GAME_STATE']['SCORE']) {
          state.view = 'host-score';
        }

        if (data.game.state === app.constants['GAME_STATE']['FINAL_SCORE']) {
          state.view = 'host-final-score';
        }
      }

      if (state.clientType === app.constants['CLIENT']['STATE']['PLAYER']) {
        if (data.game.state === app.constants['GAME_STATE']['INTRO']) {
          state.view = 'waiting';
        }

        if (data.game.state === app.constants['GAME_STATE']['ROUND']) {
          state.view = 'player-round';
        }

        if (data.game.state === app.constants['GAME_STATE']['SCORE']) {
          state.view = 'player-score';
        }
      }

      client.emit();
    }

    if (data.type === 'view-select') {
      state.view = data.view;

      if (data.view === 'hosting') {
        state.clientType = app.constants['CLIENT']['STATE']['HOST'];
        app.actions.createRoom();
      }

      if (data.view === 'player-config') {
        state.clientType = app.constants['CLIENT']['STATE']['PLAYER'];
      }

      client.emit();
    }

    console.log('Client update ', data);
  };

  client.register = function (callback) {
    listeners.push(callback);
  };

  client.emit = function () {
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](state);
    }
  };

  client.getName = function () {
    return state.clientName;
  };

  client.getRoom = function () {
    return state.room;
  };

  client.getType = function () {
    return state.clientType;
  };

  client.getState = function () {
    return state;
  };

  app.dispatcher.register(client.update);
})(window.app.stores.client = {});
