const displayController = (function (document) {
  // Module
  const _startScreen = document.querySelector(".start-menu");
  const _gameScreen = document.querySelector(".game-wrapper");

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

  return { setupEventListener, toggleDisplay };
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

displayController.setupEventListener(form, "submit", handleForm);
displayController.setupEventListener(newGameBtn, "click", handleNewGame);
