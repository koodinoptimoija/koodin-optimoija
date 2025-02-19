// Päivittää merkkilaskurin
function updateCharCount() {
    var code = document.getElementById('codeInput').value;
    var charCount = code.length;
    var maxLength = 2000;
    var charCountDisplay = document.getElementById('charCount');

    charCountDisplay.textContent = 'Merkkimäärä: ' + charCount + '/' + maxLength;
    charCountDisplay.style.color = charCount > maxLength ? 'red' : 'black';
}

// Tarkistaa, onko koodi HTML:ää
function isHTMLCode(code) {
    return /<\s*([a-z]+)(?:\s+[^>]*)?>/i.test(code);
}

// Tarkistaa, onko koodi JavaScriptiä
function isJSCode(code) {
    return /function|var|let|const|return|if|else|for|while|=>|class/.test(code);
}

// Tarkistaa, onko koodissa ES6-syntaksia
function isES6(code) {
    var es6Patterns = [
        /\blet\b/,      // let-avainsana
        /\bconst\b/,    // const-avainsana
        /\([^\)]*\)\s*=>/, // arrow function
        /\bclass\b/,    // class-syntaksi
        /\bimport\b/,   // import
        /\bexport\b/    // export
    ];

    return es6Patterns.some(function (pattern) {
        return pattern.test(code);
    });
}

// Tarkistaa käyttäjän syöttämän koodin
function checkCode() {
    var code = document.getElementById('codeInput').value.trim();
    var resultDiv = document.getElementById('result');
    var codeType = document.getElementById('codeType').value;

    if (code === "") {
        resultDiv.textContent = 'Syötä koodi ennen tarkistusta.';
        resultDiv.style.color = 'red';
        return;
    }

    if (code.length > 2000) {
        resultDiv.textContent = 'Koodin pituus ylittää sallitun rajan!';
        resultDiv.style.color = 'red';
        return;
    }

    if (codeType === 'html' && !isHTMLCode(code)) {
        resultDiv.textContent = 'Syöttämäsi koodi ei vaikuta olevan HTML:ää.';
        resultDiv.style.color = 'red';
        return;
    }

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

    if (codeType === 'html') {
        checkHTML(code);
    } else if (codeType === 'javascript') {
        checkJS(code);
    }
}

// HTML-koodin tarkistus (tarkemmat säännöt)
function checkHTML(code) {
    var resultDiv = document.getElementById('result');

    if (typeof HTMLHint === 'undefined') {
        resultDiv.textContent = 'Virhe: HTMLHint ei ole ladattu.';
        resultDiv.style.color = 'red';
        return;
    }

    var rules = {
        "tag-pair": true,          // Tarkistaa, että kaikki tagit ovat parillisia
        "attr-no-duplication": true, // Ei sallita saman attribuutin toistoa
        "doctype-first": true,     // Varmistaa, että doctype on ensimmäisenä
        "id-unique": true,         // ID-attribuutin on oltava uniikki
        "src-not-empty": true,     // Varmistaa, että <img> ja <script> tageilla on src
        "alt-require": true,       // Varmistaa, että kuvilla on alt-attribuutti
        "spec-char-escape": true,  // Estää erikoismerkit ilman escapea
        "attr-value-not-empty": true // Varmistaa, että attribuuteilla on arvot
    };

    var htmlHintResults = HTMLHint.verify(code, rules);

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

// JavaScript-koodin tarkistus (vain ES5)
function checkJS(code) {
    var resultDiv = document.getElementById('result');

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
