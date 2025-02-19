// Funktio tarkistamaan, onko syötetty koodi JavaScriptiä
function isJSCode(code) {
    return /function|var|let|const|return|if|else|for|while/.test(code);
}

// Funktio tarkistamaan, onko koodi ES6-syntaksia
function isES6(code) {
    return /let|const|class|import|export/.test(code);
}

// Funktio HTML-koodin tarkistamiseen HTMLHintin avulla
function checkHTML(code) {
    const result = HTMLHint.verify(code);

    const resultDiv = document.getElementById('result');

    if (result.length > 0) {
        resultDiv.textContent = 'Virheitä löytyi HTML-koodista:\n';
        result.forEach(function (error) {
            resultDiv.textContent += `Rivi ${error.line}: ${error.message}\n`;
        });
        resultDiv.style.color = 'red';
    } else {
        resultDiv.textContent = 'HTML-koodi on validia!';
        resultDiv.style.color = 'green';
    }
}

// Funktio koodin tarkistukseen
function checkCode() {
    var code = document.getElementById('codeInput').value;
    var resultDiv = document.getElementById('result');
    var codeType = document.getElementById('codeType').value;

    // Jos koodi on tyhjä
    if (code.trim() === "") {
        resultDiv.textContent = 'Syötä koodi ennen tarkistusta.';
        resultDiv.style.color = 'red';
        return;
    }

    // Jos koodin pituus on liian pitkä
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
        checkHTML(code);
    }

    // JavaScript-tarkistus
    else if (codeType === 'javascript') {
        var options = { esversion: 5 };

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
    }
}
