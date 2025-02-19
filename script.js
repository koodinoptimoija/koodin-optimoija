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
    // Listataan ES6-ominaisuudet, jotka halutaan estää
    var es6Patterns = [
        /\blet\b/,    // let-avainsana
        /\bconst\b/,  // const-avainsana
        /\([^\)]*\)\s*=>/, // nuolifunktio
        /\bclass\b/,   // class-syntaksi
        /\bimport\b/,  // import
        /\bexport\b/   // export
    ];

    // Jos koodissa löytyy ES6-ominaisuuksia, palautetaan true
    return es6Patterns.some(function(pattern) {
        return pattern.test(code);
    });
}

// Funktio tarkistaa, onko koodi JavaScriptiä
function isJSCode(code) {
    return /function|var|let|const|return|if|else|for|while/.test(code);
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

    // Jos valittu koodityyppi on HTML
    if (codeType === 'html') {
        checkHTML(code);  // Kutsutaan HTML-tarkistusfunktiota
    }
    // Jos valittu koodityyppi on JavaScript
    else if (codeType === 'javascript') {
        // Tarkistetaan, onko koodissa ES6-ominaisuuksia
        if (isES6(code)) {
            resultDiv.textContent = '⚠️ Tämä koodi sisältää ES6-ominaisuuksia. Käytä ES5-syntaksia tarkistukseen.';
            resultDiv.style.color = 'red';
            return;
        }
        checkJS(code);  // Kutsutaan JS-tarkistusfunktiota
    }
}

// Funktio HTML-koodin tarkistamiseen
function checkHTML(code) {
    var resultDiv = document.getElementById('result');
    var htmlHintResults = HTMLHint.verify(code);

    if (htmlHintResults.length === 0) {
        resultDiv.textContent = 'HTML on validia!';
        resultDiv.style.color = 'green';
    } else {
        resultDiv.textContent = 'Virheitä löytyi:';
        resultDiv.style.color = 'red';

        // HTMLHint virheilmoitusten tarkistaminen ja näyttäminen
        htmlHintResults.forEach(function (error) {
            resultDiv.textContent += '\nRivi ' + error.line + ': ' + error.message;
        });
    }
}

// Funktio JavaScript-koodin tarkistamiseen
function checkJS(code) {
    var options = { esversion: 5 };  // Määritetään, että käytämme ES5
    var isValid = JSHINT(code, options);
    var resultDiv = document.getElementById('result');

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
}

// Päivitetään merkkimäärä
document.getElementById('codeInput').addEventListener('input', updateCharCount);
