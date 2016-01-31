(function (ui) {
  var $body = $('body'),
    $mainContainer = $body.find('.main-content'),
    $views = $mainContainer.children('section'),
    $findingRoom = $mainContainer.find('.finding-room'),
    $roomNameContainer = $mainContainer.find('.subcard.room'),
    $roomName = $mainContainer.find('.subcard.room .room-name'),
    $playerConfig = $mainContainer.find('.player-config'),
    $playerNameInput = $playerConfig.find('input[name="name"]'),
    $playerCodeInput = $playerConfig.find('input[name="code"]'),
    $playerInfo = $mainContainer.find('.player-info'),
    $hostConfigPlayers = $mainContainer.find('.hosting .players'),
    $hostConfigPlayerCount = $hostConfigPlayers.find('.player-count'),
    $gameStart = $mainContainer.find('.game-start .button'),
    $viewSelect = $mainContainer.find('.view-select'),
    $waitingPlayerPlayers = $mainContainer.find('.waiting-players .players');

  ui.gameRender = function (data) {
    var clientState = app.stores.client.getState();
  };

  ui.clientRender = function (data) {
    var gameState = app.stores.game.getState();

    $views.addClass('hide');

    console.log('.' + data.view);
    $views.filter('.' + data.view).removeClass('hide');

    if (data.view === 'hosting') {
      if (data.room) {
        $roomNameContainer.removeClass('hide');
        $findingRoom.addClass('hide');
        $roomName.html(data.room);
      } else {
        $roomNameContainer.addClass('hide');
        $findingRoom.removeClass('hide');
      }

      if (data.game.players) {
        $hostConfigPlayerCount.html(data.game.players.length);
      }
    }
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

  $viewSelect.on('click', function (e) {
    app.actions.viewSelect($(e.currentTarget).data().view);
  });

  app.stores.game.register(ui.gameRender);
  app.stores.client.register(ui.clientRender);
})(window.app.views.ui = {});
