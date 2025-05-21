"use strict";

const URL_last = getCurrentUrlLocation()+"/api/last_measurement/";
const URL_bool = getCurrentUrlLocation()+"/api/bool_measurements/";
const URL_float = getCurrentUrlLocation()+"/api/float_measurements/";
const URL_int  = getCurrentUrlLocation()+"/api/int_measurements/";
const URL_device = getCurrentUrlLocation()+"/api/hvac_controllers/";
const URL_avgraph = getCurrentUrlLocation()+"/api/graph_data/";
const send_mqtt_url = getCurrentUrlLocation()+"/api/send_mqtt_message/";


function getCurrentUrlLocation(){
    /*
        Dynamically get and Return the current page url
    */
    let host = window.location.protocol + "//" + window.location.host;
    return host;
}