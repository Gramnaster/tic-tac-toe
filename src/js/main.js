// Provided board for the challenge
let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''] 
];

// If an index has an X/O for all these positions, that's a win
let victoryCondition = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

// DOM declarations
const boardMain = document.getElementById('board-main');
const history = document.getElementById('history-contents');
const mainHeader = document.getElementById('main-header');
const prevBtn = document.getElementById('prev-round');
const nextBtn = document.getElementById('next-round');
const resetBtn = document.getElementById('reset-btn');

// DOM player buttons and nametags
const playerSection = document.getElementById('player-section');
const playerBtns = document.getElementById('player-buttons');
const p1Name = document.getElementById('footer-header-p1');
const p2Name = document.getElementById('footer-header-p2');
const p1Btn = document.getElementById('choose-player1');
const p2Btn = document.getElementById('choose-player2');

//Create PlayerTurnPiece which determines which piece to put
let playerTurnPiece = '';
let playerTurn = 0;
let currentTurn = 0;
let playerChosen = false;

// Game state declaration
let roundCount = 0;
let gameOver = false;
let winner = '';

// Stores moves into this array
let movesList = [];

// Creates new movesData object using function constructor
// Because the user story says so
const movesData = function (round, piece, i, j) {
  this.round = round;
  this.piece = piece;
  this.i = i;
  this.j = j;
}

// Primary function to run the game.
function runGame() {
  // While no one has won, keep the game running.
  if (!checkVictory()) {
    // ForEach checks row -> columns, then assigns event listener to each.
    board.forEach((gridrow, i) => {
      gridrow.forEach((gridcolumn, j) => {
        // Creation of each gridbox element
        let gridbox = document.createElement('div');
        gridbox.innerHTML = '';
        gridbox.classList.add('gridbox');
        boardMain.append(gridbox);
        console.log(`Created grid: ${i+1} | column: ${j+1}`);

        // For each gridbox, give it an event listener we'll use later
        // Event listener deactivates as soon as it is pressed
        gridbox.addEventListener('click', () => {
          // Prevents further moves if no player is chosen, gameOver is true, or they've already clicked the area previously.
          if (!playerChosen || gameOver || gridbox.textContent !== '') return;
          console.log(`You have clicked row: ${i+1} | column: ${j+1}`);
          
          // Stores these moves for display later in the history
          // Records move history for display later
          // Clears the entire board and sets the contents based on RoundCount
          // RoundCount is set based on how long the movelist is
          storeBoard(playerTurnPiece, i, j);
          moveHistory(playerTurnPiece, i, j);
          roundCount = movesList.length;
          displayBoard(i, j);
          setHistoryTo(roundCount);
          updateNavButtons();
          
          // Displays board content
          gridbox.textContent = playerTurnPiece;
          gridbox.append();
          console.log(`You have placed ${playerTurnPiece} on the row: ${i+1} | column: ${j+1}`);
          
          // Checks if someone has won
          if (checkVictory()) {
            gameOver = true;
            console.log(`Game Over!`);
            p1Btn.disabled = true;
            p2Btn.disabled = true;
          } else if (board.flat().every(grid => grid !== '')) {
            gameOver = true;
            showVictory(`THE ONLY WINNING MOVE IS TO NOT PLAY`);
            console.log(`Game Over!`);
            p1Btn.disabled = true;
            p2Btn.disabled = true;
          } else {
            // Switches player after a turn has been made
            switchPlayerTurn();
          }
        });
      });
    });
  }
  console.log(`Grid creation should be complete.`);
}

document.addEventListener('DOMContentLoaded', runGame);

// Initialises first player as soon as the content is loaded
// document.addEventListener('DOMContentLoaded', function startPlayerTurn() {
  // playerTurn = (Math.ceil(Math.random() * 2));
  // console.log(`It is Player ${playerTurn}'s turn`);
  // return playerTurn;
// });

// You can choose your playerturn. Resets the board when invoked the first time.
function choosePlayerTurn() {
  mainHeader.innerHTML = 'CHOOSE THE FIRST PLAYER';
  playerSection.classList.add('hidden');
  playerBtns.classList.remove('hidden');
  p1Btn.classList.remove('hidden');
  p2Btn.classList.remove('hidden');
  p1Btn.classList.add('active-player');
  p2Btn.classList.add('active-player');
  
  // Enables and disables elements as required when P1 is selected
  p1Btn.addEventListener('click', () => {
    if (gameOver) return;
    playerTurn = 1;
    playerTurnPiece = 'X';
    playerChosen = true;
    p1Btn.disabled = true;
    p2Btn.disabled = true;
    playerBtns.classList.add('hidden');
    p1Btn.classList.add('hidden');
    p2Btn.classList.add('hidden');
    p1Name.classList.add('active-player');
    p2Name.classList.remove('active-player');
    playerSection.classList.remove('hidden');
    mainHeader.innerHTML = 'TIC TAC TOE';
    return playerTurn;
  });

  // Enables and disables elements as required when P1 is selected
  p2Btn.addEventListener('click', () => {
    if (gameOver) return;
    playerTurn = 2;
    playerTurnPiece = 'O';
    playerChosen = true;
    p1Btn.disabled = true;
    p2Btn.disabled = true;
    playerBtns.classList.add('hidden');
    p1Btn.classList.add('hidden');
    p2Btn.classList.add('hidden');
    p2Name.classList.add('active-player');
    p1Name.classList.remove('active-player');
    playerSection.classList.remove('hidden');
    mainHeader.innerHTML = 'TIC TAC TOE';
    return playerTurn;
  });
}

// Start player turn function as soon as DOM is loaded
document.addEventListener('DOMContentLoaded', choosePlayerTurn);

// I have two players. Whoever starts first is random. 
// Determined as soon as "Press Start" is played.
function switchPlayerTurn() {
  // startPlayerTurn();
  playerTurn = playerTurn === 1 ? 2 : 1;
  playerTurnPiece = playerTurn === 1 ? 'X' : 'O';
  if (playerTurn === 1) {
    p1Name.classList.add('active-player');
    p2Name.classList.remove('active-player');
  } else if (playerTurn === 2) {
    p2Name.classList.add('active-player');
    p1Name.classList.remove('active-player');
  } else {
    p1Name.classList.remove('active-player');
    p2Name.classList.remove('active-player');
  }
  console.log(`It is Player ${playerTurn}'s turn`);
  console.log(`Current player piece is ${playerTurnPiece}`);
}

// Stores information to the board as per user story
function storeBoard(piece, i, j) {
  board[i].splice(j, 1, piece);
  console.log('Gameboard State:', board);
}

// Stores the moves into the movelist array for recollection
function moveHistory(piece, i, j) {
  const newMove = new movesData(roundCount, piece, i, j);
  movesList.push(newMove);
  console.log(movesList);
  return newMove;
}

// Displays the board from the main board state array
function displayBoard(i, j) {
  console.log(movesList);

  board[i][j] = movesList[roundCount-1].piece;
  console.log(`Board[i][j] is: ${board[i][j]}`);
  console.log(`Displaying ${playerTurnPiece} on the board`);
  return playerTurnPiece = board[i][j];
}

// Sets the visuals of the history based on the round
function setHistoryTo(round) {
  // Clear all history DOM elements
  history.innerHTML = '';
  // Render history up to the current round
  for (let k = 0; k < round; k++) {
    let move = movesList[k];
    let pRound = document.createElement('p');
    let pPiece = document.createElement('p');
    let pRow = document.createElement('p');
    let pCol = document.createElement('p');

    pRound.textContent = move.round + 1;
    pPiece.textContent = move.piece;
    pRow.textContent = move.i + 1;
    pCol.textContent = move.j + 1;

    pRound.classList.add('grid-item');
    pPiece.classList.add('grid-item');
    pRow.classList.add('grid-item');
    pCol.classList.add('grid-item');
    history.append(pRound, pPiece, pRow, pCol);
  }

  console.log(`-----------------------------------------`);
  console.log(`Round: ${roundCount}`);
  if (roundCount > 0 && movesList[roundCount-1]) {
  console.log(`Piece: ${movesList[roundCount-1].piece} R: ${movesList[roundCount-1].i+1} C: ${movesList[roundCount-1].j+1}`);
  }
}

// Checks if you've won against the victory conditions array
function checkVictory() {
  // Declaration of win scores
  let xWinScore = 0;
  let oWinScore = 0;

  // For-of loop to check each array in the victory condition
  // [0,1,2], [3,4,5], ...
  for (const v1 of victoryCondition) {
    // Flattens the board so I could check if there's an 'X' or 'O' in an index
    // [1,2,3,4,5,6,7,8,9] which corresponds to the victory positions
    const flatBoard = board.flat();

    // For-of loop through each index position inside the each array
    // 0, 1, 2 | 3, 4, 5 | ...
    for (const v2 of v1) {
      if (flatBoard[v2] !== '' && flatBoard[v2] === 'X') {
        xWinScore++;
      } else if (flatBoard[v2] !== '' && flatBoard[v2] === 'O') {
        oWinScore++;
      }
    }

    // If they reached score 3, it means all X or O are aligned. Otherwise, reset to zero and check another victory condition
    if (xWinScore === 3) {
      console.log(`Player 1 has won`);
      winner = 'PLAYER 1 WINS';
      showVictory(winner);
      return true;
    } else if (oWinScore === 3) {
      console.log(`Player 2 has won`);
      winner = 'PLAYER 2 WINS';
      showVictory(winner);
      return true;
    } else {
      xWinScore = 0;
      oWinScore = 0;
    }
  }
  return false;
}

// Uses the winner variable
function showVictory(winner) {
  mainHeader.textContent = winner;
}

// Sets the board at a round first by clearing it then populating it based on the roundcount
function setBoardAtRound(round) {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];

  // Clears current board display
  Array.from(boardMain.children).forEach(box => box.textContent = '');

  // Replay moves up to the selected round
  for (let k = 0; k < round; k++) {
    const move = movesList[k];
    board[move.i][move.j] = move.piece;
    // Update the DOM gridbox as well
    // The gridboxes are created in row-major order, so index = i * 3 + j
    const gridbox = boardMain.children[move.i * 3 + move.j];
    if (gridbox) gridbox.textContent = move.piece;
  }
}

// Button event listener that decreases/increases round count, sets board and history at that roundcount. Updates button condition to hide/show
prevBtn.addEventListener('click', () => {
  if (roundCount > 0) {
    roundCount--;
    setBoardAtRound(roundCount);
    setHistoryTo(roundCount);
    updateNavButtons();
    return roundCount;
  }
});

nextBtn.addEventListener('click', () => {
  if (roundCount < movesList.length) {
    roundCount++;
    setBoardAtRound(roundCount);
    setHistoryTo(roundCount);
    updateNavButtons();
    return roundCount;
  }
});

// Reset button 
resetBtn.addEventListener('click', () => {
  // Reset all game state variables
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  movesList = [];
  roundCount = 0;
  gameOver = false;
  winner = '';
  // playerTurn = Math.ceil(Math.random() * 2); // Randomize starting player
  playerTurn = 0;
  // playerTurnPiece = playerTurn === 1 ? 'X' : 'O';
  p1Btn.disabled = false;
  p2Btn.disabled = false;
  playerChosen = false;

  // Clear DOM elements
  boardMain.innerHTML = '';
  history.innerHTML = '';
  mainHeader.textContent = 'TIC TAC TOE';

  // Re-initialize the game and nav buttons
  runGame();
  choosePlayerTurn();
  updateNavButtons();
});

// Updates button elements to disable them
function updateNavButtons() {
  console.log('updateNavButtons:', { roundCount, movesListLength: movesList.length });
  if (roundCount <= 0) {
    prevBtn.classList.add('hidden');
  } else {
    prevBtn.classList.remove('hidden');
  }

  if (roundCount >= movesList.length) {
    nextBtn.classList.add('hidden');
  } else {
    nextBtn.classList.remove('hidden');
  }
}

updateNavButtons();