"use strict";

// Day target temperatures
temp_up.addEventListener('click', function(){
    target_temp +=0.10;
    if(target_temp_input.value >= 35)target_temp = 35;
    target_temp_input.value = parseFloat(target_temp).toFixed(2);
    send_data_to_mqtt("target_temp", parseFloat(target_temp).toFixed(2));
})
temp_down.addEventListener('click', function(){
    target_temp -=0.10;
    if(target_temp_input.value <= 0)target_temp = 0;
    target_temp_input.value = parseFloat(target_temp).toFixed(2);
    send_data_to_mqtt("target_temp", parseFloat(target_temp).toFixed(2));
})
hum_up.addEventListener('click', function(){
    target_hum +=0.10;
    if(target_hum_input.value >= 100)target_hum = 100;
    target_hum_input.value = parseFloat(target_hum).toFixed(2);
    send_data_to_mqtt("target_hum", parseFloat(target_hum).toFixed(2));
})
hum_down.addEventListener('click', function(){
    target_hum -=0.10;
    if(target_hum_input.value <= 20)target_hum = 20;
    target_hum_input.value = parseFloat(target_hum).toFixed(2);
    send_data_to_mqtt("target_hum", parseFloat(target_hum).toFixed(2));
})

// Night Target Temperatures
night_temp_up.addEventListener('click', function(){
    night_target_temp +=0.10;
    if(night_target_temp_input.value >= 35)night_target_temp = 35;
    night_target_temp_input.value = parseFloat(night_target_temp).toFixed(2);
    send_data_to_mqtt("night_target_temp", parseFloat(night_target_temp).toFixed(2));
})
night_temp_down.addEventListener('click', function(){
    night_target_temp -=0.10;
    if(night_target_temp_input.value <= 0)night_target_temp = 0;
    night_target_temp_input.value = parseFloat(night_target_temp).toFixed(2);
    send_data_to_mqtt("night_target_temp", parseFloat(night_target_temp).toFixed(2));
})
night_hum_up.addEventListener('click', function(){
    night_target_hum +=0.10;
    if(night_target_hum_input.value >= 100)night_target_hum = 100;
    night_target_hum_input.value = parseFloat(night_target_hum).toFixed(2);
    send_data_to_mqtt("night_target_hum", parseFloat(night_target_hum).toFixed(2));
})
night_hum_down.addEventListener('click', function(){
    night_target_hum -=0.10;
    if(night_target_hum_input.value <= 20)night_target_hum = 20;
    night_target_hum_input.value = parseFloat(night_target_hum).toFixed(2);
    send_data_to_mqtt("night_target_hum", parseFloat(night_target_hum).toFixed(2));
})

// Night start and finish times
night_hour_down.addEventListener('click', function(){
    night_start_hour -=1;
    if(night_hour_start_val.value <= 0)night_start_hour = 0;
    night_hour_start_val.value = night_start_hour;
    send_data_to_mqtt("night_hour_start", night_start_hour);
})
night_hour_up.addEventListener('click', function(){
    night_start_hour +=1;
    if(night_hour_start_val.value >= 23)night_start_hour = 23;
    night_hour_start_val.value = night_start_hour;
    send_data_to_mqtt("night_hour_start", night_start_hour);
})
night_minute_down.addEventListener('click', function(){
    night_start_minute -=1;
    if(night_minute_start_val.value <= 0)night_start_minute = 0;
    night_minute_start_val.value = night_start_minute;
    send_data_to_mqtt("night_minute_start", night_start_minute);
})
night_minute_up.addEventListener('click', function(){
    night_start_minute +=1;
    if(night_minute_start_val.value >= 59)night_start_minute = 59;
    night_minute_start_val.value = night_start_minute;
    send_data_to_mqtt("night_minute_start", night_start_minute);
})
night_hour_finish_down.addEventListener('click', function(){
    night_finish_hour -=1;
    if(night_hour_finish_val.value <= 0)night_finish_hour = 0;
    night_hour_finish_val.value = night_finish_hour;
    send_data_to_mqtt("night_hour_finish", night_finish_hour);
})
night_hour_finish_up.addEventListener('click', function(){
    night_finish_hour +=1;
    if(night_hour_finish_val.value >= 23)night_finish_hour = 23;
    night_hour_finish_val.value = night_finish_hour;
    send_data_to_mqtt("night_hour_finish", night_finish_hour);
})
night_minute_finish_down.addEventListener('click', function(){
    night_finish_minute -=1;
    if(night_minute_finish_val.value <= 0)night_finish_minute = 0;
    night_minute_finish_val.value = night_finish_minute;
    send_data_to_mqtt("night_minute_finish", night_finish_minute);
})
night_minute_finish_up.addEventListener('click', function(){
    night_finish_minute +=1;
    if(night_minute_finish_val.value >= 59)night_finish_minute = 59;
    night_minute_finish_val.value = night_finish_minute;
    send_data_to_mqtt("night_minute_finish", night_finish_minute);
})
