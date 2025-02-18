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
        /\blet\b/,    // let-avainsana
        /\bconst\b/,  // const-avainsana
        /\([^\)]*\)\s*=>/, // arrow function
        /\bclass\b/,   // class-syntaksi
        /\bimport\b/,  // import
        /\bexport\b/   // export
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

    // Jos koodin pituus on liian pitkä, estämme sen tarkistamisen
    if (code.length > 2000) {
        resultDiv.textContent = 'Koodin pituus ylittää sallitun rajan!';
        resultDiv.style.color = 'red';
        return;
    }

    // Jos koodi on JavaScript ja se sisältää ES6 ominaisuuksia, näytämme ilmoituksen
    if (codeType === 'javascript' && isES6(code)) {
        resultDiv.textContent = 'Valitettavasti ES6-koodia en voi tarkistaa. Käytä vain ES5 JavaScriptiä.';
        resultDiv.style.color = 'red';
        return; // Lopetetaan tarkistus, jos ES6-ominaisuuksia löytyy
    }

    // HTML-tarkistus
    if (codeType === 'html') {
        var parser = new DOMParser();
        var doc = parser.parseFromString(code, 'text/html');
        
        if (doc.documentElement.nodeName === 'html' && doc.body) {
            resultDiv.textContent = 'HTML on validia!';
            resultDiv.style.color = 'green';
        } else {
            var error = doc.querySelector('parsererror');
            if (error) {
                resultDiv.textContent = 'Virheellinen HTML: ' + error.textContent;
                resultDiv.style.color = 'red';
            } else {
                resultDiv.textContent = 'HTML ei ole validia, mutta virheilmoituksia ei löytynyt.';
                resultDiv.style.color = 'orange';
            }
        }
    }

    // JavaScript-tarkistus (ilman ES6 ominaisuuksia)
    else if (codeType === 'javascript') {
        var options = {
            esversion: 5, // Asetetaan tarkistamaan vain ES5 koodi
            strict: true // Pakotetaan tiukempi tarkistus
        };

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
    }
}
