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

    // Tarkistus, onko koodi ES6 ja ilmoitus siitä, ettei sitä voi tarkistaa
    if (codeType === 'javascript' && isES6(code)) {
        resultDiv.textContent = '⚠️ Et voi tarkistaa ES6-koodia. Käytä vain ES5-syntaksia!';
        resultDiv.style.color = 'red';
        return;
    }

    // Jos valittu koodityyppi on HTML
    if (codeType === 'html') {
        checkHTML(code);  // Kutsutaan HTML-tarkistusfunktiota
    }
    // Jos valittu koodityyppi on JavaScript
    else if (codeType === 'javascript') {
        checkJS(code);  // Kutsutaan JS-tarkistusfunktiota
    }
}

// Funktio HTML-koodin tarkistamiseen
function checkHTML(code) {
    var result = HTMLHint.verify(code); // Käytetään HTMLHintin tarkistusta
    var resultDiv = document.getElementById('result');

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
