/**
 * 1. oyun start buttonu ile bashlasin
 * 2. oyuncu oz isharesini seche bilsin
 * 3. oyuncu botla ve ya iki neferlik oynamagi sece bilsin
 */

var root = document.querySelector("#root");
let gameOver = false;
let bootPlay = false;
let winIndex = [
  [0, 1, 2],
  [0, 4, 8],
  [0, 3, 6],
  [2, 5, 8],
  [1, 4, 7],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

function init() {
  const board = [];
  gameOver = false;
  bootPlay = false;
  for (let i = 0; i < 9; i++) {
    board.push({ value: "", id: i, isWin: false });
  }

  render(board);
}

function handleBoxClick(e, board) {
  if (!gameOver) {
    const id = e.target.getAttribute("data-id");
    const foundItem = board.find((item) => item.id === Number(id));

    if (foundItem.value === "" && !bootPlay) {
      foundItem.value = "x";
      const foundItemIndex = board.indexOf(foundItem);
      board[foundItemIndex] = foundItem;
      bootPlay = true;
      checkWinner(board);
      setTimeout(() => {
        bot(board);
      }, 1000);
      render(board);
    }
  }
}

function checkWinner(board) {
  for (let i = 0; i < winIndex.length; i++) {
    const [a, b, c] = winIndex[i];

    if (board[a].value !== "" && board[a].value === board[b].value && board[a].value === board[c].value) {
      board[a].isWin = true;
      board[b].isWin = true;
      board[c].isWin = true;
      gameOver = true;
      break;
    }
  }
}

function render(board) {
  root.innerHTML = "";

  for (let i = 0; i < board.length; i++) {
    let button = document.createElement("button");
    button.setAttribute("data-id", board[i].id);

    button.addEventListener("click", (e) => handleBoxClick(e, board));

    button.classList.add("box");
    button.innerHTML = board[i].value;
    if (board[i].isWin) {
      button.classList.add("win");
    }
    root.appendChild(button);
  }
  if (gameOver) {
    let button = document.createElement("button");

    button.innerText = "Refresh";
    button.classList.add("refresh_btn");
    button.addEventListener("click", () => init());
    root.appendChild(button);
  }
}

function checkWinIndex(board) {
  for (let i = 0; i < winIndex.length; i++) {
    const [a, b, c] = winIndex[i];

    if (board[a].value === "o" && board[a].value === board[b].value && board[c].value === "") {
      return c;
    }
    if (board[a].value === "o" && board[a].value === board[c].value && board[b].value === "") {
      return b;
    }
    if (board[b].value === "o" && board[b].value === board[c].value && board[a].value === "") {
      return a;
    }
  }
}
function blockWinIndex(board) {
  for (let i = 0; i < winIndex.length; i++) {
    const [a, b, c] = winIndex[i];
    if (board[b].value === "x" && board[b].value === board[c].value && board[a].value === "") {
      return a;
    }
    if (board[a].value === "x" && board[a].value === board[b].value && board[c].value === "") {
      return c;
    }
    if (board[a].value === "x" && board[a].value === board[c].value && board[b].value === "") {
      return b;
    }
  }
}

function findBestMove(board) {
  const checkWin = checkWinIndex(board);
  const blockWin = blockWinIndex(board);

  if (checkWin > -1) {
    return checkWin;
  }
  if (blockWin > -1) {
    return blockWin;
  } else {
    if (board[4].value === "x") {
      if (board[2].value == "") {
        return 2;
      }
      if (board[6].value == "") {
        return 6;
      }
      if (board[8].value == "") {
        return 8;
      }
    }
  }
}

function bot(board) {
  const index = findBestMove(board);

  if (typeof index !== "undefined") {
    if (bootPlay && !gameOver) {
      board[index].value = "o";
      bootPlay = false;

      checkWinner(board);
      render(board);
    }
  } else {
    const emptyBox = board.filter((b) => b.value === "");
    if (emptyBox.length > 0) {
      const i = Math.floor(Math.random() * emptyBox.length);
      let index = board[4].value === "" ? 4 : board[0].value === "" ? 0 : emptyBox[i].id;
      if (
        (board[2].value === "x" && board[6].value === "x") ||
        (board[0].value === "x" && board[8].value === "x") ||
        (board[5].value === "x" && board[0].value === "x" && board[1].value !== "o")
      ) {
        index = 1;
      }
      if (board[5].value === "x" && board[6].value === "x" && board[8].value !== "o") {
        index = 8;
      }

      console.log("🚀 ~ file: app.js:160 ~ bot ~ index:", index);

      if (bootPlay && !gameOver) {
        board[index].value = "o";
        bootPlay = false;
        checkWinner(board);
        render(board);
      }
    } else {
      gameOver = true;
      render(board);
    }
  }
}
