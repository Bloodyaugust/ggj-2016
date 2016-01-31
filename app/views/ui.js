(function (ui) {
  var $body = $('body'),
    $mainContainer = $body.find('.main-content'),
    $views = $mainContainer.children('section'),
    $findingRoom = $mainContainer.find('.finding-room'),
    $roomNameContainer = $mainContainer.find('.card.room'),
    $roomName = $mainContainer.find('.card.room .room-name'),
    $playerConfig = $mainContainer.find('.player-config'),
    $playerNameInput = $playerConfig.find('input[name="name"]'),
    $playerCodeInput = $playerConfig.find('input[name="code"]'),
    $playerInfo = $mainContainer.find('.player-info'),
    $hostConfigPlayers = $mainContainer.find('.hosting .players'),
    $waitingPlayerPlayers = $mainContainer.find('.waiting-players .players');

  ui.gameRender = function (data) {
    var clientState = app.stores.client.getState();
  };

  ui.clientRender = function (data) {
    var gameState = app.stores.game.getState();

    $views.addClass('hide');
  };

  $playerConfig.find('.button').on('click', function (e) {
    app.actions.playerJoin($playerCodeInput.val(), $playerNameInput.val());
  });
  $playerConfig.find('input[name="name"]').enterKey(function (e) {
    app.actions.playerJoin($playerCodeInput.val(), $playerNameInput.val());
  });

  $gameStart.on('click', function (e) {
    app.actions.startGame();
  });

  app.stores.game.register(ui.gameRender);
  app.stores.client.register(ui.clientRender);
})(window.app.views.ui = {});
