// match data
function update(info) {
    // set ui ...
    // info.timestamp*1000
    // ...
}

function loadData() {
    // Todo: add url
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
