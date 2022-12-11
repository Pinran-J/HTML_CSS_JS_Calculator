const WORD_LENGTH = 5;
const NUMBER_OF_TRIES = 6;
const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
const POST_URL = "https://words.dev-apis.com/validate-word";
const GAMEPLAY_LETTERS = document.querySelectorAll(".gameplay-letter");
const SPINNER_DIV = document.querySelector(".loading-logo");


async function init() {
    //Variable declarations
    let isLoading = true;
    let isDone = false;

    //State of game
    let currentRow = 0;
    let currentGuess = "";

    const promise = await fetch(WORD_URL);
    const processedPromise = await promise.json();
    const WORD_OF_THE_DAY = processedPromise.word.toUpperCase();
    const WORD_OF_THE_DAY_PARTS = WORD_OF_THE_DAY.split("");

    isLoading = false;
    checkIfLoading(isLoading);


    function addLetter(letter) {
        if (currentGuess.length < WORD_LENGTH) {
            currentGuess += letter;
        } else {
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
        }

        GAMEPLAY_LETTERS[currentRow * WORD_LENGTH + currentGuess.length - 1].innerHTML = letter;
    }

    function backspaceOperation() {
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        GAMEPLAY_LETTERS[currentRow * WORD_LENGTH + currentGuess.length].innerHTML = "";

    }

    async function enterOperation() {
        if (WORD_LENGTH !== currentGuess.length) {
            return;
        }

        //Check using post api to see if valid word.
        isLoading = true;
        checkIfLoading(isLoading);

        const postPromise = await fetch(POST_URL, {
            method: "POST",
            body: JSON.stringify({ "word" : currentGuess})
        });

        const processedPostPromise = await postPromise.json()
        const isValidWord = processedPostPromise.validWord;

        isLoading = false;
        checkIfLoading(isLoading);

        if (!isValidWord) {
            markInvalidWord();
            return;
        }

        const currentGuessParts = currentGuess.split("");
        const mappedCorrectWordParts = makeMap(WORD_OF_THE_DAY_PARTS);
        let allCorrect = true;

        //Checking correct alphabet and correct spot
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (currentGuessParts[i] === WORD_OF_THE_DAY_PARTS[i]) {
                GAMEPLAY_LETTERS[currentRow * WORD_LENGTH + i].classList.add("correct");
                //Update mapped parts since one cell has been marked as correct
                mappedCorrectWordParts[currentGuessParts[i]]--;
            }
        }

        //Checking correct alphabet, wrong spot and wrong alphabets
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (currentGuessParts[i] === WORD_OF_THE_DAY_PARTS[i]) {
                //Do nothing, already handled.
            } else if (mappedCorrectWordParts[currentGuessParts[i]] &&  mappedCorrectWordParts[currentGuessParts[i]] > 0) {
                //Mark as half-correct
                GAMEPLAY_LETTERS[currentRow * WORD_LENGTH + i].classList.add("half-correct");
                allCorrect = false;
                mappedCorrectWordParts[currentGuessParts[i]]--;
            } else {
                //Mark as wrong alphabet
                GAMEPLAY_LETTERS[currentRow * WORD_LENGTH + i].classList.add("wrong");
                allCorrect = false;
            }
        }
        currentRow++;
        currentGuess = "";

        //Check if game has ended or not.
        if (allCorrect) {
            alert("you win!");
            document.querySelector(".brand").classList.add("winner");
            isDone = true;
        } else if (!allCorrect && currentRow === NUMBER_OF_TRIES) {
            alert(`you lost!, the word was ${WORD_OF_THE_DAY}`);
            isDone = true;
        }




    }

    //Taken from course example, only cosmetic, can use alert etc.
    function markInvalidWord() {
        for (let i = 0; i < WORD_LENGTH; i++) {
          GAMEPLAY_LETTERS[currentRow * WORD_LENGTH + i].classList.remove("invalid");
    
          // long enough for the browser to repaint without the "invalid class" so we can then add it again
          setTimeout(
            () => GAMEPLAY_LETTERS[currentRow * WORD_LENGTH + i].classList.add("invalid"),
            10
          );
        }
    }



    document.addEventListener("keydown", function handleKeyPress(event) {
        if (isLoading || isDone) {
            return;
        }
        const key = event.key;
    
        if (key === "Backspace") {
            backspaceOperation();
    
        } else if (key === "Enter") {
            enterOperation();
    
        } else if (isLetter(key)) {
            addLetter(key.toUpperCase());
    
        }  else {
            return;
        }
    
    });


}

function checkIfLoading(isLoading) {
    SPINNER_DIV.classList.toggle("hidden", !isLoading);
}

// takes an array of letters (like ['E', 'L', 'I', 'T', 'E']) and creates
// an object out of it (like {E: 2, L: 1, T: 1}) so we can use that to
// make sure we get the correct amount of letters marked close instead
// of just wrong or correct
// ---------------------
// Taken from example
function makeMap(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
      if (obj[array[i]]) {
        obj[array[i]]++;
      } else {
        obj[array[i]] = 1;
      }
    }
    return obj;
  }


function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

init();