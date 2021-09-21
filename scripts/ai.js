const evaluate = (board, moves) => {
  let score = null;
  for (let i = 0; i < 7; i = i + 3) {
    // check for 3 in row
    if (
      board[i] !== "" &&
      board[i] === board[i + 1] &&
      board[i + 1] === board[i + 2]
    ) {
      if (board[i] === moves.ai) {
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
      if (board[i] === moves.ai) {
        score = 10;
      } else {
        score = -10;
      }
    }
  }
  // check for diagonals
  if (board[0] !== "" && board[0] === board[4] && board[4] === board[8]) {
    if (board[0] === moves.ai) {
      score = 10;
    } else {
      score = -10;
    }
  }
  if (board[2] !== "" && board[2] === board[4] && board[4] === board[6]) {
    if (board[2] === moves.ai) {
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

const minimaxHard = (board, depth, isMaximizer, moves) => {
  let score = evaluate(board, moves);
  if (score === 10 || score === -10 || score === 0) return score;

  if (isMaximizer) {
    let bestScore = -1000000;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = moves.ai;
        let score = minimaxHard(board, depth + 1, false, moves);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = 1000000;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = moves.human;
        let score = minimaxHard(board, depth + 1, true, moves);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

const minimaxMedium = (board, depth, isMaximizer, moves) => {
  let score = evaluate(board, moves);
  if (score === 10 || score === -10 || score === 0 || depth === 0) return score;

  if (isMaximizer) {
    let bestScore = -1000000;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = moves.ai;
        let score = minimaxMedium(board, depth - 1, false, moves);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = 1000000;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = moves.human;
        let score = minimaxMedium(board, depth - 1, true, moves);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

const clickCell = (position) => {
  const cells = document.querySelectorAll(".col");
  const cell = Array.from(cells).filter((cell) => {
    if (Number(cell.dataset.position) === position) return cell;
  });
  cell[0].click();
};

const makeAIMove = (type) => {
  let pos;
  const ai = gameBoard.getCurrentPlayer().getMarker();
  const human = ai === "x" ? "o" : "x";
  const moves = { human, ai };

  if (type.toLowerCase() === "easy") {
    let validMove = false;
    while (validMove !== true) {
      pos = Math.floor(Math.random() * 7);
      if (gameBoard.isValidMove(pos)) {
        validMove = true;
      }
    }
  } else if (type.toLowerCase() === "medium") {
    let bestScore = -Infinity;
    const boardCopy = [...gameBoard.getBoard()];
    for (let i = 0; i < 9; i++) {
      if (boardCopy[i] === "") {
        boardCopy[i] = ai;
        let score = minimaxMedium(boardCopy, 2, false, moves);
        boardCopy[i] = "";
        if (score > bestScore) {
          bestScore = score;
          pos = i;
        }
      }
    }
  } else if (type.toLowerCase() === "hard") {
    let bestScore = -Infinity;
    const boardCopy = [...gameBoard.getBoard()];
    for (let i = 0; i < 9; i++) {
      if (boardCopy[i] === "") {
        boardCopy[i] = ai;
        let score = minimaxHard(boardCopy, 0, false, moves);
        boardCopy[i] = "";
        if (score > bestScore) {
          bestScore = score;
          pos = i;
        }
      }
    }
  }

  clickCell(pos);
};
