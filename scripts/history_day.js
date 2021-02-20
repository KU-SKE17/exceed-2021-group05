const roomSelector = document.getElementById("room-selector");

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
loadRoomSelector();

var dps_LPG = [];
var dps_CO2 = [];
var dps_CH4 = [];
var dps_H2 = [];

var chart = new CanvasJS.Chart("chartContainer", {
    zoomEnabled: true,
    title: { text: "air quality" },
    axisX: { title: "Demo chart updates every 1 day" },
    axisY: { posfix: "ppm" },
    toolTip: { shared: true },
    legend: { cursor: "pointer", verticalAlign: "top", fontSize: 22, fontColor: "dimGrey", itemclick: toggleDataSeries },
    data:
        [
            {
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "####.00 (ppm)",
                xValueFormatString: "DD:MM:YYYY",
                showInLegend: true,
                name: "LPG",
                dataPoints: dps_LPG
            },
            {
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "####.00 (ppm)",
                showInLegend: true,
                name: "CO2",
                dataPoints: dps_CO2
            },
            {
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "####.00 (ppm)",
                showInLegend: true,
                name: "CH4",
                dataPoints: dps_CH4
            },
            {
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "####.00 (ppm)",
                showInLegend: true,
                name: "H2",
                dataPoints: dps_H2
            }
        ]
});

function toggleDataSeries(e) {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
    }
    else {
        e.dataSeries.visible = true;
    }
    chart.render();
}

//data array
var arr_LPG_raw = [];
var arr_CO2_raw = [];
var arr_CH4_raw = [];
var arr_H2_raw = [];

var arr_LPG = [], arr_LPG_index = 0;
var arr_CO2 = [], arr_CO2_index = 0;
var arr_CH4 = [], arr_CH4_index = 0;
var arr_H2 = [], arr_H2_index = 0;

var room_id = "bedroom";
var url = "http://158.108.182.6:3000/find?room=".concat(room_id);
fetch
    (url, { method: "GET", headers: { "Content-Type": "application/json" }, })
    .then((response) => response.json())
    .then((datas) => daatas.result.forEach((dta) => {
        arr_LPG_raw = data.lpg_history,
            arr_CO2_raw = data.co_history,
            arr_CH4_raw = data.ch4_history,
            arr_H2_raw = data.h2_history
        console.log(arr_LPG_raw);
    })
    );

console.log(arr_LPG_raw);

// initial value
var y_LPG_value = arr_LPG_raw[arr_LPG_raw.length - 1];
var y_CO2_value = arr_CO2_raw[arr_CO2_raw.length - 1];
var y_CH4_value = arr_CH4_raw[arr_CH4_raw.length - 1];
var y_H2_value = arr_H2_raw[arr_H2_raw.length - 1];

//update time 1 sec
var updateInterval = 1000;

var time = new Date();
var now = time.getHours();

//set sec to day
//var index_to_day = (24-now-1)*3600;
//var index_to_day = (24)*3600;
//demo
var index_to_day = 6;
//console.log(index_to_day);
var ct = 0;
function add_new(arr_temp, arr_index, yValue, dps_arr, check_time) {
    var temp = 0;
    arr_temp.push(yValue);
    for (var i = arr_index; i < arr_temp.length; i++) {
        temp += arr_temp[i];
    }
    temp /= arr_temp.length - arr_index;
    dps_arr.pop();
    dps_arr.push({ x: time.getTime(), y: temp });

    if (ct % index_to_day == 0) {
        time.setTime(time.getTime() + updateInterval * index_to_day);
        dps_arr.push({ x: time.getTime(), y: temp });
        arr_index += index_to_day;
        if (check_time == 0) time.setTime(time.getTime() - updateInterval * index_to_day);
        ct = 0;
    }
    else {
        time.setTime(time.getTime());
    }
}

//data array
var arr_LPG_raw = [];
var arr_CO2_raw = [];
var arr_CH4_raw = [];
var arr_H2_raw = [];

var arr_LPG = [], arr_LPG_index = 0;
var arr_CO2 = [], arr_CO2_index = 0;
var arr_CH4 = [], arr_CH4_index = 0;
var arr_H2 = [], arr_H2_index = 0;

function getData(info) {
    arr_LPG_raw = info.lpg_history;
    arr_CO2_raw = info.co_history;
    arr_CH4_raw = info.ch4_history;
    arr_H2_raw = info.h2_history;
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

loadData()
//set old_raw to dps
for (var i = 0; i < arr_LPG_raw.length; i++) {
    ct++;
    add_new(arr_LPG, arr_LPG_index, arr_LPG_raw[i], dps_LPG, 0);
    add_new(arr_CO2, arr_CO2_index, arr_CO2_raw[i], dps_CO2, 0);
    add_new(arr_CH4, arr_CH4_index, arr_CH4_raw[i], dps_CH4, 0);
    add_new(arr_H2, arr_H2_index, arr_H2_raw[i], dps_H2, 1);
}

function updateChart() {
    loadData();
    var y_LPG_value = arr_LPG_raw[arr_LPG_raw.length - 1];
    var y_CO2_value = arr_CO2_raw[arr_CO2_raw.length - 1];
    var y_CH4_value = arr_CH4_raw[arr_CH4_raw.length - 1];
    var y_H2_value = arr_H2_raw[arr_H2_raw.length - 1];

    //pushing the new values
    ct++;
    add_new(arr_LPG, arr_LPG_index, y_LPG_value, dps_LPG, 0);
    add_new(arr_CO2, arr_CO2_index, y_CO2_value, dps_CO2, 0);
    add_new(arr_CH4, arr_CH4_index, y_CH4_value, dps_CH4, 0);
    add_new(arr_H2, arr_H2_index, y_H2_value, dps_H2, 1);

    // updating legend text with  updated with y Value 
    chart.options.data[0].legendText = " LPG " + y_LPG_value + " (ppm)";
    chart.options.data[1].legendText = " CO2 " + y_CO2_value + " (ppm)";
    chart.options.data[2].legendText = " CH4 " + y_CH4_value + " (ppm)";
    chart.options.data[3].legendText = " H2 " + y_H2_value + " (ppm)";
    chart.render();
}
// generates first set of dataPoints 
updateChart();
setInterval(function () { updateChart() }, updateInterval);
