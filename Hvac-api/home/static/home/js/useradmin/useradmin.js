"use strict";


const host_name = document.getElementById('host');
host_name.innerHTML = getCurrentUrlLocation();

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
            if(destination_id == 'daylight'){
                daylightSavingvalue(data);
            }
            if(destination_id == 'time_period_val'){
                time_period_value(data);
            }
            if(destination_id == 'skins'){
                skinValue(data);
            }
            else{
                Object.keys(data[0]).forEach(function(key){
                if(key == measurement){
                    if([key] == "time_period" || [key] == "daylight_saving"){}
                    else{
                        destination.innerHTML= capitalise(data[0][key]);
                    }
                }
            })
            }
        })
    })
    .catch(function(error){
        console.log('Request failed', error)
    })
}

let device_name = getData(URL_device, 'name', 'name');
let locat = getData(URL_device, 'location', 'location');
let softwareVer = getData(URL_device, 'software_version', 'software');
let macAdd = getData(URL_device, 'mac_address', 'mac');
let daylightsw = getData(URL_device, 'daylight_saving', 'daylight');
let time_period_val = getData(URL_device, 'time_period', 'time_period_val');
let skins = getData(URL_device, 'skin', 'skins');


setInterval(function(){
    // Call the api for new data every 10 seconds
    device_name = getData(URL_device, 'name', 'name');
    locat = getData(URL_device, 'location', 'location');
    softwareVer = getData(URL_device, 'software_version', 'software');
    macAdd = getData(URL_device, 'mac_address', 'mac');
    daylightsw = getData(URL_device, 'daylight_saving', 'daylight');
    time_period_val = getData(URL_device, 'time_period', 'time_period_val');
    skins = getData(URL_device, 'skin', 'skins');
},10000);