const express = require("express");
const cookieParser = require("cookie-parser");
const {v4: uuidv4} = require("uuid");
const httpContext = require("express-http-context");
const fetch = require("node-fetch");

const app = express();

const comments = {};
const visitedPages = {};
const favorites = {};

const vaccinationStats = {}; // in production this defintely should not be fetched just once
const infectionStats = {};
const countries = [
    "CHL",
    "ISR",
    "GBR",
    "USA",
    "DNK",
    "TUR",
    "CHE",
    "DEU",
    "ARE",
    "CHN"
];

fetch(
    "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.json"
)
    .then((res) => res.json())
    .then((res) => {
        const filteredEntries = res.filter((element) =>
            countries.includes(element["iso_code"])
        );

        let entry;
        while ((entry = filteredEntries.pop()) !== undefined) {
            const country = entry["iso_code"];

            let dataEntry;
            dataLoop: while ((dataEntry = entry["data"].pop()) !== undefined) {
                const total = dataEntry["total_vaccinations"];
                if (total != undefined) {
                    vaccinationStats[country] = total;
                    break dataLoop;
                }
            }
        }
    });

fetch(
    "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.json"
)
    .then((res) => res.json())
    .then((res) => {
        countries.forEach((countryName) => {
            const data = res[countryName];
            infectionStats[countryName] = new InfectionStats(
                data["total_cases"],
                data["total_deaths"]
            );
        });
    });

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(httpContext.middleware);

app.use((req, res, next) => {
    const cookie = req.cookies.session;
    let userId;

    if (cookie === undefined) {
        userId = uuidv4();
        res.cookie("session", userId, {
            httpOnly: true,
            maxAge: 150000000
        });
    } else {
        userId = cookie;
    }
    httpContext.set("userId", userId);

    next();
});

app.post("/comment", (req, res) => {
    const siteId = req.body.siteId;
    const text = req.body.text;

    if (siteId !== undefined && text !== undefined) {
        const newComment = new Comment(httpContext.get("userId"), text);

        if (comments[siteId] === undefined) comments[siteId] = [newComment];
        else comments[siteId].push(newComment);

        res.send({status: "ok"});
        return;
    }

    res.send({status: "invalid_request"});
});

app.get("/comments/:siteId", (req, res) => {
    if (comments[req.params.siteId] === undefined) {
        res.send({});
        return;
    }

    const clonedArray = JSON.parse(JSON.stringify(comments[req.params.siteId]));
    clonedArray.forEach((element) => {
        if (element.userid === httpContext.get("userId")) element.userid += " (Du)";
    });
    res.send({comments: clonedArray});
});

app.post("/favorites", (req, res) => {
    const siteId = req.body.siteId;
    const userId = httpContext.get("userId");

    if (favorites[userId] !== undefined) {
        if (!favorites[userId].includes(siteId)) {
            favorites[userId].push(siteId);
        }
    } else {
        favorites[userId] = [siteId];
    }
    res.send({status: "ok"});
});

app.get("/favorites", (req, res) => {
    res.send({favorites: favorites[httpContext.get("userId")]});
});

app.get("/most-visited-sites", (req, res) => {
    res.send({mvs: visitedPages[httpContext.get("userId")]});
});

app.get("/vaccinations-:country", (req, res) => {
    const data = vaccinationStats[req.params.country.toUpperCase()];
    if (data === undefined) {
        res.send({status: "invalid_request"});
        return;
    }

    addPageVisit(httpContext.get("userId"), "vaccinations-" + req.params.country);

    res.send({vaccinations: data});
});

app.get("/infections-:country", (req, res) => {
    const data = infectionStats[req.params.country.toUpperCase()];
    if (data === undefined) {
        res.send({status: "invalid_request"});
        return;
    }

    addPageVisit(httpContext.get("userId"), "infections-" + req.params.country);

    res.send(data);
});

app.listen(8080);

class InfectionStats {
    constructor(totalCases, totalDeaths) {
        this.totalCases = totalCases;
        this.totalDeaths = totalDeaths;
    }
}

class Comment {
    constructor(userid, text) {
        this.userid = userid;
        this.text = text;
    }
}

function addPageVisit(userId, siteId) {
    if (visitedPages[userId] === undefined) visitedPages[userId] = {};

    if (visitedPages[userId][siteId] === undefined) {
        visitedPages[userId][siteId] = 1;
        return;
    }

    visitedPages[userId][siteId] += 1;
}
