const MAXDIGITS = 16;
let currentInput = '';
let previousInput = '';
let display = document.querySelector('.display');
let operator = null;
let resultDisplayed = false;
let operationDisplay = '';
let operators = document.querySelectorAll('.operator:not(.equal, .clear)');
let equals = document.querySelector('.equal');
let clear = document.querySelector('.clear');
let clearr = document.querySelector('.clearr');
let dotButton = document.querySelector('.dot');
let zeroButton = document.querySelector('.zero');
let powerButton = document.querySelector('.power');
let percentButton = document.querySelector('.percent');
display.textContent = '0'; 



function adjustFontSize() {
    if (display.textContent.length > 17) {
        display.style.fontSize = '1.2rem';
    } else {
        display.style.fontSize = '2rem';
    }
}



let numbers = document.querySelectorAll('.number');

document.addEventListener("keydown", function(event) {
    const key = event.key;

    if (!isNaN(key)) {
        // Numbers (0–9)
        if (resultDisplayed) {
            currentInput = '';
            operationDisplay = '';
            resultDisplayed = false;
        }
        if (currentInput.replace('.', '').length < MAXDIGITS) {
            currentInput += key;
            operationDisplay += key;
        }
        display.textContent = operationDisplay;
        adjustFontSize();
    } else if (["+", "-", "*", "x", "/"].includes(key)) {
        // Operators (* or x both treated as multiply)
        let op = key === "*" ? "x" : key;

        if (!currentInput && previousInput) {
            operationDisplay = operationDisplay.slice(0, -1) + op;
            operator = op;
            display.textContent = operationDisplay;
            adjustFontSize();
            return;
        }

        if (previousInput) {
            currentInput = operate(previousInput, currentInput, operator);
            previousInput = currentInput;
        } else {
            previousInput = currentInput;
        }

        operator = op;
        operationDisplay += op;
        currentInput = '';
        display.textContent = operationDisplay;
        adjustFontSize();
    } else if (key === "Enter" || key === "=") {
        // Equals
        if (!previousInput || !currentInput || !operator) return;
        currentInput = operate(previousInput, currentInput, operator);
        display.textContent = currentInput;
        operationDisplay = currentInput;
        previousInput = '';
        operator = null;
        resultDisplayed = true;
        adjustFontSize();
    } else if (key === "Backspace") {
        // Delete last
        operationDisplay = operationDisplay.slice(0, -1);
        if (currentInput) {
            currentInput = currentInput.slice(0, -1);
        } else if (operator) {
            operator = null;
        } else if (previousInput) {
            previousInput = previousInput.slice(0, -1);
        }
        display.textContent = operationDisplay || '0';
        adjustFontSize();
    } else if (key.toLowerCase() === "c" || key === "Escape") {
        // Clear
        currentInput = '';
        previousInput = '';
        operator = null;
        operationDisplay = '';
        resultDisplayed = false;
        display.textContent = '0';
        adjustFontSize();
    } else if (key === ".") {
        // Decimal
        if (resultDisplayed) {
            currentInput = '0.';
            operationDisplay = '0.';
            resultDisplayed = false;
        } else if (!currentInput.includes('.') && currentInput.replace('.', '').length < MAXDIGITS) {
            currentInput = currentInput === '' ? '0.' : currentInput + '.';
            operationDisplay += '.';
        }
        display.textContent = operationDisplay;
        adjustFontSize();
    }
});



powerButton.addEventListener('click', () => {
    if (currentInput) {
        currentInput = (parseFloat(currentInput) ** 2).toFixed(20).toString();
        operationDisplay = currentInput;
        display.textContent = currentInput;
        resultDisplayed = true;
        adjustFontSize();
    }
});

percentButton.addEventListener('click', () => {
    if (!currentInput) return; // nothing to do if no number entered

    let num = parseFloat(currentInput);

    if (previousInput && operator) {
        let prev = parseFloat(previousInput).toFixed(10);
        if (operator === '+' || operator === '-') {
            // % of previousInput
            num = (prev * num) / 100;
        } else if (operator === 'x' || operator === '/') {
            // just divide by 100 for multiplication/division
            num = num / 100;
        }
    } else {
        // no previous number, standalone %
        num = num / 100;

    }

    currentInput = num.toFixed(20).toString();
    operationDisplay = operationDisplay.slice(0, -currentInput.length) + currentInput;
    display.textContent = operationDisplay;
    resultDisplayed = true;
    adjustFontSize();
});




function operate(num1, num2, operator) {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    let result;

    switch (operator) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case 'x':
            result = num1 * num2;
            break;
        case '/':
            if (num2 === 0) return 'Error';
            result = num1 / num2;
            break;
        default:
            result = num2;
    }

    // Limit to 10 decimal places and remove unnecessary trailing zeros
    return parseFloat(result.toFixed(20)).toString();
    
}




numbers.forEach(button => {
    button.addEventListener('click', () => {
        if (resultDisplayed) {
            currentInput = '';
            operationDisplay = '';
            resultDisplayed = false;
        }

        // Only append if length is below limit
        if (currentInput.replace('.', '').length < MAXDIGITS) {
            currentInput += button.textContent;
            operationDisplay += button.textContent;
        }

        display.textContent = operationDisplay; // update display
        adjustFontSize();
    });
});

zeroButton.addEventListener('click', () => {
    if (resultDisplayed) {
        currentInput = '0';
        operationDisplay = '0';
        resultDisplayed = false;
    } else if (currentInput === '') {
        currentInput = '0';
        operationDisplay += '0';
    } else if (currentInput === '0' && !currentInput.includes('.')) {
        return;
    } else if (currentInput.replace('.', '').length < MAXDIGITS) {
        currentInput += '0';
        operationDisplay += '0';
    }

    display.textContent = operationDisplay;
    adjustFontSize();
});


dotButton.addEventListener('click', () => {
    if (resultDisplayed) {
        currentInput = '0.';
        resultDisplayed = false;
    } else if (!currentInput.includes('.') && currentInput.replace('.', '').length < MAXDIGITS) {
        currentInput = currentInput === '' ? '0.' : currentInput + '.';
        operationDisplay += '.';
    }

    display.textContent = operationDisplay;
    adjustFontSize();
});

operators.forEach(button => {
    button.addEventListener('click', () => {
        if (!currentInput && previousInput) {
            // Replace the last operator
            operationDisplay = operationDisplay.slice(0, -1) + button.textContent;
            operator = button.textContent;
            display.textContent = operationDisplay;
            adjustFontSize();
            return;
        }

        if (previousInput) {
            currentInput = operate(previousInput, currentInput, operator);
            previousInput = currentInput;
            
        } else {
            previousInput = currentInput;
        }

        operator = button.textContent;
        operationDisplay += button.textContent; // add operator to display
        currentInput = '';
        display.textContent = operationDisplay;
        adjustFontSize();
    });
});


equals.addEventListener('click', () => {
    if (!previousInput || !currentInput || !operator) return;
    currentInput = operate(previousInput, currentInput, operator);
   display.textContent = currentInput; // show result
operationDisplay = currentInput;    // reset operation display
previousInput = '';
operator = null;
    resultDisplayed = true;
    adjustFontSize();
});

clearr.addEventListener('click', () => {
    operationDisplay = operationDisplay.slice(0, -1);
    if (currentInput) {
        currentInput = currentInput.slice(0, -1);
    } else if (operator) {
        operator = null;
    } else if (previousInput) {
        previousInput = previousInput.slice(0, -1);
    }
    if (operationDisplay === '') {
        display.textContent = '0';
    } else {
        display.textContent = operationDisplay;
    }

    

    

})



clear.addEventListener('click', () => {
    currentInput = '';
    previousInput = '';
    operator = null;
    operationDisplay = '';
    resultDisplayed = false;
    display.textContent = '0';
})




