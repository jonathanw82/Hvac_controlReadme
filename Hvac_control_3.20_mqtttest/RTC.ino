void get_actual_date_time() {
  /*
    Get the date and time from the controllino real time clock,
    we then check to see if the user has set explicitly set day_light_saving mode to advance the hour
  */

  if (day_light_saving == 1)actualHour = Controllino_GetHour() + 1;         // check the summer time setting
  else actualHour = Controllino_GetHour();
  actualMinute = Controllino_GetMinute();
  actualSeconds = Controllino_GetSecond();
  actualDay = Controllino_GetDay();
  actualWeekday = Controllino_GetWeekDay();
  actualMonth = Controllino_GetMonth();
  actualYear = Controllino_GetYear();
  wdt_reset();

  currentHour = actualHour;
  currentMinute = actualMinute;
  currentSeconds = actualSeconds;
  currentDay = actualDay;
  currentWeekday = actualWeekday;
  currentMonth = actualMonth;
  currentYear = actualYear;
  previous_millis_seconds = 0;
}

void get_date_time() {
  /*
    This function is called every time through the loop to update the current time using internal millis, but as millis is not accurate
    for time keeping, every 12 hours the get_actual_date_time function is called to reduce the ammount of times the RTC is called, this will reduce time drift,
    if the current time is either 3:00:10 or 15:00:10 the get_actual_date_time will be called and the current times replaced with the actual times.
  */

  if (millis() - previous_millis_seconds >= 1000) {
    // Every second increase the currentSeconds by 1
    previous_millis_seconds = millis();
    currentSeconds ++;
    if (currentSeconds >= 60) {
      currentSeconds = 0;
      currentMinute ++;
      if (currentMinute >= 60) {
        currentHour ++;
        currentMinute = 0;
        if (currentHour >= 24)currentHour = 0;
      }
    }
    if (currentHour == 3 && currentMinute == 0 && currentSeconds > 10 || currentHour == 15 && currentMinute == 1 && currentSeconds > 10) get_actual_date_time();
    wdt_reset();
    Serial.print(currentHour);
    Serial.print(":");
    Serial.print(currentMinute);
    Serial.print(":");
    Serial.println(currentSeconds);
  }
}

void check_mode() {
  /*
    Get the time from the clock convert start and finish hours and minutes to seconds and add them together respectivly,
    we then subtract the night_mode_start from the current_time do modulo then compare the length of interval.
    To stop any negative numbers and whether the start is behind or in front of the end time we force the number
    positive by adding seconds_per_day.
  */
  current_time = (currentHour * 60l) * 60l  + (currentMinute * 60l) + currentSeconds;
  unsigned long hour_to_sec_start = (night_hour_start * 60l) * 60l ;
  unsigned long min_to_sec_start = night_minute_start * 60l;
  unsigned long night_mode_start = hour_to_sec_start + min_to_sec_start;
  unsigned long hour_to_sec_finish = (night_hour_finish * 60l) * 60l;
  unsigned long min_to_sec_finish = night_minute_finish * 60l;
  unsigned long night_mode_finish = hour_to_sec_finish + min_to_sec_finish;
  wdt_reset();
  long interval = (night_mode_finish - night_mode_start + seconds_per_day) % seconds_per_day;
  bool is_in_night_mode = ((current_time - night_mode_start + seconds_per_day) % seconds_per_day) < interval;

  /*
    If is_in_night_mode is true we set the targets and differentials accordingly.
  */

  if (is_in_night_mode) {
    night = 1;
    target_temp = night_target_temp;
    target_hum = night_target_hum;

  } else {
    night = 0;
    target_temp = day_target_temp;
    target_hum = day_target_hum;
  }
}
