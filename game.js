let currentPlayer = "A";
let selectedCharacter = null;

// Add click event listeners to cells
document.querySelectorAll(".cell").forEach((cell) => {
  cell.addEventListener("click", () => {
    if (cell.id.startsWith(currentPlayer)) {
      selectedCharacter = cell.id;
      document.getElementById(
        "selected-character"
      ).innerText = `Selected: ${selectedCharacter}`;
      document.getElementById("message").innerText = "";
      showControlsForCharacter(selectedCharacter);
    }
  });
});

function showControlsForCharacter(character) {
  // Hide all buttons initially
  document.querySelectorAll("#controls button").forEach((button) => {
    button.style.display = "none";
  });

  // Show appropriate buttons based on the selected character
  if (character.startsWith("A") || character.startsWith("B")) {
    if (character[2] === "P") {
      // Pawn (P1, P2, P3)
      document.getElementById("move-L").style.display = "inline";
      document.getElementById("move-R").style.display = "inline";
      document.getElementById("move-F").style.display = "inline";
      document.getElementById("move-B").style.display = "inline";
    } else if (character[2] === "H") {
      // Hero
      if (character[3] === "1") {
        // Hero1
        document.getElementById("move-L").style.display = "inline";
        document.getElementById("move-R").style.display = "inline";
        document.getElementById("move-F").style.display = "inline";
        document.getElementById("move-B").style.display = "inline";
      } else if (character[3] === "2") {
        // Hero2
        document.getElementById("move-FL").style.display = "inline";
        document.getElementById("move-FR").style.display = "inline";
        document.getElementById("move-BL").style.display = "inline";
        document.getElementById("move-BR").style.display = "inline";
      }
    }
  }
}

function move(direction) {
  if (!selectedCharacter) return;

  const [player, character] = selectedCharacter.split("-");
  let [row, col] = getCharacterPosition(character);
  let captureInfo = "";

  switch (character[0]) {
    case "P": // Pawn
      [row, col, captureInfo] = movePawn(row, col, direction);
      break;
    case "H":
      if (character[1] === "1") {
        // Hero1
        [row, col, captureInfo] = moveHero1(row, col, direction);
      } else if (character[1] === "2") {
        // Hero2
        [row, col, captureInfo] = moveHero2(row, col, direction);
      }
      break;
  }

  if (isValidMove(row, col)) {
    updateCharacterPosition(character, row, col, captureInfo);
    logMove(character, direction, captureInfo);
    if (checkWinCondition()) {
      return; // Stop further processing if the game has ended
    }
    switchPlayer();
  } else {
    document.getElementById("message").innerText = "Invalid move. Try again.";
  }

  // Hide controls after move is completed
  document.querySelectorAll("#controls button").forEach((button) => {
    button.style.display = "none";
  });
}

function getCharacterPosition(character) {
  const cell = document.getElementById(`${currentPlayer}-${character}`);
  const index = Array.from(cell.parentNode.children).indexOf(cell);
  return [Math.floor(index / 5), index % 5];
}

function movePawn(row, col, direction) {
  let captureInfo = "";
  switch (direction) {
    case "L":
      col = Math.max(0, col - 1);
      break;
    case "R":
      col = Math.min(4, col + 1);
      break;
    case "F":
      row = currentPlayer === "A" ? Math.min(4, row + 1) : Math.max(0, row - 1);
      break;
    case "B":
      row = currentPlayer === "A" ? Math.max(0, row - 1) : Math.min(4, row + 1);
      break;
  }
  // Check for capture
  const newCell = document.querySelector(
    `#grid .cell:nth-child(${row * 5 + col + 1})`
  );
  if (newCell && newCell.id && !newCell.id.startsWith(currentPlayer)) {
    captureInfo = `(Captured ${newCell.id})`;
  }
  return [row, col, captureInfo];
}

function moveHero1(row, col, direction) {
  let captureInfo = "";
  switch (direction) {
    case "L":
      col = Math.max(0, col - 2);
      break;
    case "R":
      col = Math.min(4, col + 2);
      break;
    case "F":
      row = currentPlayer === "A" ? Math.min(4, row + 2) : Math.max(0, row - 2);
      break;
    case "B":
      row = currentPlayer === "A" ? Math.max(0, row - 2) : Math.min(4, row + 2);
      break;
  }
  // Check for capture
  const newCell = document.querySelector(
    `#grid .cell:nth-child(${row * 5 + col + 1})`
  );
  if (newCell && newCell.id && !newCell.id.startsWith(currentPlayer)) {
    captureInfo = `(Captured ${newCell.id})`;
  }
  return [row, col, captureInfo];
}

function moveHero2(row, col, direction) {
  let captureInfo = "";
  switch (direction) {
    case "FL":
      row = currentPlayer === "A" ? Math.min(4, row + 2) : Math.max(0, row - 2);
      col = Math.max(0, col - 2);
      break;
    case "FR":
      row = currentPlayer === "A" ? Math.min(4, row + 2) : Math.max(0, row - 2);
      col = Math.min(4, col + 2);
      break;
    case "BL":
      row = currentPlayer === "A" ? Math.max(0, row - 2) : Math.min(4, row + 2);
      col = Math.max(0, col - 2);
      break;
    case "BR":
      row = currentPlayer === "A" ? Math.max(0, row - 2) : Math.min(4, row + 2);
      col = Math.min(4, col + 2);
      break;
  }
  
  // Check for capture
  const newCell = document.querySelector(
    `#grid .cell:nth-child(${row * 5 + col + 1})`
  );
  if (newCell && newCell.id && !newCell.id.startsWith(currentPlayer)) {
    captureInfo = `(Captured ${newCell.id})`;
  }
  return [row, col, captureInfo];
}

function isValidMove(row, col) {
  if (row < 0 || row > 4 || col < 0 || col > 4) return false;
  const newCell = document.querySelector(
    `#grid .cell:nth-child(${row * 5 + col + 1})`
  );
  return !newCell.id || !newCell.id.startsWith(currentPlayer);
}

function updateCharacterPosition(character, row, col, captureInfo) {
  const newCell = document.querySelector(
    `#grid .cell:nth-child(${row * 5 + col + 1})`
  );
  const oldCell = document.getElementById(selectedCharacter);

  // Update the new cell
  newCell.id = `${currentPlayer}-${character}`;
  newCell.innerText = `${currentPlayer}-${character}`;

  // Clear the old cell
  oldCell.id = "";
  oldCell.innerText = "";

  // Reset selection
  selectedCharacter = null;
  document.getElementById("selected-character").innerText = "Selected: None";
}

function switchPlayer() {
  currentPlayer = currentPlayer === "A" ? "B" : "A";
  document.getElementById(
    "current-player"
  ).innerText = `Current Player: ${currentPlayer}`;
}

function logMove(character, direction, captureInfo) {
  const log = document.getElementById("moves-log");
  if (captureInfo) {
    log.innerText += `${currentPlayer}-${character}:${direction} ${captureInfo}\n`;
  } else {
    log.innerText += `${currentPlayer}-${character}:${direction}\n`;
  }
}

function checkWinCondition() {
  const playerAWins = [...document.querySelectorAll("#grid .cell")].every(
    (cell) => !cell.id.startsWith("B")
  );
  const playerBWins = [...document.querySelectorAll("#grid .cell")].every(
    (cell) => !cell.id.startsWith("A")
  );

  if (playerAWins) {
    displayWinner("A");
    return true;
  } else if (playerBWins) {
    displayWinner("B");
    return true;
  }
  return false;
}

function displayWinner(winner) {
  document.getElementById("message").innerText = `Player ${winner} wins!`;
  document.getElementById(
    "current-player"
  ).innerHTML = `<span style="color: green; font-weight: bold;">Player ${winner} wins!</span>`;
  disableControls();
}

function disableControls() {
  document.querySelectorAll("#controls button").forEach((button) => {
    button.disabled = true;
  });
}

function applyGradientToCell(cell, color1, color2) {
  cell.style.background = `linear-gradient(45deg, ${color1}, ${color2})`;
}


// const cell = document.querySelector(".cell");
// applyGradientToCell(cell, "#ffdddd", "#ffcccc");


