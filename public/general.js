function translateCountry(country) {
    let result = "";
    switch (country) {
        case "Chile":
            result += "CHL";
            break;
        case "Israel":
            result += "ISR";
            break;
        case "Vereinigtes Köngreich":
            result += "GBR";
            break;
        case "Vereinigte Staaten von Amerika":
            result += "USA";
            break;
        case "Dänemark":
            result += "DNK";
            break;
        case "Türkei":
            result += "TUR";
            break;
        case "Schweiz":
            result += "CHE";
            break;
        case "Deutschland":
            result += "DEU";
            break;
        case "Vereinigte Arabische Emirate":
            result += "ARE";
            break;
        case "China":
            result += "CHN";
            break;
        default:
            result += null;
            break;
    }
    return result;
}

function tidyUpNumbers(n) {
    return new Intl.NumberFormat("de-DE", {style: "currency", currency: "EUR"})
        .format(n)
        .split(",")[0];
}

function favoriteMapping(input) {
    const parts = input.split("-");
    let result = "";
    if (parts[0] === "vaccinations") {
        result += "Impfzahlen des Landes: ";
    } else {
        result += "Fallzahlen des Landes: ";
    }
    result += getCountryByShort(parts[1]);
    return result;
}

function getCountryByShort(short) {
    let result;
    switch (short.toUpperCase()) {
        case "CHL":
            result = "Chile";
            break;
        case "ISR":
            result = "Israel";
            break;
        case "GBR":
            result = "Vereinigtes Köngreich";
            break;
        case "USA":
            result = "Vereinigte Staaten von Amerika (USA)";
            break;
        case "DNK":
            result = "Dänemark";
            break;
        case "TUR":
            result = "Türkei";
            break;
        case "CHE":
            result = "Schweiz";
            break;
        case "DEU":
            result = "Deutschland";
            break;
        case "ARE":
            result = "Vereinigte Arabische Emirate";
            break;
        case "CHN":
            result = "China";
            break;
        default:
            result = "";
            break;
    }
    return result;
}

const urlParams = new URLSearchParams(window.location.search);

function getUrlParam(name) {
    return urlParams.get(name);
}
