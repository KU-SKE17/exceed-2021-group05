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



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function GenerateData() {
    var data = new Now(
        Date.now() * 1000,
        "Bad",
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

    document.getElementById("greeting").innerHTML = `Hi, ${myRoom.roomOwner}`;
    document.getElementById("room-name").innerHTML = `${myRoom.roomName}`;


    var now = GenerateData();

    tempElement.innerHTML = `${now.temp}°C`;
    document.getElementById('air-quality').innerHTML = now.quality;


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


setInterval(() => {
    update();
} , 1000);


// End of Use for test only //