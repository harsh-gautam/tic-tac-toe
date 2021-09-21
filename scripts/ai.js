const makeAIMove = (type) => {
  let validMove = false;
  let pos;

  if (type.toLowerCase() === "easy") {
    while (validMove !== true) {
      pos = Math.floor(Math.random() * 7);
      if (gameBoard.isValidMove(pos)) {
        validMove = true;
      }
    }
  }

  let ai = gameBoard.getCurrentPlayer().getMarker();
  let human = ai === "x" ? "o" : "x";

  const evaluate = (board) => {
    let score = null;
    for (let i = 0; i < 7; i = i + 3) {
      // check for 3 in row
      if (
        board[i] !== "" &&
        board[i] === board[i + 1] &&
        board[i + 1] === board[i + 2]
      ) {
        if (board[i] === ai) {
          score = 10;
        } else {
          score = -10;
        }
      }
    }
    for (let i = 0; i < 3; i++) {
      // check for 3 in column
      if (
        board[i] !== "" &&
        board[i] === board[i + 3] &&
        board[i + 3] === board[i + 6]
      ) {
        if (board[i] === ai) {
          score = 10;
        } else {
          score = -10;
        }
      }
    }
    // check for diagonals
    if (board[0] !== "" && board[0] === board[4] && board[4] === board[8]) {
      if (board[0] === ai) {
        score = 10;
      } else {
        score = -10;
      }
    }
    if (board[2] !== "" && board[2] === board[4] && board[4] === board[6]) {
      if (board[2] === ai) {
        score = 10;
      } else {
        score = -10;
      }
    }

    let openSlots = 0;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") openSlots++;
    }
    if (score === null && openSlots === 0) {
      score = 0;
    }

    return score;
  };

  const minimax = (board, depth, isMaximizer) => {
    let score = evaluate(board);
    if (score === 10 || score === -10 || score === 0) return score;

    if (isMaximizer) {
      let bestScore = -1000000;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = ai;
          let score = minimax(board, depth + 1, false);
          board[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = 1000000;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = human;
          let score = minimax(board, depth + 1, true);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  if (type.toLowerCase() === "hard") {
    let bestScore = -Infinity;
    let bestMove;
    const boardCopy = [...gameBoard.getBoard()];
    for (let i = 0; i < 9; i++) {
      if (boardCopy[i] === "") {
        boardCopy[i] = ai;
        let score = minimax(boardCopy, 0, false);
        boardCopy[i] = "";
        if (score > bestScore) {
          bestScore = score;
          pos = i;
        }
      }
    }
  }

  const cells = document.querySelectorAll(".col");
  const cell = Array.from(cells).filter((cell) => {
    if (Number(cell.dataset.position) === pos) return cell;
  });
  cell[0].click();
};
