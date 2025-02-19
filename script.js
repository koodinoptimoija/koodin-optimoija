// HTML-validointiin tarvittavat kirjastot
// Käytetään HTMLHintiä (muista sisällyttää HTMLHint kirjasto HTML-tiedostoon)

function isES6(code) {
    return /let|const|class|import|export/.test(code);
}

// Funktio koodin tarkistukseen
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

    // **ES6-tarkistus** ennen JSHint-analyysiä
    if (codeType === 'javascript' && isES6(code)) {
        resultDiv.textContent = '⚠️ Et voi tarkistaa ES6-koodia. Käytä vain ES5-syntaksia!';
        resultDiv.style.color = 'red';
        return;
    }

    // HTML-tarkistus käyttäen HTMLHintiä
    if (codeType === 'html') {
        var HTMLHint = window.HTMLHint; // HTMLHint-kirjasto tulee olla ladattuna HTML-tiedostoon
        var result = HTMLHint.verify(code);

        if (result.length > 0) {
            resultDiv.textContent = 'Virheellinen HTML:\n';
            result.forEach(function (error) {
                resultDiv.textContent += 'Rivi ' + error.line + ': ' + error.message + '\n';
            });
            resultDiv.style.color = 'red';
        } else {
            resultDiv.textContent = 'HTML on validia!';
            resultDiv.style.color = 'green';
        }
    }

    // JavaScript-tarkistus (vain ES5 sallittu)
    else if (codeType === 'javascript') {
        var options = { esversion: 5 };

        // JSHint tarkistaa ES5-koodin
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

// Funktio tarkistamaan, onko syötetty koodi JavaScriptiä
function isJSCode(code) {
    // Tämä voi olla perus tarkistus: etsitään, onko koodissa JavaScript-avaimia, kuten "function" tai "var"
    return /function|var|let|const|return|if|else|for|while/.test(code);
}
