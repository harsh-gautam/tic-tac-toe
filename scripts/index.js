const displayController = (function (document) {
  // Module
  const _newGameBtn = document.querySelector(".new-game");
  const _form = document.querySelector("#form");
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

  const setupFormListener = (handler) => {
    _form.addEventListener("submit", handler);
  };

  return { setupFormListener, toggleDisplay };
})(document);

const handleForm = (e) => {
  e.preventDefault();
  console.log(e.target);
  displayController.toggleDisplay("form");
};

displayController.setupFormListener(handleForm);
