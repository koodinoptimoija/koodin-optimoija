// Funktio päivittää merkkilaskurin ja tarkistaa, ylittääkö merkkimäärä sallitun rajan
function updateCharCount() {
    var code = document.getElementById('codeInput').value;
    var charCount = code.length;
    var maxLength = 2000;
    var charCountDisplay = document.getElementById('charCount');
    
    charCountDisplay.textContent = 'Merkkimäärä: ' + charCount + '/' + maxLength;
    
    if (charCount > maxLength) {
        charCountDisplay.style.color = 'red';
    } else {
        charCountDisplay.style.color = 'black';
    }
}

// Funktio tarkistaa, onko koodissa ES6-ominaisuuksia
function isES6(code) {
    var es6Patterns = [
        /\blet\b/,
        /\bconst\b/,
        /\([^\)]*\)\s*=>/,
        /\bclass\b/,
        /\bimport\b/,
        /\bexport\b/
    ];
    
    return es6Patterns.some(function(pattern) {
        return pattern.test(code);
    });
}

// Funktio koodin tarkistamiseen (HTML tai JavaScript)
function checkCode() {
    var code = document.getElementById('codeInput').value;
    var resultDiv = document.getElementById('result');
    var codeType = document.getElementById('codeType').value;

    // Tarkistetaan, että koodikenttä ei ole tyhjä
    if (code.trim() === "") {
        resultDiv.textContent = 'Syötä koodi ennen tarkistusta.';
        resultDiv.style.color = 'red';
        return;
    }

    // Jos koodin pituus on liian pitkä, estämme sen tarkistamisen
    if (code.length > 2000) {
        resultDiv.textContent = 'Koodin pituus ylittää sallitun rajan!';
        resultDiv.style.color = 'red';
        return;
    }

    // Jos valittu koodityyppi on JavaScript ja syötetään HTML-koodia
    if (codeType === 'javascript' && !isJSCode(code)) {
        resultDiv.textContent = 'Et voi tarkistaa HTML-koodia, koska JavaScript on valittu.';
        resultDiv.style.color = 'red';
        return;
    }

    // Jos valittu koodityyppi on HTML ja syötetään JavaScript-koodia
    if (codeType === 'html' && isJSCode(code)) {
        resultDiv.textContent = 'Et voi tarkistaa JavaScript-koodia, koska HTML on valittu.';
        resultDiv.style.color = 'red';
        return;
    }

    // HTML-tarkistus
    if (codeType === 'html') {
        var parser = new DOMParser();
        var doc = parser.parseFromString(code, 'text/html');
        
        // Tarkistetaan, että HTML on validia
        var error = doc.querySelector('parsererror');
        if (error) {
            resultDiv.textContent = 'Virheellinen HTML: ' + error.textContent;
            resultDiv.style.color = 'red';
        } else {
            resultDiv.textContent = 'HTML on validia!';
            resultDiv.style.color = 'green';
        }
    }

    // JavaScript-tarkistus (ilman ES6 ominaisuuksia)
    else if (codeType === 'javascript') {
        var options = { esversion: 5 };

        // JSHint tarkistaa ES6 koodin
        var isValid = JSHINT(code, options);
        if (isValid) {
            resultDiv.textContent = 'JavaScript-koodi on virheetöntä!';
            resultDiv.style.color = 'green';
        } else {
            resultDiv.textContent = 'Virheitä löytyi:\n';
            JSHINT.errors.forEach(function (error) {
                resultDiv.textContent += 'Rivi ' + error.line + ': ' + error.reason + '\n';
            });
            resultDiv.style.color = 'red';
        }

        // Jos koodissa on ES6 ominaisuuksia, ilmoitetaan siitä
        if (isES6(code)) {
            resultDiv.textContent = 'Virhe: Käytä vain ES5-koodia, ES6 ei ole tuettu.';
            resultDiv.style.color = 'red';
            return;
        }
    }
}

// Funktio tarkistaa, onko syötetty koodi JavaScriptiä
function isJSCode(code) {
    var jsPatterns = [
        /\bfunction\b/,
        /\bvar\b/,
        /\blet\b/,
        /\bconst\b/,
        /\bconsole\.log\b/,
        /\breturn\b/
    ];
    return jsPatterns.some(function(pattern) {
        return pattern.test(code);
    });
}

// Päivitetään merkkimäärä
document.getElementById('codeInput').addEventListener('input', updateCharCount)