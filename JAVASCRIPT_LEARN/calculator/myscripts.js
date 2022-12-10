const button = document.querySelectorAll(".button-cell");

const displayValue = document.querySelector(".display");

let equationAccumulator = 0;

let previousEquationOperator;

let bufferDisplayValue = "0";


function handleNumbers(num) {
    if (bufferDisplayValue === "0") {
        bufferDisplayValue = num;
    } else {
        bufferDisplayValue += num;
    }
}

function handleSymbols(symbol) {
    if (symbol == "C") {
        bufferDisplayValue = "0";
        equationAccumulator = 0;
        previousEquationOperator = null;
    } else if (symbol == "←") {
        backspaceOperation();
    } else if (symbol == "=") {
        if (previousEquationOperator === null) {
            return;
        }
        executeOperation(parseInt(bufferDisplayValue));
        bufferDisplayValue = equationAccumulator;
        equationAccumulator = 0;
        previousEquationOperator = null;
    } else {
        handleMath(symbol);
    }
}

function handleMath(symbol) {
    if (equationAccumulator === 0) {
        //First time hitting a math symbol
        equationAccumulator = parseInt(bufferDisplayValue);
    } else {
        executeOperation(parseInt(bufferDisplayValue));
    }
    previousEquationOperator = symbol;
    bufferDisplayValue = "0";
}

function executeOperation(secondValue) {
    if (previousEquationOperator === "+") {
        equationAccumulator += secondValue;
    } else if (previousEquationOperator === "÷") {
        equationAccumulator /= secondValue;
    } else if (previousEquationOperator === "×") {
        equationAccumulator *= secondValue;
    } else if (previousEquationOperator === "-") {
        equationAccumulator -= secondValue;
    }
 
}



function backspaceOperation() {
    if (bufferDisplayValue.length == 1) {
        bufferDisplayValue = "0";
    }
    bufferDisplayValue = bufferDisplayValue.substring(0, bufferDisplayValue.length - 1);
}

function updateDisplay() {
    displayValue.innerHTML = bufferDisplayValue;
}

function buttonClicked(value) {
    if (isNaN(value)) {
        handleSymbols(value);
    } else {
        handleNumbers(value);
    }
    updateDisplay();
}

button.forEach(element => {
    element.addEventListener("click", function() {
        buttonClicked(element.innerHTML);
    });
});
