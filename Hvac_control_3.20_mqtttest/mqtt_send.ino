//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Publish mqtt data ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class GetSet {
  public:
    GetSet(String topic) {
      internal_topic = topic;
    }
    void set_float(float x, bool j) {
      is_retain(j);
      if (x != float_val || initial_message_send) {
        float_val = x;
        mqtt_client.publish(internal_topic, String(float_val), is_retained, 0);
        initial_message_send = false;
        Serial.println(internal_topic + " " + float_val);
      }
    }
    void set_int(int x, bool j) {
      is_retain(j);
      if (x != int_val || initial_message_send) {
        int_val = x;
        mqtt_client.publish(internal_topic, String(int_val), is_retained, 0);
        initial_message_send = false;
        Serial.println(internal_topic + " " + int_val);
      }
    }
    void set_string(String x, bool j) {
      is_retain(j);
      if (x != string_val || initial_message_send) {
        string_val = x;
        mqtt_client.publish(internal_topic, String(string_val), is_retained, 0);
        initial_message_send = false;
        Serial.println(internal_topic + " " + string_val);
      }
    }
    void set_bool(bool x, bool j) {
      is_retain(j);
      if (x !=  bool_val || initial_message_send) {
        bool_val = x;
        mqtt_client.publish(internal_topic, String(bool_val), is_retained, 0);
        initial_message_send = false;
        Serial.println(internal_topic + " " + bool_val);
      }
    }
    void is_retain(bool j) {
      if (j) is_retained = true;
      else is_retained = false;
    }
    int get() {
      return get_val;
    }
  private:
    int get_val;
    float float_val;
    int int_val;
    String internal_topic;
    String string_val;
    bool bool_val;
    bool is_retained;
    bool initial_message_send = true;
};

//~~~~~~~~~~~~~ Create path for Mqtt messages with the mac address ~~~~~~~~~

String path = PUBLISH_PATH + MAC_ADDRESS + "/";    // path for mqtt messages with correct Mac address

// temp
GetSet temperature_PID_P(path + "temp" + "/" + "temp_P");
GetSet temperature_PID_I(path + "temp" + "/" + "temp_I");
GetSet temperature_PID_D(path + "temp" + "/" + "temp_D");
GetSet temperature_P_response(path + "temp" + "/" + "temp_P_response");
GetSet temperature_I_response(path + "temp" + "/" + "temp_I_response");
GetSet temperature_D_response(path + "temp" + "/" + "temp_D_response");
GetSet temperature(path + "temp" + "/" + "temp");
GetSet temperature_target(path + "temp" + "/" + "day_target_temp");
GetSet temperature_target_night(path + "temp" + "/" + "night_target_temp");
GetSet temperature_error(path + "temp" + "/" + "temp_error");
GetSet temperature_output(path + "temp" + "/" + "temp_output");
GetSet temperature_heat_on(path + "temp" + "/" + "heat_time_On");
GetSet temperature_heat_off(path + "temp" + "/" + "heat_time_Off");
GetSet temperature_heat_pin_state(path + "temp" + "/" + "heating_output");
GetSet temperature_cooling_pin_state(path + "temp" + "/" + "cooling_output");
// hum
GetSet humidity_PID_P(path + "hum" + "/" + "hum_P");
GetSet humidity_PID_I(path + "hum" + "/" + "hum_I");
GetSet humidity_PID_D(path + "hum" + "/" + "hum_D");
GetSet humidity_P_response(path + "hum" + "/" + "P_response");
GetSet humidity_I_response(path + "hum" + "/" + "I_response");
GetSet humidity_D_response(path + "hum" + "/" + "D_response");
GetSet humidity(path + "hum" + "/" + "hum");
GetSet humidity_target(path + "hum" + "/" + "day_target_hum");
GetSet humidity_target_night(path + "hum" + "/" + "night_target_hum");
GetSet humidity_error(path + "hum" + "/" + "hum_error");
GetSet humidity_output(path + "hum" + "/" + "hum_output");
GetSet humidity_heat_on(path + "hum" + "/" + "hum_time_On");
GetSet humidity_heat_off(path + "hum" + "/" + "hum_time_Off");
GetSet humidity_heat_pin_state(path + "hum" + "/" + "humidifier_output");
GetSet humidity_cooling_pin_state(path + "hum" + "/" + "dehumidifier_output");
// error feedback
GetSet temp_error_sensor_feedback(path + "error_feedback" + "/" + "error_temp");
GetSet hum_error_sensor_feedback(path + "error_feedback" + "/" + "error_hum");
// mode
GetSet controller_device_name(path + "mode" + "/" + "device_name");
GetSet device_software_ver(path + "mode" + "/" + "software_ver");
GetSet device_daylight_saving(path + "mode" + "/" + "daylight_saving");
GetSet day_night_mode(path + "mode" + "/" + "night_day");
GetSet night_start_hour(path + "mode" + "/" + "night_start_hour");
GetSet night_start_minute(path + "mode" + "/" + "night_start_minute");
GetSet night_finish_hour(path + "mode" + "/" + "night_finish_hour");
GetSet night_finish_minute(path + "mode" + "/" + "night_finish_minute");
GetSet pid_time_period(path + "mode" + "/" + "time_on_off_period");
// location
GetSet device_location(path + "location" + "/" + "location");
// standby
GetSet device_standby(path + "standby" + "/" + "standby");
// skins 
GetSet frontend_skin(path + "mode" + "/" + "skin");

void Mqtt_publish() {

  float temp_error_val = target_temp - temp;
  float hum_error_val = target_hum - hum;

  if (millis() - prev_mqtt_send_time > 1000) {
    prev_mqtt_send_time = millis();
    next_reading--;
    mqtt_time_loop_counter ++;
    if (next_reading < 0)next_reading = 4;
  }

  // Temp
  if (!system_standby) {
    if (mqtt_client.connected()){
      temperature_PID_P.set_float(tempPID.P, true);
      temperature_PID_I.set_float(tempPID.I, true);
      temperature_PID_D.set_float(tempPID.D, true);
      temperature_P_response.set_float(tempPID.P_response, false);
      temperature_I_response.set_float(tempPID.I_response, false);
      temperature_D_response.set_float(tempPID.D_response, false);
      temperature.set_float(temp, false);
      temperature_target.set_float(target_temp, true);
      temperature_error.set_float(temp_error_val, false);
      temperature_output.set_float(temp_output, false);
      temperature_heat_on.set_int(heat_on_time, false);
      temperature_heat_off.set_int(heat_off_time, false);
      temperature_heat_pin_state.set_bool(check_pin_state(heat), true);
      temperature_cooling_pin_state.set_bool(check_pin_state(cooling), true);
      // Hum
      humidity_PID_P.set_float(humPID.P, true);
      humidity_PID_I.set_float(humPID.I, true);
      humidity_PID_D.set_float(humPID.D, true);
      humidity_P_response.set_float(humPID.P_response, false);
      humidity_I_response.set_float(humPID.I_response, false);
      humidity_D_response.set_float(humPID.D_response, false);
      humidity.set_float(hum, false);
      humidity_target.set_float(target_hum, true);
      humidity_error.set_float(hum_error_val, false);
      humidity_output.set_float(hum_output, false);
      humidity_heat_on.set_int(hum_on_time, false);
      humidity_heat_off.set_int(hum_off_time, false);
      humidity_heat_pin_state.set_bool(check_pin_state(humidifier), true);
      humidity_cooling_pin_state.set_bool(check_pin_state(dehum), true);
      temperature_target_night.set_float(night_target_temp, true);
      humidity_target_night.set_float(night_target_hum, true);

      if (initial_message_delay == false) {
        if (millis() - prev_mqtt_send > send_interval) {
          prev_mqtt_send = millis();
          temp_error_sensor_feedback.set_float(temp_error_sensor, false);
          hum_error_sensor_feedback.set_float(hum_error_sensor, false);
          controller_device_name.set_string(DEVICE_NAME, true);
          device_software_ver.set_string(software_ver, true);
          device_daylight_saving.set_int(day_light_saving, true);
          day_night_mode.set_int(night, true);
          night_start_hour.set_int(night_hour_start, true);
          night_start_minute.set_int(night_minute_start, true);
          night_finish_hour.set_int(night_hour_finish, true);
          night_finish_minute.set_int(night_minute_finish, true);
          pid_time_period.set_int(time_period, true);
          device_location.set_string(LOCATION, true);
          frontend_skin.set_bool(skins, true);
          initial_message_delay = true;
        }
      } else {
        temp_error_sensor_feedback.set_float(temp_error_sensor, false);
        hum_error_sensor_feedback.set_float(hum_error_sensor, false);
        controller_device_name.set_string(DEVICE_NAME, true);
        device_software_ver.set_string(software_ver, true);
        device_daylight_saving.set_int(day_light_saving, true);
        day_night_mode.set_int(night, true);
        night_start_hour.set_int(night_hour_start, true);
        night_start_minute.set_int(night_minute_start, true);
        night_finish_hour.set_int(night_hour_finish, true);
        night_finish_minute.set_int(night_minute_finish, true);
        pid_time_period.set_int(time_period, true);
        device_location.set_string(LOCATION, true);
        frontend_skin.set_bool(skins, true);
      }
    }
  }
  device_standby.set_bool(system_standby, true);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~ Output pin state ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

bool check_pin_state(int pin) {
  bool state;
  return state = digitalRead(pin);      // Checks the status of the output pins
}
