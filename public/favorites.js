const favoritesTable = document.getElementById("favorites");

let favorites = [];

if (favoritesTable !== null) {
    fetch("/favorites")
        .then((res) => res.json())
        .then((json) => {
            favorites = json["favorites"];

            if (favorites !== undefined && favorites.length !== 0) {
                favorites.forEach((element) => {
                    const entry = document.createElement("tr");
                    const text = favoriteMapping(element);
                    const countryCode = element.split("-")[1];
                    let a;
                    if (text.startsWith("Impfzahlen")) {
                        a = document.createElement("a");
                        a.innerText = text;
                        a.href = "/vaccineNumbers.html?country=" + countryCode;
                        entry.appendChild(a);
                    } else {
                        a = document.createElement("a");
                        a.innerText = text;
                        a.href = "/caseNumbers.html?country=" + countryCode;
                        entry.appendChild(a);
                    }
                    favoritesTable.appendChild(entry);
                });
            } else {
                favoritesTable.innerText = "Keine Favoriten";
            }
        })
        .catch((err) => console.log(err));
}

function addToFavorites(site) {
    const filter = document.getElementById("filter");
    const countryName = filter.options[filter.selectedIndex].innerText;
    if (countryName === "") return;

    const country = translateCountry(countryName);
    fetch("/favorites", {
        method: "POST",
        body: `{"siteId": "${site}-${country}" }`,
        headers: {
            "content-type": "application/json"
        }
    });
}
