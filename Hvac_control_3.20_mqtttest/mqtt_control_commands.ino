
//~~~~~~~~~~~~~~~~~~~~~~~~ Control commands ~~~~~~~~~~~~~~~~~~~~~~~~~~
void hvac_control_commands(char* topic, char* payload, int payload_length) {

  if (str_startwith(topic, "Workshop/sub/temp_P")) {
    tempPID.P = payloadCovertedToFloat(payload, payload_length);
    write_to_EEprom();
  }
  if (str_startwith(topic, "Workshop/sub/temp_I")) {
    tempPID.I = payloadCovertedToFloat(payload, payload_length);
    tempPID.I_response = 0;
    write_to_EEprom();
  }
  if (str_startwith(topic, "Workshop/sub/temp_D")) {
    tempPID.D = payloadCovertedToFloat(payload, payload_length);
    write_to_EEprom();
  }
  if (str_startwith(topic, "Workshop/sub/target_temp")) {
    day_target_temp = payloadCovertedToFloat(payload, payload_length);
    write_to_EEprom();
  }
  if (str_startwith(topic, "Workshop/sub/night_target_temp")) {
    night_target_temp = payloadCovertedToFloat(payload, payload_length);
    write_to_EEprom();
  }
  if (str_startwith(topic, "Workshop/sub/time_period")) {
    time_period = payloadCovertedToFloat(payload, payload_length);
    write_to_EEprom();
  }
  if (str_startwith(topic, "Workshop/sub/daylight_saving")) {
    day_light_saving = payloadCovertedToFloat(payload, payload_length);
    write_to_EEprom();
    get_actual_date_time();
  }
  if (str_startwith(topic, "Workshop/sub/night_hour_start")) {
    night_hour_start = payloadCovertedToFloat(payload, payload_length);
    write_to_EEprom();
  }
  if (str_startwith(topic, "Workshop/sub/night_minute_start")) {
    night_minute_start = payloadCovertedToFloat(payload, payload_length);
    write_to_EEprom();
  }
  if (str_startwith(topic, "Workshop/sub/night_hour_finish")) {
    night_hour_finish = payloadCovertedToFloat(payload, payload_length);
    write_to_EEprom();
  }
  if (str_startwith(topic, "Workshop/sub/night_minute_finish")) {
    night_minute_finish = payloadCovertedToFloat(payload, payload_length);
    write_to_EEprom();
  }
  if (str_startwith(topic, "Workshop/sub/hum_P")) {
    humPID.P = payloadCovertedToFloat(payload, payload_length);
    write_to_EEprom();
  }
  if (str_startwith(topic, "Workshop/sub/hum_I")) {
    humPID.I = payloadCovertedToFloat(payload, payload_length);
    humPID.I_response = 0;
    write_to_EEprom();
  }
  if (str_startwith(topic, "Workshop/sub/hum_D")) {
    humPID.D = payloadCovertedToFloat(payload, payload_length);
    write_to_EEprom();
  }
  if (str_startwith(topic, "Workshop/sub/target_hum")) {
    day_target_hum = payloadCovertedToFloat(payload, payload_length);
    write_to_EEprom();
  }
  if (str_startwith(topic, "Workshop/sub/night_target_hum")) {
    night_target_hum = payloadCovertedToFloat(payload, payload_length);
    write_to_EEprom();
  }
  if (str_startwith(topic, "Workshop/sub/skins")) {
    skins = payloadCovertedToFloat(payload, payload_length);
    write_to_EEprom();
  }
  if (str_startwith(topic, "Workshop/sub/reset")) {
    Serial.print("Reset");
    delay(2500);
  }
  if (str_startwith(topic, "Workshop/sub/standby")) {
    system_standby = payloadCovertedToFloat(payload, payload_length);
    write_to_EEprom();
  }
}
