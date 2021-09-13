const displayController = (function (document) {
  // Module
  const _startScreen = document.querySelector(".start-menu");
  const _gameScreen = document.querySelector(".game-wrapper");
  const _playerTwo = document.querySelector("#player-two");

  const toggleDisplay = (type) => {
    if (type == "form") {
      _startScreen.style.display = "none";
      _gameScreen.style.display = "flex";
    } else if (type === "newgame" || type === "exit") {
      _startScreen.style.display = "flex";
      _gameScreen.style.display = "none";
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

  const setupDOM = () => {
    _attachPvC();
    _attachPvP();
  };

  return { setupEventListener, toggleDisplay, setupDOM };
})(document);

const gameBoard = (function () {
  let _mode;
  let _difficulty;
  let _p1;
  let _p2;
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

  return {
    setParameters: _setParameters,
    getParameters: _getParameters,
  };
})();

const Player = (pname, marker) => {
  const getName = () => pname;
  const getMarker = () => marker;
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
  p1 = Player(p1Name, "x");
  p2 = Player(p2Name, "o");

  // create game state
  gameBoard.setParameters(p1, p2, gameMode, difficulty);
  console.log(gameBoard.getParameters());
  // displayController.toggleDisplay("form");
};

const handleNewGame = () => {
  displayController.toggleDisplay("newgame");
};

displayController.setupDOM();
displayController.setupEventListener(form, "submit", handleForm);
displayController.setupEventListener(newGameBtn, "click", handleNewGame);
