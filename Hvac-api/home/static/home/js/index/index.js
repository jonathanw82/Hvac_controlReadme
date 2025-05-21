"use strict";

let target_temp;
let target_hum;
let night_target_temp;
let night_target_hum;
let night_day;
let temp_heat_output;
let temp_cooling_output;
let temperature;
let humidity;
let humidifier_output_val;
let dehumidifier_output_val;
let night_start_hour;
let night_start_minute;
let night_finish_hour;
let night_finish_minute;

const hum = document.getElementById('hum');
const temp = document.getElementById('temp');
const day_night_icon = document.getElementById('day_night_icon');
const target_temp_input = document.getElementById('target_temp_val');
const target_hum_input = document.getElementById('target_hum_val');
const night_target_temp_input = document.getElementById('night_target_temp_val');
const night_target_hum_input = document.getElementById('night_target_hum_val');
const status_icon = document.getElementById('status_icon');
const night_timeings = document.getElementById('night_timeings');
const night_hour_start_val = document.getElementById('night_hour_start_val');
const night_minute_start_val = document.getElementById('night_minute_start_val');
const night_hour_finish_val = document.getElementById('night_hour_finish_val');
const night_minute_finish_val = document.getElementById('night_minute_finish_val');
const hum_icon = document.getElementById('hum_icon');

function getLiveLastData(url, type , measurement){
    /*
        get the last value recoded
    */
    fetch(url + type + "/" + measurement + "/")
        .then(function(response){
        response.json()
            .then(function(data){
                returned_live_data(data);
        })
    })
    .catch(function(error){
        console.log('Request failed', error)
    })
}

function getData(url, type, inputs){
    /*
        Get static data from api and send it to time sensative functions to update the frontend
    */
    fetch(url)
    .then(function(response){
        response.json()
        .then(function(data){
            if(url == URL_float)returnedFloatData(data);
            else if (url == URL_int)returnedIntData(data);
            else if (url == URL_device){
                if(type == 'bool'){
                    returned_device_bool_Data(data);
                }else if(type == 'float'){
                    returned_device_float_Data(data);
                }
            }
            if(inputs == 'buttons')returned_button_data(data);
            else if(inputs == 'input_values')returned_device_float_input_val_data(data);
        })
    })
    .catch(function(error){
        console.log('Request failed', error)
    })
}


let live_temp = getLiveLastData(URL_last, 'float', 'temp');
let live_hum = getLiveLastData(URL_last, 'float', 'hum');
let heating_output = getLiveLastData(URL_last, 'bool', 'temp_heat_output');
let cooling_output = getLiveLastData(URL_last, 'bool', 'temp_cooling_output');
let hum_output = getLiveLastData(URL_last, 'bool', 'humidifier_output');
let dehum_output = getLiveLastData(URL_last, 'bool', 'dehumidifier_output');

setInterval(function(){
    // Call the api for new data every 2 seconds
    live_temp = getLiveLastData(URL_last, 'float', 'temp', 'temp');
    live_hum = getLiveLastData(URL_last, 'float', 'hum', 'hum');
    heating_output = getLiveLastData(URL_last, 'bool', 'temp_heat_output');
    cooling_output = getLiveLastData(URL_last, 'bool', 'temp_cooling_output');
    hum_output = getLiveLastData(URL_last, 'bool', 'humidifier_output');
    dehum_output = getLiveLastData(URL_last, 'bool', 'dehumidifier_output');
},2000);

let status_day_night_icon = getData(URL_device, 'bool');
let float_data = getData(URL_device, "float");
let float_input_data = getData(URL_device, "float", 'buttons');
let float_input_value_data = getData(URL_device, "float", 'input_values');

setInterval(function(){
    // Call the api for new data every 5 seconds
    status_day_night_icon = getData(URL_device, 'bool');
    float_data = getData(URL_device, "float");
},5000);

setInterval(function(){
    // update the button inputs every 20 seconds
    float_input_data = getData(URL_device, "float", 'buttons');
    float_input_value_data = getData(URL_device, "float", 'input_values');
},20000);

function returned_live_data(data){

    // Temperataure and hunidity
    if(data.measurement_type == 'temp'){
        temp.innerHTML = data.value.toFixed(2);
        temperature = data.value.toFixed(2); // fixes all floats to 2 decimal places to stop numbers less that .1 only showing half the number
    }
    else if(data.measurement_type == 'hum'){
        hum.innerHTML = data.value.toFixed(2);
        humidity = data.value.toFixed(2);
    }

    // change the icons when heating or cooling
    if(data.measurement_type == 'temp_heat_output'){
        temp_heat_output = data.value;
    }
    else if(data.measurement_type == 'temp_cooling_output'){
        temp_cooling_output = data.value;
    }

    if(temp_heat_output == true && temp_cooling_output == false){
        status_icon.innerHTML = `<img class='status_icon' src="static/images/heat.png" alt="heat icon">`;
        if(dehumidifier_output_val == true){
            hum_icon.classList.add('icon_fade');
        }else{
            hum_icon.classList.remove('icon_fade');
        }
    }
    else if(temp_heat_output == false && temp_cooling_output == true){
        status_icon.innerHTML = `<img class='status_icon' src="static/images/cool.png" alt="cool icon">`;
        if(dehumidifier_output_val == true){
            hum_icon.classList.add('icon_fade');
        }else{
            hum_icon.classList.remove('icon_fade');
        }
    }
    else{
        status_icon.innerHTML = `<img class='status_icon' src="static/images/idle.png" alt="idle icon">`;
        hum_icon.classList.remove('icon_fade');
    }

    // change the icons when humidifing or dehumidifing
    if(data.measurement_type == 'humidifier_output'){
        humidifier_output_val = data.value;
    }
    else if(data.measurement_type == 'dehumidifier_output'){
        dehumidifier_output_val = data.value;
    }

    if(humidifier_output_val == true && dehumidifier_output_val == false){
        hum_icon.innerHTML = `<img class='hum_icon' src="static/images/hum.png" alt="hum icon">`
    }
    else if(humidifier_output_val == false && dehumidifier_output_val == true){
        hum_icon.innerHTML = `<img class='hum_icon' src="static/images/dehum.png" alt="dehum icon">`
    }
    else{
        hum_icon.innerHTML = `<img class='hum_icon' src="static/images/idle.png" alt="idle icon">`
    }

}


function returned_device_bool_Data(data){
    Object.keys(data[0]).forEach(function(key){
        if(key == "night_day")night_day = data[0][key];
    })
    if(night_day == false)day_night_icon.innerHTML = `<img class='day_night_icon' src="static/images/day.png" alt="day icon">`
    else day_night_icon.innerHTML = `<img class='day_night_icon' src="static/images/night.png" alt="day icon">`
}

function returned_device_float_Data(data){
    Object.keys(data[0]).forEach(function(key){
        if(key == "night_start_hour")night_start_hour = data[0][key];
        if(key == "night_start_minute")night_start_minute = data[0][key];
        if(key == "night_finish_hour")night_finish_hour = data[0][key];
        if(key == "night_finish_minute")night_finish_minute = data[0][key];
    })

    night_timeings.innerHTML = `<div>Night Start: <b>${night_start_hour}:${night_start_minute < 10 ? '0' + night_start_minute :night_start_minute}</b>
                                Finish: <b>${night_finish_hour}:${night_finish_minute < 10 ? '0' + night_finish_minute :night_finish_minute}</b></div>`;
}

function returned_device_float_input_val_data(data){
    Object.keys(data[0]).forEach(function(key){
        if(key == "night_start_hour")night_start_hour = data[0][key];
        if(key == "night_start_minute")night_start_minute = data[0][key];
        if(key == "night_finish_hour")night_finish_hour = data[0][key];
        if(key == "night_finish_minute")night_finish_minute = data[0][key];
    })

    night_hour_start_val.value = night_start_hour;
    night_minute_start_val.value = night_start_minute;
    night_hour_finish_val.value = night_finish_hour;
    night_minute_finish_val.value = night_finish_minute;
}

function returned_button_data(data){
    // update the button inputs incase thay have changed
    Object.keys(data[0]).forEach(function(key){
        if(key == "target_temp")target_temp = data[0][key];
        if(key == "target_hum")target_hum = data[0][key];
        if(key == "night_target_temp")night_target_temp = data[0][key];
        if(key == "night_target_hum")night_target_hum = data[0][key];
    })

    target_temp_input.value = parseFloat(target_temp).toFixed(2);
    target_hum_input.value = parseFloat(target_hum).toFixed(2);
    night_target_temp_input.value = parseFloat(night_target_temp).toFixed(2);
    night_target_hum_input.value = parseFloat(night_target_hum).toFixed(2);
}