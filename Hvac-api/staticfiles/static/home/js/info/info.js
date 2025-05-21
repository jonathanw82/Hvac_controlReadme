"use strict";

moveClock();

function getData(url, measurement, destination_id){
    /*
        Get static data every 10 seconds
    */
    let destination = document.getElementById(destination_id);
    fetch(url)
    .then(function(response){
        response.json()
        .then(function(data){
            Object.keys(data[0]).forEach(function(key){
                if(key == measurement){
                    if(typeof data[0][key] == "string"){
                        destination.innerHTML= capitalise(data[0][key]);
                    }else{
                        destination.innerHTML= data[0][key].toFixed(2);
                    }
                }
            })
        })
    })
    .catch(function(error){
        console.log('Request failed', error)
    })
}

let device_name = getData(URL_device, 'name', 'name');
let locat = getData(URL_device, 'location', 'location');
let softwareVer = getData(URL_device, 'software_version', 'software');
let target_temp = getData(URL_device, 'target_temp', 'target_temp');
let target_hum = getData(URL_device, 'target_hum', 'target_hum');

function capitalise(word) {
    // Capitaise the first letter of a word
    let capitalisedword = word.charAt(0).toUpperCase() + word.slice(1);
    return capitalisedword;
}

function getLiveData(url, type , measurement, destination_id){
    /*
        We use the arguements url, type, measurement and destination to fetch data from the
        api. using the url, type and measurement to build the endpoint url for the fetch function.
        the destination is used so that the getdata function can place the data in the html.
    */
    let destination = document.getElementById(destination_id);
    fetch(url + type + "/" + measurement + "/")
    .then(function(response){
        response.json()
        .then(function(data){
            if(type == "float"){
                let value = data.value;
                if(value == null) value = 0;
                if(measurement == 'hum_heat_time_on'){
                    if(value < 100){
                        destination.innerHTML = value;
                        destination.innerHTML += `<span style="font-weight:400"> seconds</span>`;
                    }else{
                        destination.innerHTML = value.toFixed(2);
                    }
                }
                else if(measurement == 'temp_heat_time_on'){
                    if(value < 100){
                        destination.innerHTML = value;
                        destination.innerHTML += `<span style="font-weight:400"> seconds</span>`;
                    }else{
                        destination.innerHTML = value.toFixed(2);
                    }
                }
                else{
                    destination.innerHTML = value.toFixed(2); // fixes all floats to 2 decimal places to stop numbers less that .1 only showing half the number;
                }
            }
            if(type == "bool"){
                Status(data);
            }
        })
    })
    .catch(function(error){
        console.log('Request failed', error)
    })
}

let live_error_temp = getLiveData(URL_last, 'float', 'error_temp', 'error_temp');
let live_error_hum = getLiveData(URL_last, 'float', 'error_hum', 'error_hum');
let live_temp_p_response = getLiveData(URL_last, 'float', 'temp_p_response', 'temp_p_response');
let live_temp_i_response = getLiveData(URL_last, 'float', 'temp_i_response', 'temp_i_response');
let live_temp_d_response = getLiveData(URL_last, 'float', 'temp_d_response', 'temp_d_response');
let live_temp_pid_error = getLiveData(URL_last, 'float', 'temp_pid_error', 'temp_pid_error');
let live_temp_heat_time_on = getLiveData(URL_last, 'float', 'temp_heat_time_on', 'temp_heat_time_on');
let live_hum_p_response = getLiveData(URL_last, 'float', 'hum_p_response', 'hum_p_response');
let live_hum_i_response = getLiveData(URL_last, 'float', 'hum_i_response', 'hum_i_response');
let live_hum_d_response = getLiveData(URL_last, 'float', 'hum_d_response', 'hum_d_response');
let live_hum_pid_error = getLiveData(URL_last, 'float', 'hum_pid_error', 'hum_pid_error');
let live_temp_pid_output = getLiveData(URL_last, 'float', 'temp_pid_output', 'temp_pid_output');
let live_hum_pid_output = getLiveData(URL_last, 'float', 'hum_pid_output', 'hum_pid_output');
let live_hum_heat_time_on = getLiveData(URL_last, 'float', 'hum_heat_time_on', 'hum_heat_time_on');
let live_temp = getLiveData(URL_last, 'float', 'temp', 'temp');
let live_hum = getLiveData(URL_last, 'float', 'hum', 'hum');
let heating_output = getLiveData(URL_last, 'bool', 'temp_heat_output');
let cooling_output = getLiveData(URL_last, 'bool', 'temp_cooling_output');
let hum_output = getLiveData(URL_last, 'bool', 'humidifier_output');
let dehum_output = getLiveData(URL_last, 'bool', 'dehumidifier_output');

setInterval(function(){
    //Call the api for new data every 2 seconds
    live_error_temp = getLiveData(URL_last, 'float', 'error_temp', 'error_temp');
    live_error_hum = getLiveData(URL_last, 'float', 'error_hum', 'error_hum');
    live_temp_p_response = getLiveData(URL_last, 'float', 'temp_p_response', 'temp_p_response');
    live_temp_i_response = getLiveData(URL_last, 'float', 'temp_i_response', 'temp_i_response');
    live_temp_d_response = getLiveData(URL_last, 'float', 'temp_d_response', 'temp_d_response');
    live_temp_pid_error = getLiveData(URL_last, 'float', 'temp_pid_error', 'temp_pid_error');
    live_temp_heat_time_on = getLiveData(URL_last, 'float', 'temp_heat_time_on', 'temp_heat_time_on');
    live_hum_p_response = getLiveData(URL_last, 'float', 'hum_p_response', 'hum_p_response');
    live_hum_i_response = getLiveData(URL_last, 'float', 'hum_i_response', 'hum_i_response');
    live_hum_d_response = getLiveData(URL_last, 'float', 'hum_d_response', 'hum_d_response');
    live_hum_pid_error = getLiveData(URL_last, 'float', 'hum_pid_error', 'hum_pid_error');
    live_hum_pid_output = getLiveData(URL_last, 'float', 'hum_pid_output', 'hum_pid_output');
    live_hum_pid_output = getLiveData(URL_last, 'float', 'hum_pid_output', 'hum_pid_output');
    live_hum_heat_time_on = getLiveData(URL_last, 'float', 'hum_heat_time_on', 'hum_heat_time_on')
    live_temp = getLiveData(URL_last, 'float', 'temp', 'temp');
    live_hum = getLiveData(URL_last, 'float', 'hum', 'hum');
    heating_output = getLiveData(URL_last, 'bool', 'temp_heat_output');
    cooling_output = getLiveData(URL_last, 'bool', 'temp_cooling_output');
    hum_output = getLiveData(URL_last, 'bool', 'humidifier_output');
    dehum_output = getLiveData(URL_last, 'bool', 'dehumidifier_output');
    target_temp = getData(URL_device, 'target_temp', 'target_temp');
    target_hum = getData(URL_device, 'target_hum', 'target_hum');
},2000);


function Status(data){

    let heatingVal;
    let coolingVal;
    let deHumVal;
    let humVal;
    let statusHeatVal = document.getElementById("temp_state");
    let statusHumVal = document.getElementById("hum_state");    
   

    if(data.measurement_type == "temp_heat_output"){
       heatingVal = data.value;
        if(heatingVal)statusHeatVal.innerHTML = "Heating";
    }
    else if(data.measurement_type == "temp_cooling_output"){
        coolingVal = data.value;
        if(coolingVal)statusHeatVal.innerHTML = "Cooling";
    }

    else if(data.measurement_type == "humidifier_output"){
        humVal = data.value;
        if(humVal)statusHumVal.innerHTML = "Humidifying";
    }
    else if(data.measurement_type == "dehumidifier_output"){
        deHumVal = data.value;
        if(deHumVal)statusHumVal.innerHTML = "Dehumidifying";
    }
}