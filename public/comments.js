const commentsTable = document.getElementById("comments");

let comments = [];

function getComments(siteId) {
    fetch("/comments/" + siteId)
        .then((res) => res.json())
        .then((json) => {
            comments = json["comments"];
            if (comments !== undefined && comments.length !== 0) {
                comments.forEach((element) => {
                    const entry = document.createElement("tr");
                    entry.innerText = element.userid + ": " + element.text;
                    commentsTable.appendChild(entry);
                });
            } else {
                commentsTable.innerText = "Keine Kommentare";
            }
        })
        .catch((err) => console.log(err));
}

function addComment(siteId, newComment) {
    fetch("/comment", {
        method: "POST",
        body: `{"siteId": "${siteId}", "text": "${newComment} "}`,
        headers: {"content-type": "application/json"}
    }).then(() => window.location.reload());
}
