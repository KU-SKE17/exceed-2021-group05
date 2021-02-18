// Use for test only //

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

const tempElement = document.getElementById('temp');

const AirQuality = {
    "good": {
        "title": "Good",
        "description": "Overall air quality in you room is good.",
        "titleColor": "rgb(0, 197, 168)",       // green
        "descriptionColor": "rgb(197, 232, 227)",
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
        "descriptionColor": "rgb(240, 204, 163)",
    },
    "danger": {
        "title": "Danger!",
        "description": "Your room is not suitable for living!",
        "titleColor": "crimson",       // red (crimson)
        "descriptionColor": "rgb(242, 182, 184)",
    }
}

// function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function GenerateData() {
//     var data = new Now(
//         Date.now() * 1000,
//         AirQuality.danger, // edit here for new aq, AirQuality.good , AirQuality.moderate , AirQuality.unhealty , AirQuality.danger
//         getRandomInt(21, 32),
//         getRandomInt(500, 1020),
//         getRandomInt(10, 200),
//         getRandomInt(500, 1020),
//         getRandomInt(500, 1020),
//         getRandomInt(10, 30)
//     );
//     return data;
// }


function update(myRoom, now) {
    // var myRoom = new Room("Prayuth's Bedroom", "Prayuth", { "LPG": 1000, "CO": 100, "CH4": 1000, "H2": 1000 }, false);
    document.getElementById("greeting").innerHTML = `Hi, ${myRoom.roomOwner}`;
    document.getElementById("room-name").innerHTML = `${myRoom.roomName}`;

    // var now = GenerateData();
    tempElement.innerHTML = `${now.temp}°C`;
    document.getElementById('air-quality').innerHTML = now.quality.title;
    document.getElementById('air-quality-box').style.backgroundColor = now.quality.titleColor;
    document.getElementById('air-quality-description').innerHTML = now.quality.description;
    document.getElementById('air-quality-description-box').style.backgroundColor = now.quality.descriptionColor;

    if (now.LPG > myRoom.warningLevel.LPG) {
        // color red (crimson)
        document.getElementById('lpg-chart').style.width = `100%`;
        document.getElementById('lpg-chart').style.backgroundColor = 'crimson';
    }
    else {
        document.getElementById('lpg-chart').style.width = `${now.LPG / 10}%`;
        document.getElementById('lpg-chart').style.backgroundColor = 'rgb(17, 200, 237)';
    }

    if (now.CO > myRoom.warningLevel.CO) {

        // color red (crimson)
        document.getElementById('co-chart').style.width = `${now.CO / 10}%`;
        document.getElementById('co-chart').style.backgroundColor = 'crimson';
    }
    else {
        document.getElementById('co-chart').style.width = `${now.CO / 10}%`;
        document.getElementById('co-chart').style.backgroundColor = 'rgb(242, 2, 78)';
    }

    if (now.CH4 > myRoom.warningLevel.CH4) {
        // color red (crimson)
        document.getElementById('ch4-chart').style.width = `100%`;
        document.getElementById('ch4-chart').style.backgroundColor = 'crimson';
    }
    else {
        document.getElementById('ch4-chart').style.width = `${now.CH4 / 10}%`;
        document.getElementById('ch4-chart').style.backgroundColor = 'rgb(232, 178, 0)';
    }

    if (now.H2 > myRoom.warningLevel.H2) {
        // color red (crimson)
        document.getElementById('h2-chart').style.width = `100%`;
        document.getElementById('h2-chart').style.backgroundColor = 'crimson';
    }
    else {
        document.getElementById('h2-chart').style.width = `${now.H2 / 10}%`;
        document.getElementById('h2-chart').style.backgroundColor = 'rgb(0, 255, 145)';
    }
}


function getData(info) {
    var myRoom = new Room(info.room, info.room_owner, {
        "LPG": info.lpg_warning,
        "CO": info.co_warning,
        "CH4": info.ch4_warning,
        "H2": info.h2_warning,
    }, false);

    var now = new Now(
        info.timestamp * 1000,
        AirQuality.danger,
        info.temperature,
        info.lpg_history[0],
        info.co_history[0],
        info.ch4_history[0],
        info.h2_history[0],
        info.humidity
    );
    update(myRoom, now)
}

// TODO: add default id
function loadData() {
    var room_id = "kitchen";
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

setInterval(() => {
    loadData();
}, 1000);

// End of Use for test only //