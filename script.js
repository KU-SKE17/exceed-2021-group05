// TODO: match data
function update(info) {
    // set ui ...
    // info.timestamp*1000
    // ...
}

// TODO: add url
function loadData() {
    var url = "";
    fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((datas) =>
            datas.result.forEach((data) => {
                update(data);
                // console.log(data);
            })
        );
}

// TODO: add params
function createSetting(p1, p2, p3) {
    var url = "";
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ p1: p1, p2: p2 }),
    }).then((response) => console.log(response));
}

// TODO: add params
function updateSetting(p1, p2, p3) {
    var url = "";
    fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ p1: p1, p2: p2  }),
    }).then((response) => console.log(response));
}

// // TODO: 
// form.addEventListener("submit", event => {
//     event.preventDefault();
//     p1 = document.getElementById("p1").value;
//     p2 = document.getElementById("p2").value;
//     updateSetting(p1, p2);
//     form.elements["p1"].value = "";
//     form.elements["p2"].value = "";
// })