"use strict";


// Temperature PID buttons
temp_p_up.addEventListener('click', function(){
    temp_p +=0.01;
    temp_p_input_val.value = parseFloat(temp_p).toFixed(2);
    send_data_to_mqtt("temp_P", parseFloat(temp_p).toFixed(2));
})
temp_p_down.addEventListener('click', function(){
    temp_p -=0.01;
    if(temp_p <= 0)temp_p = 0;
    temp_p_input_val.value = parseFloat(temp_p).toFixed(2);
    send_data_to_mqtt("temp_P", parseFloat(temp_p).toFixed(2));
})
temp_i_up.addEventListener('click', function(){
    temp_i +=0.01;
    temp_i_input_val.value = parseFloat(temp_i).toFixed(2);
    send_data_to_mqtt("temp_I", parseFloat(temp_i).toFixed(2));
})
temp_i_down.addEventListener('click', function(){
    temp_i -=0.01;
    if(temp_i <= 0)temp_i = 0;
    temp_i_input_val.value = parseFloat(temp_i).toFixed(2);
    send_data_to_mqtt("temp_I", parseFloat(temp_i).toFixed(2));
})
temp_d_up.addEventListener('click', function(){
    temp_d +=0.01;
    temp_d_input_val.value = parseFloat(temp_d).toFixed(2);
    send_data_to_mqtt("temp_D", parseFloat(temp_d).toFixed(2));
})
temp_d_down.addEventListener('click', function(){
    temp_d -=0.01;
    if(temp_d <= 0)temp_d = 0;
    temp_d_input_val.value = parseFloat(temp_d).toFixed(2);
    send_data_to_mqtt("temp_D", parseFloat(temp_d).toFixed(2));
})

// Temperature PID buttons
hum_p_up.addEventListener('click', function(){
    hum_p +=0.01;
    hum_p_input_val.value = parseFloat(hum_p).toFixed(2);
    send_data_to_mqtt("hum_P", parseFloat(hum_p).toFixed(2));
})
hum_p_down.addEventListener('click', function(){
    hum_p -=0.01;
    if(hum_p <= 0)hum_p = 0;
    hum_p_input_val.value = parseFloat(hum_p).toFixed(2);
    send_data_to_mqtt("hum_P", parseFloat(hum_p).toFixed(2));
})
hum_i_up.addEventListener('click', function(){
    hum_i +=0.01;
    hum_i_input_val.value = parseFloat(hum_i).toFixed(2);
    send_data_to_mqtt("hum_I", parseFloat(hum_i).toFixed(2));
})
hum_i_down.addEventListener('click', function(){
    hum_i -=0.01;
    if(hum_i <= 0)hum_i = 0;
    hum_i_input_val.value = parseFloat(hum_i).toFixed(2);
    send_data_to_mqtt("hum_I", parseFloat(hum_i).toFixed(2));
})
hum_d_up.addEventListener('click', function(){
    hum_d +=0.01;
    hum_d_input_val.value = parseFloat(hum_d).toFixed(2);
    send_data_to_mqtt("hum_D", parseFloat(hum_d).toFixed(2));
})
hum_d_down.addEventListener('click', function(){
    hum_d -=0.01;
    if(hum_d <= 0)hum_d = 0;
    hum_d_input_val.value = parseFloat(hum_d).toFixed(2);
    send_data_to_mqtt("hum_D", parseFloat(hum_d).toFixed(2));
})
