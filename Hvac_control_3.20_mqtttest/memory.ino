//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Write to EEPROM  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

void write_to_EEprom() {
  /*
    This function writes the variables to EEprom, using the (put) method only allows data to be written to memory
    if it has changed else it get ignored.
  */
  EEPROM.put(0, day_target_temp);
  EEPROM.put(4, day_target_hum);
  EEPROM.put(8, night_target_temp);
  EEPROM.put(16, night_target_hum);
  EEPROM.put(20, night_hour_start);
  EEPROM.put(24, night_minute_start);
  EEPROM.put(28, night_hour_finish);
  EEPROM.put(32, night_minute_finish);
  EEPROM.put(36, day_light_saving);
  EEPROM.put(40, tempPID.P);
  EEPROM.put(44, tempPID.I);
  EEPROM.put(48, tempPID.D);
  EEPROM.put(60, humPID.P);
  EEPROM.put(64, humPID.I);
  EEPROM.put(68, humPID.D);
  EEPROM.put(72, time_period);
  EEPROM.put(76, system_standby);
  EEPROM.put(80, skins);
}

void get_EEprom() {
  /*
    This function gets the variable values from EEprom, and asigned then to there set variable names.
  */
  EEPROM.get(0, day_target_temp);
  EEPROM.get(4, day_target_hum);
  EEPROM.get(8, night_target_temp);
  EEPROM.get(16, night_target_hum);
  EEPROM.get(20, night_hour_start);
  EEPROM.get(24, night_minute_start);
  EEPROM.get(28, night_hour_finish);
  EEPROM.get(32, night_minute_finish);
  EEPROM.get(36, day_light_saving);
  EEPROM.get(40, tempPID.P);
  EEPROM.get(44, tempPID.I);
  EEPROM.get(48, tempPID.D);
  EEPROM.get(60, humPID.P);
  EEPROM.get(64, humPID.I);
  EEPROM.get(68, humPID.D);
  EEPROM.get(72, time_period);
  EEPROM.get(76, system_standby);
  EEPROM.get(80, skins);
}
