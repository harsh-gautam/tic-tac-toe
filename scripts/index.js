const displayController = (function (document) {
  // Module
  const _startScreen = document.querySelector(".start-menu");
  const _gameScreen = document.querySelector(".game-wrapper");
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
  };

  return {
    setupEventListener,
    toggleDisplay,
    setupDOM: _setupDOM,
    updatePlayerNames: _updatePlayerNames,
  };
})(document);

const gameBoard = (function () {
  let _mode;
  let _difficulty;
  let _p1;
  let _p2;
  let _currentPlayer = null;
  let _board = [[], [], []];

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

  return {
    setParameters: _setParameters,
    getParameters: _getParameters,
    playGame: _playGame,
    getCurrentPlayer: _getCurrentPlayer,
    updateCurrentPlayer: _updateCurrentPlayer,
  };
})();

const Player = (identity, pname, marker) => {
  const getName = () => pname;
  const getMarker = () => marker;
  const getIdentity = () => identity;
  const changeMarker = (newMarker = "x") => {
    marker = newMarker;
  };

  return { getName, getMarker, changeMarker };
};

const form = document.querySelector("#form");
const newGameBtn = document.querySelector(".new-game");

const handleForm = (e) => {
  e.preventDefault();
  // get form values
  const p1Name = e.target.playerone.value;
  const p2Name = e.target.playertwo.value;
  const gameMode = e.target.mode.value;
  const difficulty = e.target.difficulty.value;

  // create players
  p1 = Player("p1", p1Name, "x");
  p2 = Player("p2", p2Name, "o");

  // create game state
  gameBoard.setParameters(p1, p2, gameMode, difficulty);
  game = gameBoard.getParameters();

  // display the board
  displayController.toggleDisplay("form");
  startGame();
};

const handleNewGame = () => {
  displayController.toggleDisplay("newgame");
};

function startGame() {
  displayController.updatePlayerNames(game.p1.getName(), game.p2.getName());
  // displayController.updateCurrentPlayer(
  //   gameBoard.getCurrentPlayer().getMarker()
  // );
  gameBoard.playGame();
  console.log(gameBoard.getCurrentPlayer());
}

displayController.setupDOM();
displayController.setupEventListener(form, "submit", handleForm);
displayController.setupEventListener(newGameBtn, "click", handleNewGame);
