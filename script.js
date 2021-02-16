// current room
let current_room;
// const current_room_name = document.getElementById("room_name");

// current data
let current_data;
// const current_time = document.getElementById("current_time");
// const current_quality = document.getElementById("current_quality");
// const current_temperature = document.getElementById("current_temperature");
// const current_LPG = document.getElementById("current_LPG");
// const current_CO = document.getElementById("current_CO");
// const current_CH4 = document.getElementById("current_CH4");
// const current_H2 = document.getElementById("current_H2");
// const current_humidity = document.getElementById("current_humidity");

// setting
const setting_room_name = document.getElementById("setting_name");
const setting_owner = document.getElementById("setting_owner");
const setting_LPG = document.getElementById("setting_LPG");
const setting_CO = document.getElementById("setting_CO");
const setting_CH4 = document.getElementById("setting_CH4");
const setting_H2 = document.getElementById("setting_H2");
const setting_humidity = document.getElementById("setting_humidity");
const setting_climatize = document.getElementById("setting_climatize");

function getRoom(info) {
    current_room = {
        "room_name": info.room_name,
        "room_owner": info.room_owner,
        "warning_level": info.warning_level,
        "auto_climatize": info.auto_climatize,
    };
}

// TODO: add url, del param
function loadRoom(room_name) {
    var url = "";
    fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((datas) =>
            datas.result.forEach((data) => {
                getRoom(data);
                // console.log(data);
            })
        );
}

function getCurrentData(info) {
    current_data = {
        "current_time": info.timestamp * 1000,
        "quality": info.quality,
        "temperature": info.temperature,
        "LPG": info.LPG,
        "CO": info.CO,
        "CH4": info.CH4,
        "H2": info.H2,
        "humidity": info.humidity
    };
}

// TODO: add url, del param
function loadCurrentData(room_name) {
    var url = "";
    fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((datas) =>
            datas.result.forEach((data) => {
                getCurrentData(data);
                // console.log(data);
            })
        );
}

// function updateUI() {
//     current_time.innerHTML = current_data["current_time"];
// }

// TODO: add names, url
function updateSetting(rname, owner, warning, humidity, climatize) {
    var new_setting = {
        '': rname,
        '': owner,
        '': warning,
        '': humidity,
        '': climatize
    }
    var url = "";
    fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(new_setting),
    }).then((response) => console.log(response));
}

form.addEventListener("submit", event => {
    event.preventDefault();
    var rname = setting_room_name.value;
    var owner = setting_owner.value;
    var warning = {
        "LPG": setting_LPG.value,
        "CO": setting_CO.value,
        "CH4": setting_CH4.value,
        "H2": setting_H2.value,
    };
    var humidity = setting_humidity.value;
    var climatize = setting_climatize.value;
    updateSetting(rname, owner, warning, humidity, climatize);
})