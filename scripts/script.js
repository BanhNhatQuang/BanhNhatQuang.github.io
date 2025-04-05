import { wordList } from './word-list.js';
const keyboardDiv = document.querySelector(".keyboard");
const guessesText = document.querySelector(".guesses-text b");
const wordDisplay = document.querySelector(".word-display");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");

let currentWord, correctLetters, WrongGuessedCount;
const maxWrongGuessed = 6;
const resetGame = () => {
    usedLetters.clear(); // Clear the set of used letters
    const buttons = document.querySelectorAll("button[data-key]");
    buttons.forEach(button => {
        button.disabled = false; // Re-enable all buttons
    });
    correctLetters = [];
    WrongGuessedCount = 0;
    guessesText.innerText = `${WrongGuessedCount} / ${maxWrongGuessed}`;
    hangmanImage.src = `images/hangman-${WrongGuessedCount}.svg`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);

    // Display word with spaces automatically revealed
    wordDisplay.innerHTML = currentWord.split("").map(letter => {
        if (letter === " ") {
            correctLetters.push(" "); // Add space to correct letters
            return `<li class="letter guessed"> </li>`; // Space is revealed
        } else {
            return `<li class="letter"></li>`; // Underscore for hidden letters
        }
    }).join("");
    
    gameModal.classList.remove("show");
};

const getRandomWord = () => {
    const {word, hint} = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    console.log(word);

    const hintContainer = document.querySelector(".hint-text");
    if (hint.startsWith("<img")) {
        hintContainer.innerHTML = hint;
    } else {
        hintContainer.innerText = hint;
    }
    resetGame();
};

const gameOver = (isVictory) => {
    setTimeout(()=>{
        const modalText = isVictory?`You found the word: `:`the correct word was: `;
        gameModal.querySelector("img").src =  `images/${isVictory?'victory':'lost'}.gif`;
        gameModal.querySelector("h4").innerText =  `${isVictory?'Congrats!':'Game Over!'}`;
        gameModal.querySelector("p").innerHTML =  `${modalText} <b>${currentWord}</b>`;
        gameModal.classList.add("show");
    }, 300)
}

const initGame = (button, clickedLetter) => {
    if(currentWord.includes(clickedLetter)){
        // console.log(clickedLetter, " is in the word");
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter){
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        })
    }else{
        // console.log(clickedLetter, " is not in the word");
        WrongGuessedCount++;
        hangmanImage.src = `images/hangman-${WrongGuessedCount}.svg`;
    }
    button.disabled = true;
    guessesText.innerText = `${WrongGuessedCount} / ${maxWrongGuessed}`;

    if(WrongGuessedCount === maxWrongGuessed) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}

// for (let i = 97; i <= 122; i++) {
//     const button = document.createElement("button");
//     button.innerText = String.fromCharCode(i);
//     keyboardDiv.appendChild(button);
//     button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)));
// }

const usedLetters = new Set(); // Track letters that have been used

document.addEventListener("keydown", event => {
    const key = event.key.toLowerCase();
    if (key >= 'a' && key <= 'z' && !usedLetters.has(key)) { // Check if valid and not used
        const button = document.querySelector(`button[data-key="${key}"]`);
        if (button) {
            initGame(button, key);
            button.classList.add("active");
            setTimeout(() => button.classList.remove("active"), 200);
        }
        usedLetters.add(key); // Mark the letter as used
    }
});

// Dynamically generate buttons
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    const letter = String.fromCharCode(i);
    button.innerText = letter;
    button.setAttribute("data-key", letter);
    button.disabled = false; // Ensure buttons start enabled
    keyboardDiv.appendChild(button);

    // Handle clicks on buttons
    button.addEventListener("click", () => {
        if (!usedLetters.has(letter)) { // Check if the letter is not yet used
            initGame(button, letter);
            button.classList.add("active");
            setTimeout(() => button.classList.remove("active"), 200);
            usedLetters.add(letter); // Mark the letter as used
            button.disabled = true; // Disable the button after use
        }
    });
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord)