// USE FOR TEST
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

const roomElement = document.getElementById('roomname');
const tempElement = document.getElementById('details-temp');
const humElement = document.getElementById('details-hum');

console.log("Initialized")

// Structure. //

/*

const current_room = {
    "room_name": info.room_name,
    "room_owner": info.room_owner,
    "warning_level": info.warning_level,
    "auto_climatize": info.auto_climatize,
};

const current_data = {
    "current_time": info.timestamp * 1000,
    "quality": info.quality,
    "temperature": info.temperature,
    "LPG": info.LPG,
    "CO": info.CO,
    "CH4": info.CH4,
    "H2": info.H2,
    "humidity": info.humidity
};

//  TEST   //

const myRoom = new Room(
    "Prayuth's Bedroom",
    "Prayuth",
    {
        "lpg": 1000,
        "co": 100,
        "ch4": 1000,
        "h2": 1000
    },
    false
)

*/
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function GenerateData() {
    var data = new Now(
        Date.now() * 1000,
        "Good",
        getRandomInt(21,32),
        getRandomInt(500, 1020),
        getRandomInt(10, 200),
        getRandomInt(500, 1020),
        getRandomInt(500, 1020),
        getRandomInt(10,30)
    );
    return data;
}



function update() {

    var myRoom = new Room("Prayuth's Bedroom", "Prayuth", { "LPG": 1000, "CO": 100, "CH4": 1000, "H2": 1000 }, false);

    var now = GenerateData();

    roomElement.innerHTML = `${myRoom.roomName}`;
    tempElement.innerHTML = `${now.temp}°C`;
    humElement.innerHTML = `${now.humidity}%`;

    if (now.LPG > myRoom.warningLevel.LPG) {
        // color red (crimson)
        document.getElementById('lpg-chart').style.width = `100%`;
        document.getElementById('lpg-chart').style.backgroundColor = 'crimson';
        document.getElementById('lpg-amount').innerHTML = `${now.LPG} ppm (Danger!)`;
    }
    else {   
        document.getElementById('lpg-chart').style.width = `${now.LPG / 10}%`;
        document.getElementById('lpg-chart').style.backgroundColor = 'rgb(17, 200, 237)';
        document.getElementById('lpg-amount').innerHTML = `${now.LPG} ppm`;
    }



    if (now.CO > myRoom.warningLevel.CO) {
        
        // color red (crimson)
        document.getElementById('co-chart').style.width = `${now.CO / 10}%`;
        document.getElementById('co-chart').style.backgroundColor = 'crimson';
        document.getElementById('co-amount').innerHTML = `${now.CO} ppm (Danger!)`;
    }
    else {   
        document.getElementById('co-chart').style.width = `${now.CO / 10}%`;
        document.getElementById('co-chart').style.backgroundColor = 'rgb(242, 2, 78)';
        document.getElementById('co-amount').innerHTML = `${now.CO} ppm`;
    }





    if (now.CH4 > myRoom.warningLevel.CH4) {
        // color red (crimson)
        document.getElementById('ch4-chart').style.width = `100%`;
        document.getElementById('ch4-chart').style.backgroundColor = 'crimson';
        document.getElementById('ch4-amount').innerHTML = `${now.CH4} ppm (Danger!)`;
    }
    else {
        document.getElementById('ch4-chart').style.width = `${now.CH4 / 10}%`;
        document.getElementById('ch4-chart').style.backgroundColor = 'rgb(232, 178, 0)';
        document.getElementById('ch4-amount').innerHTML = `${now.CH4} ppm`;
    }





    if (now.H2 > myRoom.warningLevel.H2) {
        // color red (crimson)
        document.getElementById('h2-chart').style.width = `100%`;
        document.getElementById('h2-chart').style.backgroundColor = 'crimson';
        document.getElementById('h2-amount').innerHTML = `${now.H2} ppm (Danger!)`;
    }
    else {
        document.getElementById('h2-chart').style.width = `${now.H2 / 10}%`;
        document.getElementById('h2-chart').style.backgroundColor = 'rgb(0, 255, 145)';
        document.getElementById('h2-amount').innerHTML = `${now.H2} ppm`;
    }



}



setInterval(() => {
    update();
}, 1000);