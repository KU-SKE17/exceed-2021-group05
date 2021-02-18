const roomSelector = document.getElementById("room-name");

const setting_owner = document.getElementById("owner_name");
const setting_LPG = document.getElementById("setting_LPG");
const setting_CO = document.getElementById("setting_CO");
const setting_CH4 = document.getElementById("setting_CH4");
const setting_H2 = document.getElementById("setting_H2");


function loadRoomSelector() {
    var url = "http://158.108.182.6:3000/find_all";
    fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((datas) =>
            datas.result.forEach((data) => {
                roomSelector.innerHTML += "\n<option value=\"" + data.room + "\">" + data.room + "</option>"
            })
        );
}

loadRoomSelector()

function fillData(room_name) {
    var url = "http://158.108.182.6:3000/find?room=".concat(room_name);
    fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((datas) =>
            datas.result.forEach((data) => {
                setting_owner.value = data.room_owner;
                setting_LPG.value = data.lpg_warning;
                setting_CO.value = data.co_warning;
                setting_CH4.value = data.ch4_warning;
                setting_H2.value = data.h2_warning;
            })
        );
}

function loadSetting(el) {
    var value = el.options[el.selectedIndex].value;
    fillData(value)
}

// TODO: add url
function updateSetting(new_setting) {
    var url = "";
    fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(new_setting),
    }).then((response) => console.log(response));
}

function sendForm() {
    if (setting_owner.value && setting_LPG.value && setting_CO.value && setting_CH4.value && setting_H2.value) {
        alert("Setting Successfully");
        var new_setting = {
            'room': roomSelector.value,
            'room_owner': setting_owner.value,
            'lpg_warning': setting_LPG.value,
            'co_warning': setting_CO.value,
            'ch4_warning': setting_CH4.value,
            'h2_warning': setting_H2.value,
        }
        updateSetting(new_setting);
    } else {
        alert("Setting Failure");
    }
}

