(function connectFour() {
	// Constants
	const gridCols = 7;
	const gridRows = 6;

	// Game Variables
	let currentPlayer;
	let player1 = "Player One";
	let player2 = "Player Two";
	let player1Color = "rgb(255,0,0";
	let player2Color = "rgb(0,0,0";
	let player1Score = 0;
	let player2Score = 0;
	let tilesPlaced = 0;

	// DOM Initilizations
	const gameBoard = document.querySelector(".game-board");
	const tableRow = document.getElementsByTagName("tr");
	const tableCol = document.getElementsByTagName("td");
	const playerTurn = document.getElementById("player-turn");
	const playerScores = document.getElementById("player-scores");
	const gameResult = document.getElementById("game-result");

	// Game Logic
	// Checks if game pieces are equal to each other and that there are no empty game cells
	function checkPiecesMatch(piece1, piece2, piece3, piece4) {
		return (
			piece1 === piece2 &&
			piece1 === piece3 &&
			piece1 === piece4 &&
			piece1 !== "white"
		);
	}

	// Checks for four consecutive horizontal same-colored pieces
	function horizontalCheck() {
		for (let r = 0; r < gridRows; r++) {
			for (let c = 0; c < 4; c++) {
				if (
					checkPiecesMatch(
						tableRow[r].children[c].style.backgroundColor,
						tableRow[r].children[c + 1].style.backgroundColor,
						tableRow[r].children[c + 2].style.backgroundColor,
						tableRow[r].children[c + 3].style.backgroundColor
					)
				)
					return true;
			}
		}
	}

	// Checks for four consecutive vertical same-colored pieces
	function verticalCheck() {
		for (let c = 0; c < gridCols; c++) {
			for (let r = 0; r < 3; r++) {
				if (
					checkPiecesMatch(
						tableRow[r].children[c].style.backgroundColor,
						tableRow[r + 1].children[c].style.backgroundColor,
						tableRow[r + 2].children[c].style.backgroundColor,
						tableRow[r + 3].children[c].style.backgroundColor
					)
				)
					return true;
			}
		}
	}

	// Checks for four consecutive downward diagonal same-colored pieces
	function downDiagCheck() {
		for (let c = 0; c < 4; c++) {
			for (let r = 0; r < 3; r++) {
				if (
					checkPiecesMatch(
						tableRow[r].children[c].style.backgroundColor,
						tableRow[r + 1].children[c + 1].style.backgroundColor,
						tableRow[r + 2].children[c + 2].style.backgroundColor,
						tableRow[r + 3].children[c + 3].style.backgroundColor
					)
				)
					return true;
			}
		}
	}

	// Checks for four consecutive upward diagonal same-colored pieces
	function upDiagCheck() {
		for (let c = 0; c < 4; c++) {
			for (let r = 5; r > 2; r--) {
				if (
					checkPiecesMatch(
						tableRow[r].children[c].style.backgroundColor,
						tableRow[r - 1].children[c + 1].style.backgroundColor,
						tableRow[r - 2].children[c + 2].style.backgroundColor,
						tableRow[r - 3].children[c + 3].style.backgroundColor
					)
				)
					return true;
			}
		}
	}

	// Clears the playale game board and displays end game modal with game result and updated player scores
	function endGame(type) {
		clearTable();
		toggleEndGameModal();

		let winner = currentPlayer === 1 ? player1 : player2;
		type === "tie"
			? (gameResult.innerText = "Tie Game!")
			: (gameResult.innerText = `${winner} Wins!`);
		playerScores.innerText = `${player1}: ${player1Score} | ${player2}: ${player2Score}`;
	}

	function placePiece(e) {
		let col = e.target.cellIndex;
		let row = [];

		for (let i = 5; i >= 0; i--) {
			// Loops through until finds the first white or empty spot in a column
			if (tableRow[i].children[col].style.backgroundColor === "white") {
				row.push(tableRow[i].children[col]);
				tilesPlaced++;

				//If current player is player one change cell background to player one's color, check if win/draw conditions trigger and switch to player two's turn
				if (currentPlayer === 1) {
					row[0].style.backgroundColor = player1Color;
					if (
						horizontalCheck() ||
						verticalCheck() ||
						downDiagCheck() ||
						upDiagCheck()
					) {
						player1Score++;
						return endGame("win");
					} else if (tilesPlaced === 42) {
						return endGame("tie");
					}
					playerTurn.innerText = `${player2}'s turn`;
					return (currentPlayer = 2);
				}

				//If current player is player one change cell background to player one's color, check if win/draw conditions trigger and switch to player two's turn
				else {
					row[0].style.backgroundColor = player2Color;
					if (
						horizontalCheck() ||
						verticalCheck() ||
						downDiagCheck() ||
						upDiagCheck()
					) {
						player2Score++;
						return endGame("win");
					} else if (tilesPlaced === 42) {
						return endGame("tie");
					}
					playerTurn.innerText = `${player1}'s turn`;
					return (currentPlayer = 1);
				}
			}
		}
	}

	// Creates a new game table
	function createTable(rows, cols) {
		// Create table and tbody elements
		let table = document.createElement("table");
		let tbody = document.createElement("tbody");

		// Add table element to game-board div
		gameBoard.append(table);

		// Add tbody element to table element
		table.append(tbody);

		// Creates table row elements and adds them to table body element
		for (let r = 0; r < rows; r++) {
			let tr = document.createElement("tr");
			tbody.append(tr);

			for (let c = 0; c < cols; c++) {
				let td = document.createElement("td");
				td.classList.add("cell");
				document.getElementsByTagName("tr")[r].append(td);
			}
		}

		// Adds an event listener to each table cell and sets background color to white
		Array.prototype.forEach.call(tableCol, (cell) => {
			cell.addEventListener("click", placePiece);
			cell.style.backgroundColor = "white";
		});
	}

	// Removes table element from the game board
	function clearTable() {
		gameBoard.removeChild(document.getElementsByTagName("table")[0]);
	}

	// Initialize new game state
	function newGame() {
		currentPlayer = 1;
		tilesPlaced = 0;
		playerTurn.innerText = `${player1}'s turn`;
		togglePlayerInfoModal();
		createTable(gridRows, gridCols);
	}

	// Modals

	// DOM Initializations
	const rulesButton = document.getElementById("rules-button");
	const rulesModal = document.getElementById("rules-modal");
	const playButton = document.getElementById("play");
	const playerModal = document.getElementById("player-modal");
	const player1Name = document.getElementById("player1");
	const player2Name = document.getElementById("player2");
	const playersColorsButtons = document.getElementsByClassName("color-swatch");
	const endGameModal = document.getElementById("end-game-modal");
	const playAgainButton = document.getElementById("play-again");
	const exitButton = document.getElementById("exit");

	// Event Listeners
	rulesButton.addEventListener("click", toggleRulesModal);
	playButton.addEventListener("click", newGame);

	playAgainButton.addEventListener("click", () => {
		newGame();
		toggleEndGameModal();
	});

	// Reloads page on game exit
	exitButton.addEventListener("click", () => {
		location.reload;
	});

	// Changes player one's name based on text input (Default name is "Player One")
	player1Name.addEventListener("input", (e) => {
		e.preventDefault();
		e.target.value !== ""
			? (player1 = e.target.value)
			: (player1 = "Player One");
	});

	// Changes player two's name based on text input (Default name is "Player Two")
	player2Name.addEventListener("input", (e) => {
		e.preventDefault();
		e.target.value !== ""
			? (player2 = e.target.value)
			: (player2 = "Player Two");
		if (player1 === player2) player2 === `${player1} II`;
	});

	// Functions
	// Adds an event listener to each players color button
	function colorButtonHandler() {
		Array.prototype.forEach.call(playersColorsButtons, (btn) => {
			btn.addEventListener("click", (e) => {
				let btnStyle = window.getComputedStyle(btn);
				let color = btnStyle.getPropertyValue("background-color");
				e.preventDefault();
				btn.classList.contains("cs1")
					? pickColor("cs1", color)
					: pickColor("cs2", color);
			});
		});
	}

	// Sets player color base don which color button selected
	function pickColor(type, color) {
		type === "cs1" ? (player1Color = color) : (player2Color = color);
		if (player1Color === player2Color) player2Color = "pink";
	}

	// Opens and closes the rules modal
	function toggleRulesModal() {
		rulesModal.classList.toggle("hide");
	}

	// Hides the player info modal
	function togglePlayerInfoModal() {
		playerModal.classList.add("hide");
	}

	// Opens and closes the end game modal
	function toggleEndGameModal() {
		endGameModal.classList.toggle("hide");
	}
	colorButtonHandler();
})();
