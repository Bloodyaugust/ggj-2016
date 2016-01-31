(function (client) {
  var state = {
    roomState: app.constants['CLIENT']['CONNECTION_STATE']['DISCONNECTED'],
    room: '',
    clientName: '',
    clientType: app.constants['CLIENT']['STATE']['NONE'],
    view: 'make-connection'
  },
  listeners = [];

  client.update = function (data) {
    if (data.type === 'client-connect') {
      state.roomState = app.constants['CLIENT']['CONNECTION_STATE']['DISCONNECTED'];
      client.emit();
    }

    if (data.type === 'client-name') {
      state.clientName = data.name;
      client.emit();
    }

    if (data.type === 'new-room') {
      room = data.room;
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

  client.getType = function () {
    return state.clientType;
  };

  client.getState = function () {
    return state;
  };

  app.dispatcher.register(client.update);
})(window.app.stores.client = {});
