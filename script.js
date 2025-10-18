let display = document.getElementById('result');
let expressionDisplay = document.getElementById('expression');
let currentExpression = '';
let isAdvancedMode = false;
let calculationHistory = [];

const historyList = document.getElementById('history-list');

function updateDisplay() {
    expressionDisplay.value = currentExpression;
    if (currentExpression === '') {
        display.value = '0';
    } else {
        display.value = ''; // Clear result display until a calculation is made
    }
}

function appendValue(value) {
    if (display.value === 'Error' || (display.value !== '0' && currentExpression === '')) {
        clearDisplay();
    }

    const lastChar = currentExpression.slice(-1);

    // Prevent multiple decimal points in a single number
    if (value === '.' && (lastChar === '.' || currentExpression === '' || /[+\-*/%^]/.test(lastChar))) {
        return;
    }

    // Prevent multiple operators or operators at the beginning (except for minus for negative numbers)
    if (/[+\-*/]/.test(value) && /[+\-*/]/.test(lastChar)) {
        // Replace last operator with new one
        currentExpression = currentExpression.slice(0, -1);
    } else if (/[+\/*]/.test(value) && currentExpression === '') {
        return; // Don't start with * or /
    }

    currentExpression += value;
    updateDisplay();
}

function clearDisplay() {
    currentExpression = '';
    display.value = '0';
    expressionDisplay.value = '';
}

function backspace() {
    currentExpression = currentExpression.slice(0, -1);
    updateDisplay();
    if (currentExpression === '') {
        display.value = '0';
        expressionDisplay.value = '';
    }
}

function calculateResult() {
    try {
        // Check for balanced parentheses
        let openParentheses = (currentExpression.match(/\(/g) || []).length;
        let closeParentheses = (currentExpression.match(/\)/g) || []).length;

        if (openParentheses !== closeParentheses) {
            throw new Error("Unbalanced parentheses");
        }

        let formattedExpression = currentExpression.replace(/Math.pow\(([^,]+),([^)]+)\)/g, '($1)**($2)');
        // Replace Math.PI with its numerical value
        formattedExpression = formattedExpression.replace(/Math.PI/g, Math.PI);

        let result = eval(formattedExpression);
        display.value = result;
        calculationHistory.push(`${currentExpression} = ${result}`);
        renderHistory();
        currentExpression = result.toString(); // Set currentExpression to result for chaining operations
        expressionDisplay.value = currentExpression; // Also show the result in the expression display
    } catch (error) {
        display.value = 'Error';
        currentExpression = '';
        expressionDisplay.value = '';
    }
}

function toggleMode() {
    isAdvancedMode = !isAdvancedMode;
    const advancedButtons = document.querySelector('.advanced-buttons');
    const modeSwitchButton = document.querySelector('.mode-switch');
    if (isAdvancedMode) {
        advancedButtons.classList.remove('hidden');
        modeSwitchButton.textContent = 'Simple Mode';
    } else {
        advancedButtons.classList.add('hidden');
        modeSwitchButton.textContent = 'Adv. Mode';
    }
}

function renderHistory() {
    historyList.innerHTML = '';
    calculationHistory.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        historyList.appendChild(listItem);
    });
}

function clearHistory() {
    calculationHistory = [];
    renderHistory();
}
