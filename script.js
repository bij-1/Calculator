// State properties tracking execution values
let previousOperand = '';
let currentOperand = '0';
let operation = undefined;
let isCalculated = false; // Flag to check if equation just finished

// DOM Element Selections
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');
const buttonsContainer = document.querySelector('.buttons');
const historyLogContainer = document.getElementById('history-log');
const clearHistoryBtn = document.getElementById('clear-history-btn');

function appendNumber(number) {
    if (number === '.' && currentOperand.includes('.')) return;
    
    // Clear out calculation results instantly if user clicks a new number instead of linking operations
    if (isCalculated) {
        currentOperand = '';
        isCalculated = false;
    }

    if (currentOperand === '0' && number !== '.') {
        currentOperand = number.toString();
    } else {
        currentOperand = currentOperand.toString() + number.toString();
    }
}

function chooseOperation(selectedOperation) {
    if (currentOperand === '') return;
    if (isCalculated) isCalculated = false;
    
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
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+': computation = prev + current; break;
        case '-': computation = prev - current; break;
        case '*': computation = prev * current; break;
        case '/': computation = current === 0 ? "Error" : prev / current; break;
        default: return;
    }
    
    // Push the calculation into history log if it is clean arithmetic
    if (computation !== "Error") {
        addHistoryLog(previousOperand, operation, currentOperand, computation);
    }
    
    currentOperand = computation.toString();
    operation = undefined;
    previousOperand = '';
    isCalculated = true; 
}

function deleteNumber() {
    if (currentOperand === '0' || currentOperand === "Error") return;
    if (isCalculated) isCalculated = false;
    
    currentOperand = currentOperand.toString().slice(0, -1);
    if (currentOperand === '') currentOperand = '0';
}

function clearDisplay() {
    previousOperand = '';
    currentOperand = '0';
    operation = undefined;
    isCalculated = false;
}

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

// --- HISTORY ACTIONS LOGIC ---
function addHistoryLog(prev, op, curr, result) {
    // Clear initial placeholder notice if present
    const placeholder = historyLogContainer.querySelector('.empty-history-msg');
    if (placeholder) placeholder.remove();

    const logItem = document.createElement('div');
    logItem.classList.add('history-item');
    
    const expressionText = `${prev} ${getDisplaySymbol(op)} ${curr} =`;
    
    logItem.innerHTML = `
        <div class="hist-expr">${expressionText}</div>
        <div class="hist-res">${result}</div>
    `;

    // Click event to reload this historic value back into the display memory!
    logItem.addEventListener('click', () => {
        currentOperand = result.toString();
        isCalculated = true; // Treats the re-loaded value like a calculated product
        updateDisplay();
    });

    // Insert new entries right at the top
    historyLogContainer.insertBefore(logItem, historyLogContainer.firstChild);
}

clearHistoryBtn.addEventListener('click', () => {
    historyLogContainer.innerHTML = '<p class="empty-history-msg">No logs logged yet.</p>';
});

// Global Delegation Listener capturing button clicks
buttonsContainer.addEventListener('click', (e) => {
    const target = e.target;
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