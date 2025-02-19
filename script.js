// Funktio merkkimäärän päivittämiseen
function updateCharCount() {
    var codeInput = document.getElementById('codeInput');
    var charCount = document.getElementById('charCount');
    var currentLength = codeInput.value.length;
    charCount.textContent = 'Merkkimäärä: ' + currentLength + '/2000';

    // Varmistetaan, että ei ylitetä 2000 merkin rajaa
    if (currentLength > 2000) {
        charCount.style.color = 'red';
    } else {
        charCount.style.color = 'black';
    }
}

// Funktio koodin tarkistamiseen
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
    const result = HTMLHint.verify(code); // Käytetään HTMLHintin tarkistusta
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

// Funktio tarkistamaan, onko koodi JavaScriptiä
function isJSCode(code) {
    return /function|var|let|const|return|if|else|for|while/.test(code);
}

// Funktio tarkistamaan, onko koodissa ES6-syntaksia
function isES6(code) {
    return /let|const|class|import|export/.test(code);
}
