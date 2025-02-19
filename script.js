function checkCode() {
    var code = document.getElementById('codeInput').value;
    var resultDiv = document.getElementById('result');

    if (code.trim() === "") {
        resultDiv.textContent = "⚠️ Syötä koodi ennen tarkistusta!";
        resultDiv.style.color = "red";
        return;
    }

    // Tunnistetaan koodityyppi automaattisesti
    if (isJSCode(code)) {
        checkJS(code);
    } else {
        checkHTML(code);
    }
}

// Tarkistaa, onko koodi JavaScriptiä
function isJSCode(code) {
    return /function|var|let|const|return|if|else|for|while/.test(code);
}

// Tarkistaa HTML-koodin virheet
function checkHTML(code) {
    var resultDiv = document.getElementById('result');

    if (typeof HTMLHint === "undefined") {
        resultDiv.textContent = "Virhe: HTMLHint ei ole ladattu.";
        resultDiv.style.color = "red";
        return;
    }

    var rules = { "tag-pair": true, "doctype-first": true, "id-unique": true };
    var errors = HTMLHint.verify(code, rules);

    if (errors.length === 0) {
        resultDiv.textContent = "✅ HTML-koodi on validia!";
        resultDiv.style.color = "green";
    } else {
        resultDiv.innerHTML = "❌ Virheitä löytyi:<br>";
        errors.forEach(error => {
            resultDiv.innerHTML += `🔹 Rivi ${error.line}: ${error.message}<br>`;
        });
        resultDiv.style.color = "red";
    }
}

// Tarkistaa JavaScript-koodin virheet (vain ES5)
function checkJS(code) {
    var resultDiv = document.getElementById('result');

    if (isES6(code)) {
        resultDiv.textContent = "⚠️ Et voi tarkistaa ES6-koodia. Käytä vain ES5-syntaksia!";
        resultDiv.style.color = "red";
        return;
    }

    var isValid = JSHINT(code, { esversion: 5 });

    if (isValid) {
        resultDiv.textContent = "✅ JavaScript-koodi on virheetöntä!";
        resultDiv.style.color = "green";
    } else {
        resultDiv.innerHTML = "❌ Virheitä löytyi JavaScript-koodista:<br>";
        JSHINT.errors.forEach(error => {
            resultDiv.innerHTML += `🔹 Rivi ${error.line}: ${error.reason}<br>`;
        });
        resultDiv.style.color = "red";
    }
}

// Estetään ES6-syntaksi
function isES6(code) {
    return /\
