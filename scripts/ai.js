const MiniMax = () => {
  const _evaluate = (board, moves) => {
    let score = null;
    for (let i = 0; i < 7; i = i + 3) {
      // check for 3 in row
      if (
        board[i] !== "" &&
        board[i] === board[i + 1] &&
        board[i + 1] === board[i + 2]
      ) {
        score = board[i] === moves.ai ? 10 : -10;
      }
    }
    for (let i = 0; i < 3; i++) {
      // check for 3 in column
      if (
        board[i] !== "" &&
        board[i] === board[i + 3] &&
        board[i + 3] === board[i + 6]
      ) {
        score = board[i] === moves.ai ? 10 : -10;
      }
    }
    // check for diagonals
    if (board[0] !== "" && board[0] === board[4] && board[4] === board[8]) {
      score = board[0] === moves.ai ? 10 : -10;
    }
    if (board[2] !== "" && board[2] === board[4] && board[4] === board[6]) {
      score = board[2] === moves.ai ? 10 : -10;
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

  const hard = (board, depth, isMaximizer, moves) => {
    let score = _evaluate(board, moves);
    if (score === 10 || score === -10 || score === 0) return score;

    if (isMaximizer) {
      let bestScore = -1000000;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = moves.ai;
          let score = hard(board, depth + 1, false, moves);
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
          let score = hard(board, depth + 1, true, moves);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const medium = (board, depth, isMaximizer, moves) => {
    let score = _evaluate(board, moves);
    if (score === 10 || score === -10 || score === 0 || depth === 0)
      return score;

    if (isMaximizer) {
      let bestScore = -1000000;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = moves.ai;
          let score = medium(board, depth - 1, false, moves);
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
          let score = medium(board, depth - 1, true, moves);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  return { hard, medium };
};

const minimax = MiniMax();

const clickCell = (position) => {
  const cells = document.querySelectorAll(".col");
  const cell = Array.from(cells).filter((cell) => {
    if (Number(cell.dataset.position) === position) return cell;
  });
  cell[0].click();
};

function makeAIMove(type) {
  let pos;
  const ai = gameBoard.getCurrentPlayer().getMarker();
  const human = ai === "x" ? "o" : "x";
  const moves = { human, ai };
  const { board: boardCopy } = gameBoard.getGameParams();

  if (type.toLowerCase() === "easy") {
    let validMove = false;
    while (validMove !== true) {
      pos = Math.floor(Math.random() * boardCopy.length);
      if (gameBoard.isValidMove(pos)) {
        validMove = true;
      }
    }
  } else if (type.toLowerCase() === "medium") {
    let bestScore = -Infinity;
    const { board: boardCopy } = gameBoard.getGameParams();
    for (let i = 0; i < 9; i++) {
      if (boardCopy[i] === "") {
        boardCopy[i] = ai;
        let score = minimax.medium(boardCopy, 2, false, moves);
        boardCopy[i] = "";
        if (score > bestScore) {
          bestScore = score;
          pos = i;
        }
      }
    }
  } else if (type.toLowerCase() === "hard") {
    let bestScore = -Infinity;
    const { board: boardCopy } = gameBoard.getGameParams();
    for (let i = 0; i < 9; i++) {
      if (boardCopy[i] === "") {
        boardCopy[i] = ai;
        let score = minimax.hard(boardCopy, 0, false, moves);
        boardCopy[i] = "";
        if (score > bestScore) {
          bestScore = score;
          pos = i;
        }
      }
    }
  }

  clickCell(pos);
}
