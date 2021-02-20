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
let current_warning;
const setting_room_name = document.getElementById("setting_name");
const setting_owner = document.getElementById("setting_owner");
const setting_LPG = document.getElementById("setting_LPG");
const setting_CO = document.getElementById("setting_CO");
const setting_CH4 = document.getElementById("setting_CH4");
const setting_H2 = document.getElementById("setting_H2");
const setting_humidity = document.getElementById("setting_humidity");
const setting_climatize = document.getElementById("setting_climatize");



const AirQuality = {
    "good":  {
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



function getData(info) {
    current_room = {
        //"room_id": info.room_id,
        "room_name": info.room,
        "room_owner": info.room_owner,
        //"auto_climatize": info.auto_climatize,
        "room_warning": {
            "LPG": info.lpg_warning,
            "CO": info.co_warning,
            "CH4": info.ch4_warning,
            "H2": info.h2_warning,
        },
    };
    /*
    current_warning = {
        // "quality": info.quality,
        // "temperature": info.temperature,
        // "LPG": info.LPG,
        // "CO": info.CO,
        // "CH4": info.CH4,
        // "H2": info.H2,
        // "humidity": info.humidity
    }
    */
    current_data = {
        "current_time": info.timestamp * 1000,
        "quality": info.quality,
        "temperature": info.temperature,
        "LPG": info.lpg_now,
        "CO": info.co_now,
        "CH4": info.ch4_now,
        "H2": info.h2_now,
        "humidity": info.humidity
    };
}

// TODO: add default id
function loadData(room_name) {
    // var room_id = current_room.room_id ? current_room.room_id : 'default';
    var room_id = "kitchen";
    var url = "http://158.108.182.6:3000/find?room=".concat(room_id);
    fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((datas) =>
            datas.result.forEach((data) => {
                console.log(datas.result)
                getData(data);
                update(current_room,current_data);
            })
        );
}

// function updateUI() {
//     current_time.innerHTML = current_data["current_time"];
// }

// TODO: add url
function updateSetting(new_setting) {
    var url = "";
    fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(new_setting),
    }).then((response) => console.log(response));
}
/*
// TODO: add names
form.addEventListener("submit", event => {
    event.preventDefault();
    var new_setting = {
        '': setting_room_name.value,
        '': setting_owner.value,
        '': setting_LPG.value,
        '': setting_CO.value,
        '': setting_CH4.value,
        '': setting_H2.value,
        '': setting_humidity.value,
        '': setting_climatize.value
    }
    updateSetting(new_setting);
})

location.href = './setting.html';
*/




// Functions for index.html //

function update(myRoom,now) {

    document.getElementById("greeting").innerHTML = `Hi, ${myRoom.room_owner}`;
    document.getElementById("room-name").innerHTML = `${myRoom.room_name}`;
    document.getElementById('temp').innerHTML = `${now.temperature}°C`;
    document.getElementById('air-quality').innerHTML = now.quality.title;
    document.getElementById('air-quality-box').style.backgroundColor = now.quality.titleColor;
    document.getElementById('air-quality-description').innerHTML = now.quality.description;
    document.getElementById('air-quality-description-box').style.backgroundColor = now.quality.descriptionColor;
    
    if (now.LPG > myRoom.room_warning.LPG) {
        // color red (crimson)
        document.getElementById('lpg-chart').style.width = `100%`;
        document.getElementById('lpg-chart').style.backgroundColor = 'crimson';
    }
    else {   
        document.getElementById('lpg-chart').style.width = `${now.LPG / 10}%`;
        document.getElementById('lpg-chart').style.backgroundColor = 'rgb(17, 200, 237)';
    }
    if (now.CO > myRoom.room_warning.CO) {
        
        // color red (crimson)
        document.getElementById('co-chart').style.width = `${now.CO / 10}%`;
        document.getElementById('co-chart').style.backgroundColor = 'crimson';
    }
    else {   
        document.getElementById('co-chart').style.width = `${now.CO / 10}%`;
        document.getElementById('co-chart').style.backgroundColor = 'rgb(242, 2, 78)';
    }
    if (now.CH4 > myRoom.room_warning.CH4) {
        // color red (crimson)
        document.getElementById('ch4-chart').style.width = `100%`;
        document.getElementById('ch4-chart').style.backgroundColor = 'crimson';
    }
    else {
        document.getElementById('ch4-chart').style.width = `${now.CH4 / 10}%`;
        document.getElementById('ch4-chart').style.backgroundColor = 'rgb(232, 178, 0)';
    }
    if (now.H2 > myRoom.room_warning.H2) {
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
    loadData();
},1000);

