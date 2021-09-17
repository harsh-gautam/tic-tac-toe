const displayController = (function (document) {
  // Module
  const _startScreen = document.querySelector(".start-menu");
  const _gameScreen = document.querySelector(".game-wrapper");
  const _newGameBtn = document.querySelector(".new-game");
  const _playerTwo = document.querySelector("#player-two");
  const _p1Name = document.querySelector(".p1-name");
  const _p2Name = document.querySelector(".p2-name");

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
    _infoDiv.textContent = `${text} won!`;
  };

  const setupEventListener = (element, eventType, eventHandler) => {
    element.addEventListener(eventType, eventHandler);
  };

  const _attachPvC = () => {
    const pvc = document.querySelector("#mode-pvc");
    pvc.addEventListener("click", () => {
      _playerTwo.value = "AI";
      _playerTwo.disabled = true;
    });
  };

  const _attachPvP = () => {
    const pvp = document.querySelector("#mode-pvp");
    pvp.addEventListener("click", () => {
      _playerTwo.disabled = false;
      _playerTwo.value = "";
      _playerTwo.focus();
    });
  };

  const _setupDOM = () => {
    _attachPvC();
    _attachPvP();

    _newGameBtn.addEventListener("click", () => toggleDisplay("newgame"));
  };

  return {
    setupEventListener,
    toggleDisplay,
    setupDOM: _setupDOM,
    updatePlayerNames: _updatePlayerNames,
    updateMoveDOM: _updateMoveDom,
    updateInfoText: _updateInfoText,
  };
})(document);

const gameBoard = (function () {
  let _mode;
  let _difficulty;
  let _p1;
  let _p2;
  let _currentPlayer = null;
  let _board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const _setParameters = (p1, p2, mode, difficulty) => {
    _p1 = p1;
    _p2 = p2;
    _mode = mode;
    _difficulty = difficulty;
  };

  const _getParameters = () => {
    return {
      p1: _p1,
      p2: _p2,
      mode: _mode,
      difficulty: _difficulty,
    };
  };

  const _playGame = () => {
    if (_currentPlayer === null) _currentPlayer = p1;
  };

  const _updateCurrentPlayer = () => {
    if (_currentPlayer === _p1) _currentPlayer = _p2;
    else _currentPlayer = _p1;
  };

  const _getCurrentPlayer = () => _currentPlayer;

  const _isWinner = () => {
    for (let i = 0; i < 3; i++) {
      // check for 3 in row
      if (
        (_board[i][0] !== "" || _board[i][1] !== "" || _board[i][2] !== "") &&
        _board[i][0] === _board[i][1] &&
        _board[i][1] === _board[i][2]
      ) {
        return true;
      }
      // check for 3 in column
      if (
        (_board[0][i] !== "" || _board[1][i] !== "" || _board[2][i] !== "") &&
        _board[0][i] === _board[1][i] &&
        _board[1][i] === _board[2][i]
      ) {
        return true;
      }
    }
    // check for diagonals
    if (
      (_board[0][0] !== "" || _board[1][1] !== "" || _board[2][2] !== "") &&
      _board[0][0] === _board[1][1] &&
      _board[1][1] === _board[2][2]
    ) {
      return true;
    }
    if (
      (_board[0][2] !== "" || _board[1][1] !== "" || _board[2][0] !== "") &&
      _board[0][2] === _board[1][1] &&
      _board[1][1] === _board[2][0]
    ) {
      return true;
    }

    return false; // default case
  };

  const _makeMove = (row, col) => {
    if (_board[row][col] !== "") return false; // Is Valid Move??
    // else continue
    if (_currentPlayer.getWinStatus()) return false; // if there is already a winner don't make any moves

    _board[row][col] = _currentPlayer.getMarker();
    if (_isWinner()) {
      _currentPlayer.updateWinStatus(true);
    }
    return true;
  };

  return {
    setParameters: _setParameters,
    getParameters: _getParameters,
    playGame: _playGame,
    getCurrentPlayer: _getCurrentPlayer,
    updateCurrentPlayer: _updateCurrentPlayer,
    makeMove: _makeMove,
  };
})();

const Player = (pname, marker, winner = false) => {
  const getName = () => pname;
  const getMarker = () => marker;
  const changeMarker = (newMarker = "x") => {
    marker = newMarker;
  };
  const getWinStatus = () => winner;
  const updateWinStatus = (s) => (winner = s);

  return { getName, getMarker, changeMarker, getWinStatus, updateWinStatus };
};

const handleForm = (e) => {
  e.preventDefault();
  // get form values
  const p1Name = e.target.playerone.value;
  const p2Name = e.target.playertwo.value;
  const gameMode = e.target.mode.value;
  const difficulty = e.target.difficulty.value;

  // create players
  p1 = Player(p1Name, "x");
  p2 = Player(p2Name, "o");

  // create game state
  gameBoard.setParameters(p1, p2, gameMode, difficulty);
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
}

displayController.setupDOM();

const form = document.querySelector("#form");
displayController.setupEventListener(form, "submit", handleForm);

const cells = document.querySelectorAll(".col");
cells.forEach((cell) => {
  displayController.setupEventListener(cell, "click", handleCellClick);
});

function handleCellClick(e) {
  const col = Number(e.target.dataset.col);
  const row = Number(e.target.parentNode.dataset.row);

  if (!gameBoard.makeMove(row, col)) return;

  displayController.updateMoveDOM(
    gameBoard.getCurrentPlayer().getMarker(),
    e.target
  );

  if (gameBoard.getCurrentPlayer().getWinStatus()) {
    // if true winner is decided
    displayController.updateInfoText(gameBoard.getCurrentPlayer().getName());
    return;
  }
  gameBoard.updateCurrentPlayer();
}
