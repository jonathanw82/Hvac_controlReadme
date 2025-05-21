
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ MQTT Setup ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
void setUpMqtt() {
  mqtt_client.begin(MQTT_HOST, 1883, www_client);
  mqtt_client.onMessageAdvanced(mqtt_message);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ String comparason ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
bool str_startwith(char* string, char* start) {
  return string == strstr(string, start);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Covert string to float ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
float payloadCovertedToFloat(char* payload, int payload_length) {
  payload[payload_length] = '\0';
  String s = String((char*)payload);                // Convert the incomming string to an float
  float stringtofloat = s.toFloat();
  return stringtofloat;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ MQTT Message recieved ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
void mqtt_message(MQTTClient *client, char topic[], char payload[], int payload_length) {
  Serial.print("message recieved: ");
  Serial.print(topic);
  Serial.print(" = ");
  Serial.println(payload);
  hvac_control_commands(topic, payload, payload_length);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Maintain Connection to MQTT ~~~~~~~~~~~~~~~~~~~~~~~~~~~
void maintain_mqtt_connection() {

  if (mqtt_client.connected()) {
    wdt_reset();
    return;
  }

  if (millis() - last_connection_attempt < 1000) {        // only attempt to connect once a second
    return;
  }
  last_connection_attempt = millis();

  Serial.print(F("Connecting to MQTT host \""));
  Serial.print(MQTT_HOST);
  Serial.print(F("\" ... "));
  if (!mqtt_client.connect(DEVICE_NAME)) {
    Serial.println(F(" connection failed."));
    wdt_reset();
    return;
  }
  Serial.println(F("success!"));
  mqtt_client.subscribe(SUBSCRIBE_PATH"temp_P");
  mqtt_client.subscribe(SUBSCRIBE_PATH"temp_I");
  mqtt_client.subscribe(SUBSCRIBE_PATH"temp_D");
  mqtt_client.subscribe(SUBSCRIBE_PATH"target_temp");
  mqtt_client.subscribe(SUBSCRIBE_PATH"night_target_temp");
  mqtt_client.subscribe(SUBSCRIBE_PATH"time_period");
  mqtt_client.subscribe(SUBSCRIBE_PATH"daylight_saving");
  mqtt_client.subscribe(SUBSCRIBE_PATH"night_hour_start");
  mqtt_client.subscribe(SUBSCRIBE_PATH"night_minute_start");
  mqtt_client.subscribe(SUBSCRIBE_PATH"night_hour_finish");
  mqtt_client.subscribe(SUBSCRIBE_PATH"night_minute_finish");
  mqtt_client.subscribe(SUBSCRIBE_PATH"hum_P");
  mqtt_client.subscribe(SUBSCRIBE_PATH"hum_I");
  mqtt_client.subscribe(SUBSCRIBE_PATH"hum_D");
  mqtt_client.subscribe(SUBSCRIBE_PATH"target_hum");
  mqtt_client.subscribe(SUBSCRIBE_PATH"night_target_hum");
  mqtt_client.subscribe(SUBSCRIBE_PATH"reset");
  mqtt_client.subscribe(SUBSCRIBE_PATH"standby");
  mqtt_client.subscribe(SUBSCRIBE_PATH"skins");
  wdt_reset();
}
