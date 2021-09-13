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

const form = document.querySelector("#form");
const newGameBtn = document.querySelector(".new-game");

const handleForm = (e) => {
  e.preventDefault();
  console.log(e.target);
  displayController.toggleDisplay("form");
};

const handleNewGame = () => {
  displayController.toggleDisplay("newgame");
};

const Player = (pname, marker, gameMode, diff) => {
  let difficulty = diff;
  let name = pname;
  let mode = gameMode;

  const getInfo = () => {
    name, marker, mode, difficulty;
  };

  const changeDifficulty = (d) => {
    difficulty = d;
  };

  const changeMode = (m) => {
    mode = m;
  };
  return { getInfo, changeDifficulty, changeMode };
};

displayController.setupDOM();
displayController.setupEventListener(form, "submit", handleForm);
displayController.setupEventListener(newGameBtn, "click", handleNewGame);
