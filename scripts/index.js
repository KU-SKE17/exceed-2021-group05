const roomSelector = document.getElementById("room-selector");
const warning = document.getElementById('warning');
const windowStatus = document.getElementById('window-status');

const Room = class {
    constructor(roomName, roomOwner, warningLevel, autoClimatize) {
        this.roomName = roomName;
        this.roomOwner = roomOwner;
        this.warningLevel = warningLevel;
        this.autoClimatize = autoClimatize;
    }
}

const Now = class {
    constructor(currentTime, quality, temp, LPG, CO, CH4, H2, humidity) {
        this.currentTime = currentTime;
        this.quality = quality;
        this.temp = temp;
        this.LPG = LPG;
        this.CO = CO;
        this.CH4 = CH4;
        this.H2 = H2;
        this.humidity = humidity;
    }
}

const AirQuality = {
    "good": {
        "title": "Good",
        "description": "Overall air quality in you room is good.",
        "titleColor": "rgb(0, 197, 168)",       // green
        "descriptionColor": "rgb(223, 245, 239)",
    },
    "moderate": {
        "title": "Moderate",
        "description": "Air quality is quite acceptable.",
        "titleColor": "rgb(252, 211, 3)",       // yellow
        "descriptionColor": "rgb(247, 237, 186)",
    },
    "unhealthy": {
        "title": "Unhealthy",
        "description": "This may cause some effects if stay for long time.",
        "titleColor": "rgb(235, 133, 16)",       // orange
        "descriptionColor": "rgb(245, 231, 193)",
    },
    "danger": {
        "title": "Danger",
        "description": "Your room is not suitable for living!",
        "titleColor": "crimson",       // red (crimson)
        "descriptionColor": "rgb(242, 182, 184)",
    }
}
// We don't need it rightnow
//var airQuality = AirQuality.good;

function setAirQuality(quality) {
    switch (quality) {
        case "good":
            airQuality = AirQuality.good;
            break
        case "moderate":
            airQuality = AirQuality.moderate;
            break
        case "unhealthy":
            airQuality = AirQuality.unhealthy;
            break
        case "danger":
            airQuality = AirQuality.danger;
            break
    }
}

function loadAirQuality() {
    var room_id = roomSelector.value;
    var url = "http://158.108.182.6:3000/find_quality?room=".concat(room_id);
    fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((data) => {
            setAirQuality(data.quality);
        });
}

function loadWindowStatus() {
    var room_id = roomSelector.value;
    fetch("http://158.108.182.6:3000/switch_status?room=".concat(room_id), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((data) => {
            setTextWindowStatus(data.result);
        });
}

function setTextWindowStatus(boo) {
    windowStatus.innerHTML = boo ? 'on' : 'off';
}

function updateSwitch(new_status) {
    var room_id = roomSelector.value;
    fetch("http://158.108.182.6:3000/set_switch?room=".concat(room_id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "switch": new_status,
        }),
    }).then((response) => response.json())
}

function setWindow() {
    if (windowStatus.innerHTML == 'on') {
        updateSwitch(false);
        alert("Closing...");
    }
    else {
        updateSwitch(true);
        alert("Opening...");
    }
}

const roomElement = document.getElementById('room-name');
const tempElement = document.getElementById('temp');

const lpgChart = document.getElementById('lpg-chart');
const coChart = document.getElementById('co-chart');
const ch4Chart = document.getElementById('ch4-chart')
const h2Chart = document.getElementById('h2-chart');

function updateChart(chart, current, warningAmount, color) {
    if (current > warningAmount) {
        // color red (crimson)
        chart.style.width = `100%`;
        chart.style.backgroundColor = 'crimson';
    }
    else {
        chart.style.width = `${current}%`;
        chart.style.backgroundColor = color;
    }
}

function update(myRoom, now) {

    // Check if the incoming data is not sync with the selector's value, then skip. (not worked)
    if (myRoom.roomName != roomSelector.value) return;
    // Show the warning box if room is in danger (higher than >> unhealthy)
    if (now.quality.title == 'Unhealthy' || now.quality.title == 'Danger') warning.style.visibility = 'visible';
    else warning.style.visibility = 'hidden';

    document.getElementById("greeting").innerHTML = `Hi, ${myRoom.roomOwner}`;

    roomElement.innerHTML = `${myRoom.roomName}`;
    tempElement.innerHTML = `${now.temp}°C`;

    document.getElementById('air-quality').innerHTML = now.quality.title;
    document.getElementById('air-quality-box').style.backgroundColor = now.quality.titleColor;
    document.getElementById('air-quality-description').innerHTML = now.quality.description;
    document.getElementById('air-quality-description-box').style.backgroundColor = now.quality.descriptionColor;

    updateChart(lpgChart, now.LPG, myRoom.warningLevel.LPG, 'rgb(17, 200, 237)');
    updateChart(coChart, now.CO, myRoom.warningLevel.CO, 'rgb(242, 2, 78)');
    updateChart(ch4Chart, now.CH4, myRoom.warningLevel.CH4, 'rgb(232, 178, 0)');
    updateChart(h2Chart, now.H2, myRoom.warningLevel.H2, 'rgb(0, 255, 145)');
}

function getData(info) {
    loadAirQuality();
    loadWindowStatus();

    var myRoom = new Room(info.room, info.room_owner, {
        "LPG": info.lpg_warning,
        "CO": info.co_warning,
        "CH4": info.ch4_warning,
        "H2": info.h2_warning,
    }, false);

    var now = new Now(
        info.timestamp * 1000,
        airQuality,
        info.temperature,
        info.lpg_history[info.lpg_history.length - 1],
        info.co_history[info.co_history.length - 1],
        info.ch4_history[info.ch4_history.length - 1],
        info.h2_history[info.h2_history.length - 1],
        info.humidity
    );
    update(myRoom, now);
}

function loadData() {
    var room_id = roomSelector.value;
    var url = "http://158.108.182.6:3000/find?room=".concat(room_id);
    fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((datas) =>
            datas.result.forEach((data) => {
                getData(data);
            })
        );
}

loadData();
setInterval(() => {
    loadData();
}, 1000);

// demo data
function changeWidth() {
    document.getElementById('h2-chart').style.width = '40%';
    document.getElementById('co-chart').style.width = '70%';
    document.getElementById('ch4-chart').style.width = '30%';
    document.getElementById('lpg-chart').style.width = '20%';
}
function reset() {
    document.getElementById('h2-chart').style.width = '60%';
    document.getElementById('co-chart').style.width = '60%';
    document.getElementById('ch4-chart').style.width = '60%';
    document.getElementById('lpg-chart').style.width = '60%';
}