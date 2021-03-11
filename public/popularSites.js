const popSites = document.getElementById("popular-sites");

let sites = {};

fetch("/most-visited-sites")
    .then((res) => res.json())
    .then((json) => {
        sites = json["mvs"];

        if (sites !== undefined && sites.length !== 0) {
            let map = new Map();
            for (let key in sites) {
                map.set(key, sites[key]);
            }

            map = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));

            map.forEach((key, value) => {
                const row = document.createElement("tr");
                const entry = document.createElement("td");

                const text = favoriteMapping(value);
                const countryCode = value.split("-")[1];
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
                row.append(entry);
                popSites.appendChild(row);
            });
        } else {
            popSites.innerText = "Keine Seiten";
        }
    })
    .catch((err) => console.log(err));
