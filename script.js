// PLAYER FACTORY
function Player(name, marker){

    return {
        name,
        marker
    };

}



// GAMEBOARD MODULE
const Gameboard = (() => {

    const board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const placeMark = (index, marker) => {

        if(board[index] !== ""){
            return false;
        }

        board[index] = marker;

        return true;
    };

    const resetBoard = () => {

        for(let i = 0; i < board.length; i++){

            board[i] = "";

        }

    };

    return {

        getBoard,
        placeMark,
        resetBoard

    };

})();




// GAME CONTROLLER MODULE
const GameController = (() => {

    let player1 = Player("Player 1", "X");
    let player2 = Player("Player 2", "O");

    let currentPlayer = player1;

    let gameOver = false;


    const winningCombinations = [

        [0,1,2],
        [3,4,5],
        [6,7,8],

        [0,3,6],
        [1,4,7],
        [2,5,8],

        [0,4,8],
        [2,4,6]

    ];



    const startGame = () => {

        const p1Name =
            document.getElementById("player1").value || "Player 1";

        const p2Name =
            document.getElementById("player2").value || "Player 2";


        player1 = Player(p1Name, "X");
        player2 = Player(p2Name, "O");

        currentPlayer = player1;

        updateInfo(
            `${currentPlayer.name}'s Turn (${currentPlayer.marker})`
        );

    };



    const switchTurn = () => {

        currentPlayer =
            currentPlayer === player1 ? player2 : player1;

    };



    const checkWinner = () => {

        const board = Gameboard.getBoard();

        return winningCombinations.some(combo => {

            const [a, b, c] = combo;

            return (

                board[a] &&
                board[a] === board[b] &&
                board[a] === board[c]

            );

        });

    };



    const checkTie = () => {

        return Gameboard
            .getBoard()
            .every(cell => cell !== "");

    };



    const playRound = (index) => {

        if(gameOver){
            return;
        }


        const success =
            Gameboard.placeMark(index, currentPlayer.marker);

        if(!success){
            return;
        }


        DisplayController.render();


        if(checkWinner()){

            updateInfo(`${currentPlayer.name} Wins!`);

            gameOver = true;

            return;
        }


        if(checkTie()){

            updateInfo("It's a Tie!");

            gameOver = true;

            return;
        }


        switchTurn();

        updateInfo(
            `${currentPlayer.name}'s Turn (${currentPlayer.marker})`
        );

    };



    const restartGame = () => {

        Gameboard.resetBoard();

        gameOver = false;

        startGame();

        DisplayController.render();

    };



    const updateInfo = (message) => {

        document.getElementById("info").textContent = message;

    };



    return {

        playRound,
        restartGame,
        startGame

    };

})();




// DISPLAY CONTROLLER MODULE
const DisplayController = (() => {

    const cells =
        document.querySelectorAll(".cell");



    const render = () => {

        const board = Gameboard.getBoard();

        cells.forEach((cell, index) => {

            cell.textContent = board[index];

        });

    };



    cells.forEach(cell => {

        cell.addEventListener("click", () => {

            const index =
                cell.getAttribute("data-index");

            GameController.playRound(index);

        });

    });



    return {
        render
    };

})();




// RESTART BUTTON
document
    .getElementById("restartBtn")
    .addEventListener("click", () => {

        GameController.restartGame();

    });




// START GAME
GameController.startGame();