const selectionBox = document.getElementById("filter");

function refreshPage() {
    const countryName =
        selectionBox.options[selectionBox.selectedIndex].innerText;

    if (countryName === "") return;

    fetch("/vaccinations-" + translateCountry(countryName))
        .then((res) => res.json())
        .then((res) => {
            const table = document.getElementById("vaccinations-table");
            table.deleteRow(1);

            const row = document.createElement("tr");
            const countryNameData = document.createElement("td");
            countryNameData.innerText = countryName;
            row.appendChild(countryNameData);

            const vaccinationData = document.createElement("td");
            vaccinationData.innerText = tidyUpNumbers(res["vaccinations"]);
            row.appendChild(vaccinationData);

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
