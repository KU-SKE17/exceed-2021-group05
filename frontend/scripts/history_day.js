const roomSelector = document.getElementById("room-selector");

//init var
var dps_LPG = [];
var dps_CO2 = [];
var dps_CH4 = [];
var dps_H2 = [];

var arr_LPG_raw = [];
var arr_CO2_raw = [];
var arr_CH4_raw = [];
var arr_H2_raw = [];

var lpg_ct = 1;
var co2_ct = 1;
var ch4_ct = 1;
var h2_ct = 1;

var arr_LPG = [], arr_LPG_index = 0;
var arr_CO2 = [], arr_CO2_index = 0;
var arr_CH4 = [], arr_CH4_index = 0;
var arr_H2 = [], arr_H2_index = 0;

//create chart
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
                xValueFormatString: "DD/MM/YYYY",
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

function toggleDataSeries(e) 
{
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) e.dataSeries.visible = false;
    else e.dataSeries.visible = true;
    chart.render();
}

//update time 1 sec
var updateInterval = 1000;
//set time
var time = new Date();
var now = time.getHours();
//round
var index_to_day = 86400;

//add dps func
function add_new(arr_temp, arr_index, yValue, dps_arr, check_time, ct) 
{
    var temp = 0;

    arr_temp.push(yValue);
    for (var i = arr_index; i < arr_temp.length; i++) temp += arr_temp[i];
    temp /= (arr_temp.length - arr_index + 1);

    //if(check_time == 1) console.log(temp)
    dps_arr.pop();
    dps_arr.push({ x: time.getTime(), y: temp });

    if (ct % index_to_day == 0) 
    {
        time.setTime(time.getTime() + updateInterval * index_to_day);
        dps_arr.push({ x: time.getTime(), y: temp });
        if (check_time == 0) time.setTime(time.getTime() - updateInterval * index_to_day);
    }
    else time.setTime(time.getTime());
    //if(check_time == 1) console.log("arr_temp.length =",arr_temp.length, " arr_index =", arr_index, " yValue =", yValue, " dps_arr.length =", dps_arr.length, " ct =", ct)
    return temp;
}

function getData(info) 
{
    arr_LPG_raw = info.lpg_history;
    arr_CO2_raw = info.co_history;
    arr_CH4_raw = info.ch4_history;
    arr_H2_raw = info.h2_history;
}

function loadData() 
{
    var room_id = roomSelector.value;
    //var room_id = "living_room";
    var url = "http://158.108.182.6:3000/find?room=".concat(room_id);
    fetch
    (url, {method: "GET", headers: { "Content-Type": "application/json" }})
        .then((response) => response.json())
        .then((datas) => datas.result.forEach((data) => {getData(data);}));
}

function update_ct_index()
{
    if (lpg_ct % index_to_day == 0) arr_LPG_index += index_to_day;
    if (co2_ct % index_to_day == 0) arr_CO2_index += index_to_day;
    if (ch4_ct % index_to_day == 0) arr_CH4_index += index_to_day;
    if (h2_ct % index_to_day == 0) arr_H2_index += index_to_day;
    lpg_ct++;
    co2_ct++;
    ch4_ct++;
    h2_ct++;
}

//first time ct
var settt = 0;
function updateChart() 
{
    loadData();
    //use old data
    if(settt == 0 && arr_LPG_raw.length != 0)
    {
        settt++;
        time.setTime(time.getTime() - (arr_LPG_raw.length*1000));
        for (var i = 0; i < arr_LPG_raw.length; i++) 
        {
            update_ct_index();
            newest_lpg = add_new(arr_LPG, arr_LPG_index, arr_LPG_raw[i], dps_LPG, 0, lpg_ct);
            newest_co2 = add_new(arr_CO2, arr_CO2_index, arr_CO2_raw[i], dps_CO2, 0, co2_ct);
            newest_ch4 = add_new(arr_CH4, arr_CH4_index, arr_CH4_raw[i], dps_CH4, 0, ch4_ct);
            newest_h2 = add_new(arr_H2, arr_H2_index, arr_H2_raw[i], dps_H2, 1, h2_ct);
        }
        
    }
    //use new data
    if(arr_LPG_raw.length != 0)
    {
        var y_LPG_value = arr_LPG_raw[arr_LPG_raw.length - 1];
        var y_CO2_value = arr_CO2_raw[arr_CO2_raw.length - 1];
        var y_CH4_value = arr_CH4_raw[arr_CH4_raw.length - 1];
        var y_H2_value = arr_H2_raw[arr_H2_raw.length - 1];

        //pushing the new values
        update_ct_index();
        newest_lpg = add_new(arr_LPG, arr_LPG_index, y_LPG_value, dps_LPG, 0, lpg_ct);
        newest_co2 = add_new(arr_CO2, arr_CO2_index, y_CO2_value, dps_CO2, 0, co2_ct);
        newest_ch4 = add_new(arr_CH4, arr_CH4_index, y_CH4_value, dps_CH4, 0, ch4_ct);
        newest_h2 = add_new(arr_H2, arr_H2_index, y_H2_value, dps_H2, 1, h2_ct);

        // updating legend text with  updated with y Value 
        chart.options.data[0].legendText = " LPG " + newest_lpg.toFixed(2) + " (ppm)";
        chart.options.data[1].legendText = " CO2 " + newest_co2.toFixed(2) + " (ppm)";
        chart.options.data[2].legendText = " CH4 " + newest_ch4.toFixed(2) + " (ppm)";
        chart.options.data[3].legendText = " H2 " + newest_h2.toFixed(2) + " (ppm)";
        chart.render();
    }
}
// generates first set of dataPoints 
updateChart();
setInterval(function () { updateChart() }, updateInterval);
