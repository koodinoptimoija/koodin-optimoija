// Funktio tarkistaa, onko koodissa ES6-ominaisuuksia
function isES6(code) {
    var es6Patterns = [
        /\blet\b/,    // let-avainsana
        /\bconst\b/,  // const-avainsana
        /\([^\)]*\)\s*=>/, // nuolifunktio
        /\bclass\b/,   // class-syntaksi
        /\bimport\b/,  // import
        /\bexport\b/   // export
    ];

    // Jos ES6-ominaisuuksia löytyy, palautetaan true
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

    // Jos valittu koodityyppi on HTML
    if (codeType === 'html') {
        checkHTML(code);  // Kutsutaan HTML-tarkistusfunktiota
    }
    // Jos valittu koodityyppi on JavaScript
    else if (codeType === 'javascript') {
        if (isES6(code)) {
            resultDiv.textContent = '⚠️ Tämä koodi sisältää ES6-ominaisuuksia. Käytä ES5-syntaksia tarkistukseen.';
            resultDiv.style.color = 'red';
            return;
        }
        checkJS(code);  // Kutsutaan JS-tarkistusfunktiota
    }
}
