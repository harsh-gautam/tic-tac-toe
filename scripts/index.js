const displayController = (function (document) {
  // Module
  const _p1Name = document.querySelector(".p1-name");
  const _p2Name = document.querySelector(".p2-name");
  const _cells = document.querySelectorAll(".col");
  const _p1Score = document.querySelector(".p1-score");
  const _p2Score = document.querySelector(".p2-score");

  const toggleDisplay = (type) => {
    const gameScreen = document.querySelector(".game-wrapper");
    const startScreen = document.querySelector(".start-menu");
    const footer = document.querySelector("#footer");

    if (type == "form") {
      startScreen.style.height = "0";
      startScreen.style.opacity = "0";

      gameScreen.style.opacity = "1";
      gameScreen.style.height = "auto";
      footer.style.display = "none";
    } else if (type === "newgame" || type === "exit") {
      gameScreen.style.opacity = "0";
      gameScreen.style.height = "0";

      startScreen.style.opacity = "1";
      startScreen.style.height = "auto";
      footer.style.display = "flex";
    }
  };

  const _setPlayerNames = (p1Name, p2Name) => {
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

  const _updateInfoText = (text, name = null) => {
    const _infoDiv = document.querySelector(".info-text");
    _infoDiv.textContent = text;

    if (name !== null) {
      // In case of UI update when there is a winner
      const _star = document.createElement("i");
      _star.classList.add("bi", "bi-star-fill");
      if (_p1Name.textContent.search(name) !== -1) {
        _p1Score.appendChild(_star);
      } else {
        _p2Score.appendChild(_star);
      }
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
    const _playerTwo = document.querySelector("#player-two");
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
    setPlayerNames: _setPlayerNames,
    updateMoveDOM: _updateMoveDom,
    updateInfoText: _updateInfoText,
    updateCurrentPlayerDOM,
    resetDOM: _resetDOM,
  };
})(document);

const gameBoard = (function () {
  let _difficulty;
  let _p1;
  let _p2;
  let _round = 1;
  let _currentPlayer = null;
  let _board = ["", "", "", "", "", "", "", "", ""];

  const _setParameters = (p1, p2, difficulty) => {
    _p1 = p1;
    _p2 = p2;
    _difficulty = difficulty;
  };

  const _getGameParams = () => {
    return {
      board: _board,
      difficulty: _difficulty,
      currentPlayer: _currentPlayer,
      round: _round,
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

  const _gameFinished = () => {
    let finished = false;
    for (let i = 0; i < 7; i = i + 3) {
      // check for 3 in row
      if (
        _board[i] !== "" &&
        _board[i] === _board[i + 1] &&
        _board[i + 1] === _board[i + 2]
      ) {
        finished = true;
      }
    }
    for (let i = 0; i < 3; i++) {
      // check for 3 in column
      if (
        _board[i] !== "" &&
        _board[i] === _board[i + 3] &&
        _board[i + 3] === _board[i + 6]
      ) {
        finished = true;
      }
    }
    // check for diagonals
    if (
      _board[0] !== "" &&
      _board[0] === _board[4] &&
      _board[4] === _board[8]
    ) {
      finished = true;
    }
    if (
      _board[2] !== "" &&
      _board[2] === _board[4] &&
      _board[4] === _board[6]
    ) {
      finished = true;
    }

    if (finished === true) {
      _currentPlayer.setWinStatus(true);
      return true;
    } else {
      // Game is draw??
      for (let i = 0; i < 9; i++) {
        if (_board[i] === "") return false;
      }
      return true;
    }
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
    // if there is already a winner don't make any moves or not a valid move then exit
    if (!_isValidMove(pos) || _currentPlayer.isWinner()) return false;
    // else continue

    _board[pos] = _currentPlayer.getMarker();

    return true;
  };

  const _resetRoundInfo = () => {
    _board = ["", "", "", "", "", "", "", "", ""];
    _p1.setWinStatus(false);
    _p2.setWinStatus(false);
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
    _difficulty = null;
    _round = 1;
    _currentPlayer = null;
  };

  return {
    setParameters: _setParameters,
    getGameParams: _getGameParams,
    updateCurrentPlayer: _updateCurrentPlayer,
    getCurrentPlayer: () => _currentPlayer,
    makeMove: _makeMove,
    isValidMove: _isValidMove,
    isGameFinished: _gameFinished,
    updateRound: () => ++_round,
    updateWinCount: _updateWinCount,
    resetRoundInfo: _resetRoundInfo,
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
  const isWinner = () => winner;
  const setWinStatus = (status) => (winner = status);

  const getWinCount = () => winCount;
  const incrementWinCount = () => winCount++;

  return {
    getName,
    getMarker,
    changeMarker,
    isWinner,
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

  if (p1Name === "" || p2Name === "") {
    alert("You need to enter name for both players.");
    return;
  }

  // create players
  p1 = Player(p1Name, "x");
  p2 = Player(p2Name, "o");

  // create game state
  gameBoard.setParameters(p1, p2, difficulty);

  // display the board
  displayController.toggleDisplay("form");

  // Start Game
  displayController.setPlayerNames(p1.getName(), p2.getName());
  displayController.updateInfoText("Round 1");
  gameBoard.updateCurrentPlayer();
  displayController.updateCurrentPlayerDOM(
    gameBoard.getCurrentPlayer().getName()
  );
};

function handleCellClick(e) {
  const pos = Number(e.target.dataset.position);
  let { round, difficulty } = gameBoard.getGameParams();
  let currentPlayer = gameBoard.getCurrentPlayer();

  if (!gameBoard.makeMove(pos) || round > 3) return;

  displayController.updateMoveDOM(currentPlayer.getMarker(), e.target);

  if (gameBoard.isGameFinished() === true) {
    // if true winner is decided

    // check if it's a draw or someone won
    if (!currentPlayer.isWinner()) {
      displayController.updateInfoText("It's a draw!");
    } else {
      displayController.updateInfoText(
        `${currentPlayer.getName()} wins round ${round}!`,
        currentPlayer.getName()
      );
      gameBoard.updateWinCount();
    }

    setTimeout(() => {
      if (round < 3) {
        // Round 1, 2 or 3
        round = gameBoard.updateRound();
        gameBoard.resetRoundInfo();
        cells.forEach((cell) => (cell.textContent = ""));
        displayController.updateInfoText(`Round ${round}`);
        currentPlayer = gameBoard.getCurrentPlayer();
        displayController.updateCurrentPlayerDOM(currentPlayer.getName());
        // after round ends check if current player is AI if yes than make move after 1s
        setTimeout(() => {
          if (currentPlayer.getName() === "AI") {
            makeAIMove(difficulty);
          }
        }, 1000);
      } else {
        const finalWinner = gameBoard.decideFinalWinner();
        if (finalWinner === "AI") {
          displayController.updateInfoText(`You lost against AI. Try Again`);
        } else {
          displayController.updateInfoText(
            `Congratulations ${finalWinner}! You won the game`
          );
        }
      }
    }, 3000);

    return;
  }

  gameBoard.updateCurrentPlayer();
  currentPlayer = gameBoard.getCurrentPlayer();
  displayController.updateCurrentPlayerDOM(currentPlayer.getName());

  // if next player is AI make an automatic move
  if (currentPlayer.getName() === "AI") {
    makeAIMove(difficulty);
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
