const roomSelector = document.getElementById("room-selector");

const setting_owner = document.getElementById("owner_name");
const setting_LPG = document.getElementById("setting_LPG");
const setting_CO = document.getElementById("setting_CO");
const setting_CH4 = document.getElementById("setting_CH4");
const setting_H2 = document.getElementById("setting_H2");

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
    fillData(value);
}

function autoFill() {
    fillData(roomSelector.value);
}

function updateSetting(room) {
    fetch("http://158.108.182.6:3000/set_warning?room=".concat(room), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "room_owner": setting_owner.value,
            "lpg_warning": Number(setting_LPG.value),
            "co_warning": Number(setting_CO.value),
            "ch4_warning": Number(setting_CH4.value),
            "h2_warning": Number(setting_H2.value),
        }),
    }).then((response) => response.json())
}

function sendForm() {
    if (setting_owner.value && setting_LPG.value && setting_CO.value && setting_CH4.value && setting_H2.value) {
        updateSetting(roomSelector.value);
        alert("Setting Successfully");
        location.href = 'home.html';
    } else {
        alert("Setting Failure");
    }
}

autoFill();