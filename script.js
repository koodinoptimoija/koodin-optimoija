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

    // HTML-koodin tarkistus
    if (codeType === 'html') {
        var parser = new DOMParser();
        var doc = parser.parseFromString(code, 'text/html');
        
        // Tarkistetaan, onko HTML:ssä virheitä
        var error = doc.querySelector('parsererror');
        if (error) {
            resultDiv.textContent = 'Virheellinen HTML: ' + error.textContent;
            resultDiv.style.color = 'red';
        } else {
            resultDiv.textContent = 'HTML on validia!';
            resultDiv.style.color = 'green';
        }
    }

    // JavaScript-koodin tarkistus
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

function isJSCode(code) {
    return /function|var|let|const|return|if|else|for|while/.test(code);
}

function isES6(code) {
    return /let|const|class|import|export/.test(code);
}
