'use strict';

function guestMyNumber(){
    const GameStatusType = {
        RESET: 'RESET',
        ONGOING: 'ONGOING',
        GAMEOVER: 'GAMEOVER'
    }
    const GameOverType = {
        WIN: "WIN",
        LOSE: "LOSE",
    }
    const GuessType = {
        CORRECT: "CORRECT",
        TOO_LOW: "TOO_LOW",
        TOO_HIGH: "TOO_HIGH",
    }
    const STEP_MAX = 10;

    const debugDisabled = true;
    let gameStatus = GameStatusType.RESET;
    let gameOverStatus;
    let guessEvaluation;
    let step = 0;
    let highscore = 0;
    let prevHighscore = 0;
    let preHighscore = 0;
    let score = 0;
    let prevScore = 0;
    let guessNumber = undefined;
    let prevGuessNumber = undefined;
    let secretNumber = undefined;
    let message = "";
    let prevMessage = "";
    let btnCheckDisabled = false;
    let prevBtnCheckDisabled = false;
    let guessNumberDisabled = false;
    let prevGuessNumberDisabled = false;
    let isGameOver = false;
    
    const elMessage = document.querySelector(".message");
    const elGuessNumer = document.querySelector("input.guess");
    const elScore = document.querySelector(".score");
    const elHighscore = document.querySelector(".highscore");
    const btnCheck = document.querySelector("button.check");
    const btnReset = document.querySelector("button.again");

    function updateUI(){
        if (message !== prevMessage){
            elMessage.textContent = message;
            prevMessage = message;
        }
        if (score !== prevScore) {
            elScore.textContent = score;
            prevScore = score;
        }
        if (highscore !== prevHighscore) {
            elHighscore.textContent = highscore;
            prevHighscore = highscore;
        }
        if (btnCheckDisabled !== prevBtnCheckDisabled){
            btnCheck.disabled = btnCheckDisabled;
            prevBtnCheckDisabled = btnCheckDisabled;
        }
        if (guessNumberDisabled !== prevGuessNumberDisabled){
            elGuessNumer.disabled = guessNumberDisabled;
            prevGuessNumberDisabled = guessNumberDisabled;
        }
        if (guessNumber !== prevGuessNumber) {
            elGuessNumer.value = guessNumber;
            prevGuessNumber = guessNumber;
        }
    }

    function reset(){
        gameStatus = GameStatusType.RESET;
        gameOverStatus = null;
        guessEvaluation = null;
        guessNumberDisabled = false;
        btnCheckDisabled = false;

        secretNumber = Math.floor(Math.random() * 100);
        guessNumber = "";
        score= 0;
        step = 0;
        doThinking();
    }

    function debug(){
        if (debugDisabled){
            return;
        }
        console.log("Game Status / Over :",gameStatus, gameOverStatus);
        console.log("Guess Number / Secret Number (Evaluation) ",guessNumber, secretNumber, guessEvaluation);
        console.log("Score / Highscore ",score, highscore);
        console.log("Step / Step MAX",step, STEP_MAX);
    }

    function calculateScore(){
        score = (STEP_MAX - step + 1) * 100;
        if (highscore < score){
            highscore = score;
        }
    }

    function updateGameControls() {
        const isGameOver = gameStatus == GameStatusType.GAMEOVER;

        guessNumberDisabled = isGameOver;
        btnCheckDisabled = isGameOver;
    }

    function updateGameMessage(){
        if (gameStatus == GameStatusType.RESET){
            message = "I am thinking of a number between 1 and 100.";
            return;
        }

        if (gameStatus == GameStatusType.GAMEOVER){
            message = gameOverStatus == GameOverType.WIN ? "Congratulation! You win" : "Game over! You lose";
            return;
        }

        if (gameStatus == GameStatusType.ONGOING) {
            message = guessEvaluation == GuessType.TOO_HIGH ? `${guessNumber} is too high` : `${guessNumber} is too low`;
        }
    }

    function checkGameOver(){
        if (guessNumber == secretNumber){
            gameStatus = GameStatusType.GAMEOVER;
            gameOverStatus = GameOverType.WIN;
            return;
        } 
        
        if (step == STEP_MAX){
            gameStatus = GameStatusType.GAMEOVER;
            gameOverStatus = GameOverType.LOSE;
            return;
        }
        
        gameStatus = GameStatusType.ONGOING;
    }

    function processPlayerInput(){
        guessNumber = elGuessNumer.value;
        step++;
        gameStatus == GameStatusType.ONGOING;
    }

    function processGameRule(){
        guessEvaluation = guessNumber > secretNumber ? GuessType.TOO_HIGH : GuessType.TOO_LOW;
    }

    function doThinking(){
        if (gameStatus != GameStatusType.RESET){
            message = "Thinking";
            checkGameOver();
            if (gameStatus == GameStatusType.ONGOING){
                processGameRule();
            } else if (gameStatus == GameStatusType.GAMEOVER){
                calculateScore();
            }
        }
        updateGameControls();
        updateGameMessage();
        updateUI();
    }

    function onPlayerInput(){
        if (gameStatus == GameStatusType.RESET){
            gameStatus = GameStatusType.ONGOING;
        }
        processPlayerInput();
        doThinking(); 
        debug();
    }

    btnCheck.addEventListener('click', (event) => {
        onPlayerInput();   
    })

    btnReset.addEventListener('click', (event) => {
        reset();
        elGuessNumer.focus();
    })

    elGuessNumer.addEventListener("keyup", (event) => {
        if (event.key == "Enter"){
            onPlayerInput();
            event.target.select();
        }
    })

    reset();
}

guestMyNumber();