const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('length');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateEl = document.getElementById('generate');
const clipboardEl = document.getElementById('clipboard');

// Ensure length input doesn't exceed 40
lengthEl.setAttribute('max', 40);

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

clipboardEl.addEventListener('click', () => {
    const textarea = document.createElement('textarea');
    const password = resultEl.innerText;

    if (!password) return;

    textarea.value = password;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    alert('Password copied to clipboard!');
});

generateEl.addEventListener('click', () => {
    let length = +lengthEl.value;

    if (length < 8) {
        alert('Password length must be at least 8 characters.');
        resultEl.innerText = '';
        return;
    }

    if (length > 40) {
        alert('Password length cannot exceed 40 characters.');
        length = 40;
        lengthEl.value = 40;
    }

    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;

    resultEl.innerText = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
});

function generatePassword(lower, upper, number, symbol, length) {
    let generatedPassword = '';
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0]);

    if (typesCount === 0) {
        return '';
    }

    for (let i = 0; i < length; i += typesCount) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += randomFunc[funcName]();
        });
    }

    generatedPassword = generatedPassword.slice(0, length);

    // Ensure password has at least one of each selected type
    if (lower && !/[a-z]/.test(generatedPassword)) generatedPassword += getRandomLower();
    if (upper && !/[A-Z]/.test(generatedPassword)) generatedPassword += getRandomUpper();
    if (number && !/[0-9]/.test(generatedPassword)) generatedPassword += getRandomNumber();
    if (symbol && !/[!@#$%^&*(){}[\]=<>/,.]/.test(generatedPassword)) generatedPassword += getRandomSymbol();

    // Shuffle the password for randomness
    return shufflePassword(generatedPassword).slice(0, length);
}

function getRandomLower() {
    return String.fromCharCode(crypto.getRandomValues(new Uint8Array(1))[0] % 26 + 97);
}

function getRandomUpper() {
    return String.fromCharCode(crypto.getRandomValues(new Uint8Array(1))[0] % 26 + 65);
}

function getRandomNumber() {
    return String.fromCharCode(crypto.getRandomValues(new Uint8Array(1))[0] % 10 + 48);
}

function getRandomSymbol() {
    const symbols = '!@#$%^&*(){}[]=<>/,.~`|:;_+-';
    return symbols[Math.floor(crypto.getRandomValues(new Uint8Array(1))[0] % symbols.length)];
}

function shufflePassword(password) {
    return password.split('').sort(() => 0.5 - Math.random()).join('');
}
