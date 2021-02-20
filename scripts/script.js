const current_time = document.getElementById("time");
const firstSelector = document.getElementById("room-selector");

function setTime() {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var d = new Date();
    var day = days[d.getDay()];
    var hr = d.getHours();
    var min = d.getMinutes();
    if (min < 10) {
        min = "0" + min;
    }
    var ampm = "am";
    if (hr > 12) {
        hr -= 12;
        ampm = "pm";
    }
    var date = d.getDate();
    var month = months[d.getMonth()];
    var year = d.getFullYear();
    current_time.innerHTML = day + " " + hr + ":" + min + " " + ampm + " " + date + " " + month + " " + year;
}

setTime();
setInterval(() => {
    setTime();
}, 1000);

function linkTo(html) {
    var url = html + "?selector=" + firstSelector.value;
    window.location.href = url;
}

function getQueryParam(param) {
    var result = window.location.search.match(
        new RegExp("(\\?|&)" + param + "(\\[\\])?=([^&]*)")
    );
    return result ? result[3] : 'kitchen';
}

function loadRoomSelector() {
    var url = "http://158.108.182.6:3000/find_all";
    fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((datas) =>
            datas.result.forEach((data) => {
                firstSelector.innerHTML
                    += "\n<option value=\"" + data.room + "\">" + data.room + "</option>"
            })
        ).then(() => {
            firstSelector.value = getQueryParam('selector');
        });
}

loadRoomSelector();