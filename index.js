// State properties tracking state execution values
let previousOperand = '';
let currentOperand = '0';
let operation = undefined;

// DOM Element Selections
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');
const buttonsContainer = document.querySelector('.buttons');

// Process mathematical instructions
function appendNumber(number) {
    // Block multiple dot characters
    if (number === '.' && currentOperand.includes('.')) return;
    
    // Replace default zero instead of stacking strings (e.g., avoid "05")
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number.toString();
    } else {
        currentOperand = currentOperand.toString() + number.toString();
    }
}

function chooseOperation(selectedOperation) {
    if (currentOperand === '') return;
    
    // Compute calculation immediately if an operation loop is already pending
    if (previousOperand !== '') {
        compute();
    }
    
    operation = selectedOperation;
    previousOperand = currentOperand;
    currentOperand = '';
}

function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    // Prevent execution running with incomplete values
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            // Handle division by zero edge case safely
            computation = current === 0 ? "Error" : prev / current;
            break;
        default:
            return;
    }
    
    currentOperand = computation.toString();
    operation = undefined;
    previousOperand = '';
}

function deleteNumber() {
    if (currentOperand === '0' || currentOperand === 'Error') return;
    
    currentOperand = currentOperand.toString().slice(0, -1);
    if (currentOperand === '') currentOperand = '0';
}

function clearDisplay() {
    previousOperand = '';
    currentOperand = '0';
    operation = undefined;
}

// Convert symbol properties to standard clean strings for visual layout matching
function getDisplaySymbol(op) {
    if (op === '*') return '×';
    if (op === '/') return '÷';
    return op;
}

function updateDisplay() {
    currentOperandTextElement.innerText = currentOperand;
    
    if (operation != null) {
        previousOperandTextElement.innerText = `${previousOperand} ${getDisplaySymbol(operation)}`;
    } else {
        previousOperandTextElement.innerText = previousOperand;
    }
}

// Global Delegation Listener capturing button clicks
buttonsContainer.addEventListener('click', (e) => {
    const target = e.target;
    
    // Exit if background container tracks clicks between grid slots
    if (!target.classList.contains('btn')) return;

    if (target.hasAttribute('data-number')) {
        appendNumber(target.getAttribute('data-number'));
    } else if (target.hasAttribute('data-operator')) {
        chooseOperation(target.getAttribute('data-operator'));
    } else {
        const action = target.getAttribute('data-action');
        if (action === 'clear') clearDisplay();
        if (action === 'delete') deleteNumber();
        if (action === 'equals') compute();
    }

    updateDisplay();
});