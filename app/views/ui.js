(function (ui) {
  var $body = $('body'),
    $mainContainer = $body.find('.main-content'),
    $currentObjective = $mainContainer.find('.current-objective-wrapper img'),
    $drink = $mainContainer.find('.button.drink'),
    $views = $mainContainer.children('section'),
    $findingRoom = $mainContainer.find('.finding-room'),
    $roomNameContainer = $mainContainer.find('.subcard.room'),
    $roomName = $mainContainer.find('.subcard.room .room-name'),
    $leader = $mainContainer.find('.subcard.leader'),
    $leadPlayer = $leader.find('.lead-player'),
    $leadScore = $leader.find('.lead-score'),
    $playerConfig = $mainContainer.find('.player-config'),
    $playerNameInput = $playerConfig.find('input[name="name"]'),
    $playerCodeInput = $playerConfig.find('input[name="code"]'),
    $playerInfo = $mainContainer.find('.player-info'),
    $playerName = $mainContainer.find('.player'),
    $playerObjectives = $mainContainer.find('.player-objectives'),
    $playerScore = $mainContainer.find('.player-score .score'),
    $playAgain = $mainContainer.find('.button.play-again'),
    $scoreBreakdown = $mainContainer.find('.score-breakdown'),
    $hostConfigPlayers = $mainContainer.find('.hosting .players'),
    $hostConfigPlayerCount = $hostConfigPlayers.find('.player-count'),
    $gameStart = $mainContainer.find('.game-start .button'),
    $viewSelect = $mainContainer.find('.view-select'),
    $winner = $mainContainer.find('.subcard.winner'),
    $winningFortune = $mainContainer.find('.subcard.fortune'),
    $winningPlayer = $winner.find('.winning-player'),
    $winningScore = $winner.find('.winning-score'),
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

    if (data.clientType === app.constants['CLIENT']['STATE']['HOST']) {
      if (data.view === 'host-round') {
        if (data.game.addedObjectives.length) {
          $currentObjective.attr('src', Mustache.render('img/{{filename}}', app.constants['OBJECTIVES'][data.game.addedObjectives[data.game.addedObjectives.length - 1]]));
        } else {
          $currentObjective.attr('src', '');
        }
      }

      if (data.view === 'host-score') {
        $leadPlayer.html(data.game.players[data.game.leadPlayer].name);
        $leadScore.html(data.game.players[data.game.leadPlayer].score);
      }

      if (data.view === 'host-final-score') {
        $winningFortune.html(Mustache.render('<p>{{fortune}}</p>', data.game.winner));
        $winningPlayer.html(data.game.winner.name);
        $winningScore.html(data.game.winner.score);
      }
    }

    if (data.clientType === app.constants['CLIENT']['STATE']['PLAYER']) {
      $playerName.html(data.clientName);

      if (data.view === 'player-round') {
        $mainContainer.find('.objective').remove();

        for (var i = 0; i < data.objectives.length; i++) {
          $playerObjectives.append(Mustache.render('<span class="objective"><img src="img/{{filename}}"><span class="objective-name">{{name}}</span></span>', app.constants['OBJECTIVES'][data.objectives[i]]));
        }

        if (data.hasDrunk) {
          $drink.addClass('disabled');
        } else {
          $drink.removeClass('disabled');
        }
      }

      if (data.view === 'player-score') {
        $playerScore.html(data.score);

        $scoreBreakdown.find('.objective').remove();
        for (i = 0; i < data.objectives.length; i++) {
          $scoreBreakdown.append(Mustache.render('<div class="objective"><img src="img/{{filename}}"><span class="objective-count">{{count}}</span></div>', {
            filename: app.constants['OBJECTIVES'][data.objectives[i]].filename,
            count: data.game.addedObjectivesCount[data.objectives[i]] || 0
          }));
        }
      }
    }
  };

  $drink.on('click', function (e) {
    if (!$drink.hasClass('disabled')) {
      app.actions.playerDrink(app.stores.client.getState().clientName);
      $drink.addClass('disabled');
    }
  });

  $playerConfig.find('.button').on('click', function (e) {
    app.actions.playerJoin($playerCodeInput.val(), $playerNameInput.val());
  });
  $playerConfig.find('input[name="name"]').enterKey(function (e) {
    app.actions.playerJoin($playerCodeInput.val(), $playerNameInput.val());
  });

  $playAgain.on('click', function (e) {
    window.location.reload();
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
