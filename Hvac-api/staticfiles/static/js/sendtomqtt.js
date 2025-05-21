"use strict";


function send_data_to_mqtt(topic, payload){
    /*
        Send data to Mqtt from the front end
    */

    let val = payload;
    let data = JSON.stringify({topic: topic, payload:val});

    fetch(send_mqtt_url,
    {
        method:"POST",
        body:data,
        headers: {
            "Content-Type": "application/json"
          },
    })
    .then(data => console.log(data))
    .catch(error => console.log('Request failed', error));
}


function capitalise(word) {
    // Capitaise the first letter of a word
    let capitalisedword = word.charAt(0).toUpperCase() + word.slice(1);
    return capitalisedword;
}
