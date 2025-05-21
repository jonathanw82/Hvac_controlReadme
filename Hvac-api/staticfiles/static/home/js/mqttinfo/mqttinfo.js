"use strict";

moveClock();

const table = document.getElementById('table_data');

const keyword = ['temp_P', 'temp_I', 'temp_D', 'target_temp', 'night_target_temp', 'time_period', 'night_hour_start', 'night_minute_start', 'night_hour_finish', 'night_minute_finish',
                'hum_P', 'hum_I', 'hum_D','target_hum', 'night_target_hum' ,'reset', 'standby'];
const type = ['float', 'float', 'float', 'float', 'float','int', 'int', 'int', 'int', 'int', 'float', 'float', 'float', 'float', 'float','string', 'string'];
const options = ['Any', 'Any', 'Any', '0-35', '0-35', 'Any', '0-23', '0-59', '0-23', '0-59', 'Any', 'Any', 'Any', '20-100', '20-100', 'reset', 'standby'];

for(let i = 0; i < keyword.length; i++){
  table.innerHTML += `<tr><td>${keyword[i]}</td><td>${type[i]}</td><td>${options[i]}</td><tr>`;
};
