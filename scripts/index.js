const displayController = (function (document) {
  // Module
  const _startScreen = document.querySelector(".start-menu");
  const _gameScreen = document.querySelector(".game-wrapper");
  const _playerTwo = document.querySelector("#player-two");
  const _p1Name = document.querySelector(".p1-name");
  const _p2Name = document.querySelector(".p2-name");
  const _cells = document.querySelectorAll(".col");
  const _p1Score = document.querySelector(".p1-score");
  const _p2Score = document.querySelector(".p2-score");

  const toggleDisplay = (type) => {
    if (type == "form") {
      _startScreen.style.display = "none";
      _gameScreen.style.display = "flex";
    } else if (type === "newgame" || type === "exit") {
      _startScreen.style.display = "flex";
      _gameScreen.style.display = "none";
    }
  };

  const _updatePlayerNames = (p1Name, p2Name) => {
    _p1Name.innerHTML = "";
    _p2Name.innerHTML = "";
    _p1Name.insertAdjacentHTML(
      "afterbegin",
      `<i class="bi bi-person-fill"></i>${p1Name}`
    );
    if (p2Name === "AI") {
      _p2Name.insertAdjacentHTML(
        "afterbegin",
        `<i class="bi bi-cpu-fill"></i>${p2Name}`
      );
    } else {
      _p2Name.insertAdjacentHTML(
        "afterbegin",
        `<i class="bi bi-person-fill"></i>${p2Name}`
      );
    }
  };

  const _updateMoveDom = (marker, target) => {
    target.textContent = marker.toUpperCase();
  };

  const _updateInfoText = (text) => {
    const _infoDiv = document.querySelector(".info-text");
    _infoDiv.textContent = text;
  };

  const _addStar = (name) => {
    const star = document.createElement("i");
    star.classList.add("bi", "bi-star-fill");
    if (_p1Name.textContent.search(name) !== -1) {
      _p1Score.appendChild(star);
    } else {
      _p2Score.appendChild(star);
    }
  };

  const updateCurrentPlayerDOM = (name) => {
    if (name === _p1Name.textContent) {
      _p1Name.classList.add("current");
      _p2Name.classList.remove("current");
    } else {
      _p2Name.classList.add("current");
      _p1Name.classList.remove("current");
    }
  };

  const _resetDOM = () => {
    _cells.forEach((cell) => (cell.textContent = ""));
    _updateInfoText(" ");
    _p1Score.innerHTML = "";
    _p2Score.innerHTML = "";
  };

  const setupEventListener = (element, eventType, eventHandler) => {
    element.addEventListener(eventType, eventHandler);
  };

  const _setupDOM = () => {
    const pvc = document.querySelector("#mode-pvc");
    const pvp = document.querySelector("#mode-pvp");
    const diffChooser = document.querySelector(".diff-chooser");

    pvc.addEventListener("click", () => {
      _playerTwo.value = "AI";
      _playerTwo.disabled = true;
      diffChooser.style.display = "flex";
    });

    pvp.addEventListener("click", () => {
      _playerTwo.disabled = false;
      _playerTwo.value = "";
      _playerTwo.focus();
      diffChooser.style.display = "none";
    });
  };

  _setupDOM();

  return {
    setupEventListener,
    toggleDisplay,
    updatePlayerNames: _updatePlayerNames,
    updateMoveDOM: _updateMoveDom,
    updateInfoText: _updateInfoText,
    updateCurrentPlayerDOM,
    resetDOM: _resetDOM,
    addStar: _addStar,
  };
})(document);

const gameBoard = (function () {
  let _difficulty;
  let _p1;
  let _p2;
  let _round = 1;
  let _gameFinished = false;
  let _currentPlayer = null;
  let _board = ["", "", "", "", "", "", "", "", ""];

  const _setParameters = (p1, p2, difficulty) => {
    _p1 = p1;
    _p2 = p2;
    _difficulty = difficulty;
  };

  const _getParameters = () => {
    return {
      p1: _p1,
      p2: _p2,
      difficulty: _difficulty,
    };
  };

  const _updateCurrentPlayer = () => {
    if (_currentPlayer === _p1) _currentPlayer = _p2;
    else _currentPlayer = _p1;
  };

  const _updateWinCount = () => {
    if (_currentPlayer === _p1) {
      _p1.incrementWinCount();
    } else {
      _p2.incrementWinCount();
    }
  };

  const _getCurrentPlayer = () => _currentPlayer;

  const _isWinner = () => {
    for (let i = 0; i < 7; i = i + 3) {
      // check for 3 in row
      if (
        _board[i] !== "" &&
        _board[i] === _board[i + 1] &&
        _board[i + 1] === _board[i + 2]
      ) {
        return true;
      }
    }
    for (let i = 0; i < 3; i++) {
      // check for 3 in column
      if (
        _board[i] !== "" &&
        _board[i] === _board[i + 3] &&
        _board[i + 3] === _board[i + 6]
      ) {
        return true;
      }
    }
    // check for diagonals
    if (
      _board[0] !== "" &&
      _board[0] === _board[4] &&
      _board[4] === _board[8]
    ) {
      return true;
    }
    if (
      _board[2] !== "" &&
      _board[2] === _board[4] &&
      _board[4] === _board[6]
    ) {
      return true;
    }

    return false; // default case
  };

  const _isDraw = () => {
    for (let i = 0; i < 9; i++) {
      if (_board[i] === "") return false;
    }
    return true;
  };

  const _decideFinalWinner = () => {
    if (_p1.getWinCount() > _p2.getWinCount()) {
      return _p1.getName();
    } else {
      return _p2.getName();
    }
  };

  const _isValidMove = (pos) => {
    if (_board[pos] !== "") return false;
    return true;
  };

  const _makeMove = (pos) => {
    if (_board[pos] !== "") return false; // Is Valid Move??
    // else continue
    if (_currentPlayer.getWinStatus()) return false; // if there is already a winner don't make any moves

    _board[pos] = _currentPlayer.getMarker();

    if (_isWinner()) {
      _gameFinished = true;
      _currentPlayer.setWinStatus(true);
    }
    if (_isDraw()) {
      _gameFinished = true;
    }
    return true;
  };

  const _resetRound = () => {
    _board = ["", "", "", "", "", "", "", "", ""];
    _p1.setWinStatus(false);
    _p2.setWinStatus(false);
    _gameFinished = false;
    if (p1.getMarker() === "x") {
      _p1.changeMarker("o");
      _p2.changeMarker("x");
      _currentPlayer = p2;
    } else {
      _p1.changeMarker("x");
      _p2.changeMarker("o");
      _currentPlayer = p1;
    }
  };

  const _resetGame = () => {
    _board = ["", "", "", "", "", "", "", "", ""];
    _p1 = null;
    _p2 = null;
    _mode = null;
    _difficulty = null;
    _round = 1;
    _gameFinished = false;
    _currentPlayer = null;
  };

  return {
    setParameters: _setParameters,
    getParameters: _getParameters,
    getCurrentPlayer: _getCurrentPlayer,
    updateCurrentPlayer: _updateCurrentPlayer,
    getBoard: () => _board,
    getDifficulty: () => _difficulty,
    makeMove: _makeMove,
    isValidMove: _isValidMove,
    isGameFinished: () => _gameFinished,
    getRound: () => _round,
    updateRound: () => _round++,
    updateWinCount: _updateWinCount,
    resetRound: _resetRound,
    resetGame: _resetGame,
    decideFinalWinner: _decideFinalWinner,
  };
})();

const Player = (pname, marker) => {
  let winner = false;
  let winCount = 0;
  const getName = () => pname;
  const getMarker = () => marker;
  const changeMarker = (newMarker = "x") => {
    marker = newMarker;
  };
  const getWinStatus = () => winner;
  const setWinStatus = (status) => (winner = status);

  const getWinCount = () => winCount;
  const incrementWinCount = () => winCount++;

  return {
    getName,
    getMarker,
    changeMarker,
    getWinStatus,
    setWinStatus,
    getWinCount,
    incrementWinCount,
  };
};

const handleForm = (e) => {
  e.preventDefault();
  // get form values
  const p1Name = e.target.playerone.value;
  const p2Name = e.target.playertwo.value;
  const difficulty = e.target.difficulty.value;

  // create players
  p1 = Player(p1Name, "x");
  p2 = Player(p2Name, "o");

  // create game state
  gameBoard.setParameters(p1, p2, difficulty);
  game = gameBoard.getParameters();

  // display the board
  displayController.toggleDisplay("form");
  startGame();
};

function startGame() {
  displayController.updatePlayerNames(game.p1.getName(), game.p2.getName());
  // displayController.updateCurrentPlayer(
  //   gameBoard.getCurrentPlayer().getMarker()
  // );
  gameBoard.updateCurrentPlayer();
  displayController.updateCurrentPlayerDOM(
    gameBoard.getCurrentPlayer().getName()
  );
}

function handleCellClick(e) {
  const pos = Number(e.target.dataset.position);

  if (!gameBoard.makeMove(pos) || gameBoard.getRound() > 3) return;

  const currentPlayer = gameBoard.getCurrentPlayer();

  displayController.updateMoveDOM(currentPlayer.getMarker(), e.target);

  if (gameBoard.isGameFinished()) {
    // if true winner is decided

    // check if it's a draw or someone won
    if (!currentPlayer.getWinStatus()) {
      displayController.updateInfoText("It's a draw!");
    } else {
      displayController.updateInfoText(
        `${currentPlayer.getName()} wins the round!`
      );
      displayController.addStar(currentPlayer.getName());
      gameBoard.updateWinCount();
    }

    setTimeout(() => {
      if (gameBoard.getRound() < 3) {
        gameBoard.updateRound();
        gameBoard.resetRound();
        cells.forEach((cell) => (cell.textContent = ""));
        displayController.updateInfoText(`Round ${gameBoard.getRound()}`);
        displayController.updateCurrentPlayerDOM(
          gameBoard.getCurrentPlayer().getName()
        );
        // after round ends check if current player is AI if yes than make move after 2s
        setTimeout(() => {
          if (gameBoard.getCurrentPlayer().getName() === "AI") {
            makeAIMove(gameBoard.getDifficulty());
          }
        }, 2000);
      } else {
        const finalWinner = gameBoard.decideFinalWinner();
        console.log(finalWinner);
        if (finalWinner === "AI") {
          displayController.updateInfoText(`You lost against AI. Bad Luck!`);
        } else {
          displayController.updateInfoText(
            `Congratulations ${finalWinner}! You won the game`
          );
        }
      }
    }, 5000);

    return;
  }

  gameBoard.updateCurrentPlayer();
  displayController.updateCurrentPlayerDOM(
    gameBoard.getCurrentPlayer().getName()
  );

  // if next player is AI make an automatic move
  if (gameBoard.getCurrentPlayer().getName() === "AI") {
    makeAIMove(gameBoard.getDifficulty());
  }
}

function handleNewGame() {
  gameBoard.resetGame();
  displayController.resetDOM();
  displayController.toggleDisplay("newgame");
}

const form = document.querySelector("#form");
displayController.setupEventListener(form, "submit", handleForm);

const cells = document.querySelectorAll(".col");
cells.forEach((cell) => {
  displayController.setupEventListener(cell, "click", handleCellClick);
});

const newGameBtn = document.querySelector(".new-game");
displayController.setupEventListener(newGameBtn, "click", handleNewGame);
