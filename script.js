// Päivittää merkkilaskurin
function updateCharCount() {
    var code = document.getElementById('codeInput').value;
    var charCount = code.length;
    var maxLength = 2000;
    var charCountDisplay = document.getElementById('charCount');

    charCountDisplay.textContent = 'Merkkimäärä: ' + charCount + '/' + maxLength;
    charCountDisplay.style.color = charCount > maxLength ? 'red' : 'black';
}

// Tarkistaa, sisältääkö koodi ES6-syntaksia
function isES6(code) {
    var es6Patterns = [
        /\blet\b/, /\bconst\b/, /\([^\)]*\)\s*=>/, /\bclass\b/, /\bimport\b/, /\bexport\b/
    ];
    return es6Patterns.some(pattern => pattern.test(code));
}

// Tarkistaa, onko koodi HTML:ää
function isHTMLCode(code) {
    return /<\s*([a-z]+)(?:\s+[^>]*)?>/i.test(code);
}

// Tarkistaa, onko koodi JavaScriptiä
function isJSCode(code) {
    return /function|var|let|const|return|if|else|for|while|=>|class/.test(code);
}

// Tarkistaa käyttäjän syöttämän koodin
function checkCode() {
    var code = document.getElementById('codeInput').value.trim();
    var resultDiv = document.getElementById('result');
    var codeType = document.getElementById('codeType').value;

    // Jos koodi on tyhjä
    if (code === "") {
        resultDiv.textContent = 'Syötä koodi ennen tarkistusta.';
        resultDiv.style.color = 'red';
        return;
    }

    // Jos koodi on liian pitkä
    if (code.length > 2000) {
        resultDiv.textContent = 'Koodin pituus ylittää sallitun rajan!';
        resultDiv.style.color = 'red';
        return;
    }

    // Varmistetaan, että HTML valinnalla voi tarkistaa HTML:ää
    if (codeType === 'html' && !isHTMLCode(code)) {
        resultDiv.textContent = 'Syöttämäsi koodi ei vaikuta olevan HTML:ää.';
        resultDiv.style.color = 'red';
        return;
    }

    // Varmistetaan, että JavaScript valinnalla voi tarkistaa JavaScriptiä
    if (codeType === 'javascript' && !isJSCode(code)) {
        resultDiv.textContent = 'Syöttämäsi koodi ei vaikuta olevan JavaScriptiä.';
        resultDiv.style.color = 'red';
        return;
    }

    // Estetään ES6-koodi
    if (codeType === 'javascript' && isES6(code)) {
        resultDiv.textContent = '⚠️ Et voi tarkistaa ES6-koodia. Käytä vain ES5-syntaksia!';
        resultDiv.style.color = 'red';
        return;
    }

    // Tarkistetaan HTML-koodi
    if (codeType === 'html') {
        checkHTML(code);
    }
    // Tarkistetaan JavaScript-koodi
    else if (codeType === 'javascript') {
        checkJS(code);
    }
}

// HTML-koodin tarkistus
function checkHTML(code) {
    var resultDiv = document.getElementById('result');

    // Tarkistetaan, että HTMLHint on käytettävissä
    if (typeof HTMLHint === 'undefined') {
        resultDiv.textContent = 'Virhe: HTMLHint ei ole ladattu.';
        resultDiv.style.color = 'red';
        return;
    }

    var htmlHintResults = HTMLHint.verify(code);

    if (htmlHintResults.length === 0) {
        resultDiv.textContent = 'HTML-koodi on validia!';
        resultDiv.style.color = 'green';
    } else {
        resultDiv.innerHTML = 'Virheitä löytyi HTML-koodista:<br>';
        htmlHintResults.forEach(error => {
            resultDiv.innerHTML += `Rivi ${error.line}: ${error.message}<br>`;
        });
        resultDiv.style.color = 'red';
    }
}

// JavaScript-koodin tarkistus
function checkJS(code) {
    var resultDiv = document.getElementById('result');

    // Tarkistetaan, että JSHint on käytettävissä
    if (typeof JSHINT === 'undefined') {
        resultDiv.textContent = 'Virhe: JSHint ei ole ladattu.';
        resultDiv.style.color = 'red';
        return;
    }

    var options = { esversion: 5 };
    var isValid = JSHINT(code, options);

    if (isValid) {
        resultDiv.textContent = 'JavaScript-koodi on virheetöntä!';
        resultDiv.style.color = 'green';
    } else {
        resultDiv.innerHTML = 'Virheitä löytyi JavaScript-koodista:<br>';
        JSHINT.errors.forEach(error => {
            resultDiv.innerHTML += `Rivi ${error.line}: ${error.reason}<br>`;
        });
        resultDiv.style.color = 'red';
    }
}

// Päivittää merkkilaskurin käyttäjän kirjoittaessa
document.getElementById('codeInput').addEventListener('input', updateCharCount);
