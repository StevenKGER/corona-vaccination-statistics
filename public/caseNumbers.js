const selectionBox = document.getElementById("filter");

function refreshPage() {
    const countryName =
        selectionBox.options[selectionBox.selectedIndex].innerText;

    if (countryName === "") return;

    fetch("/infections-" + translateCountry(countryName))
        .then((res) => res.json())
        .then((res) => {
            const table = document.getElementById("cases-table");
            table.deleteRow(1);

            const row = document.createElement("tr");

            const countryNameData = document.createElement("td");
            countryNameData.innerText = countryName;
            row.appendChild(countryNameData);

            const infectionsData = document.createElement("td");
            infectionsData.innerText = tidyUpNumbers(res["totalCases"]);
            row.appendChild(infectionsData);

            const deathsData = document.createElement("td");
            deathsData.innerText = tidyUpNumbers(res["totalDeaths"]);
            row.appendChild(deathsData);

            table.appendChild(row);
        });
}

document.onsubmit = (event) => event.preventDefault();

const param = getUrlParam("country");

if (param !== null && param !== "") {
    const country = getCountryByShort(param);
    if (country !== "") {
        for (let i = selectionBox.options.length; i > 1; i--) {
            if (country === selectionBox.options[i - 1].innerText) {
                selectionBox.selectedIndex = i - 1;
            }
        }

        document.getElementById("submit").click();
    }
}
