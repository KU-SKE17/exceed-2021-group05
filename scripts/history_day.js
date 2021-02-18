window.onload = function () {

    var dps_LPG = [];
    var dps_CO2 = [];
    var dps_CH4 = [];
    var dps_H2 = [];
    
    var chart = new CanvasJS.Chart("chartContainer", {
        zoomEnabled: true,
        title: {text: "air quality"},
        axisX: {title: "chart updates every 1 day"},
        axisY:{posfix: "ppm"}, 
        toolTip: {shared: true},
        legend: {cursor:"pointer",verticalAlign: "top",fontSize: 22,fontColor: "dimGrey",itemclick : toggleDataSeries},
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
            name: "CO2" ,
            dataPoints: dps_CO2
            },
            {				
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "####.00 (ppm)",
            showInLegend: true,
            name: "CH4" ,
            dataPoints: dps_CH4
            },
            {				
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "####.00 (ppm)",
            showInLegend: true,
            name: "H2" ,
            dataPoints: dps_H2
            }
        ]
    });
    
    function toggleDataSeries(e) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible)
        {
            e.dataSeries.visible = false;
        }
        else 
        {
            e.dataSeries.visible = true;
        }
        chart.render();
    }
    
    //update time
    var updateInterval = 1000;
    
    var time = new Date();
    var now = time.getHours();
    
    //set sec to day
    var index_to_day = (24-now)*3600000;
    var ct = 0;
    function add_new(arr_temp, arr_index, yValue, dps_arr, check_time)
    {
        var temp = 0;
        arr_temp.push(yValue);
        for(var i = arr_index; i < arr_temp.length; i++)
        {
            temp += arr_temp[i];
        }
        temp /= arr_temp.length-arr_index;
        dps_arr.pop();
        dps_arr.push({x: time.getTime(),y: temp});
    
        if(ct % index_to_day == 0) 
        {
            time.setTime(time.getTime()+ updateInterval*index_to_day);
            dps_arr.push({x: time.getTime(),y: temp});
            arr_index += index_to_day;
            if(check_time == 0) time.setTime(time.getTime()- updateInterval*index_to_day);
            ct = 0;
        }
        else
        {
            time.setTime(time.getTime());
        }
    }
    
    
    // initial value
    var y_LPG_value = 1099;
    var y_CO2_value = 999;
    var y_CH4_value = 810; 
    var y_H2_value = 786;
    
    //data array
    var arr_LPG_raw = [789,879,799,856,955,459,765,985,985,563];
    var arr_CO2_raw = [789,989,799,785,955,485,765,985,354,563];
    var arr_CH4_raw = [789,879,983,856,492,459,765,985,985,563];
    var arr_H2_raw = [789,879,799,856,955,561,765,985,985,999];
    
    var arr_LPG = [], arr_LPG_index = 0;
    var arr_CO2 = [], arr_CO2_index = 0;
    var arr_CH4 = [], arr_CH4_index = 0;
    var arr_H2 = [], arr_H2_index = 0;
    
    //set old_raw to dps
    for(var i=0; i<arr_LPG_raw.length; i++)
    {
        ct++;
        add_new(arr_LPG, arr_LPG_index, arr_LPG_raw[i], dps_LPG, 0);
        add_new(arr_CO2, arr_CO2_index, arr_CO2_raw[i], dps_CO2, 0);
        add_new(arr_CH4, arr_CH4_index, arr_CH4_raw[i], dps_CH4, 0);
        add_new(arr_H2, arr_H2_index, arr_H2_raw[i], dps_H2, 1);
    }
    
    function updateChart() 
    {
        ///
        //random
        var deltaY1, deltaY2, deltaY3, deltaY4;
    
        deltaY1 = 5 + Math.random() *(-5-5);
        deltaY2 = 5 + Math.random() *(-5-5);
        deltaY3 = 5 + Math.random() *(-5-5);
        deltaY4 = 5 + Math.random() *(-5-5);
    
        // adding random value and rounding it to two digits. 
        y_LPG_value = Math.round((y_LPG_value + deltaY1)*100)/100;
        y_CO2_value = Math.round((y_CO2_value + deltaY2)*100)/100;
        y_CH4_value = Math.round((y_CH4_value + deltaY3)*100)/100;
        y_H2_value = Math.round((y_H2_value + deltaY4)*100)/100;
    
        ///
    
    
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
    setInterval(function(){updateChart()}, updateInterval);
    
    }