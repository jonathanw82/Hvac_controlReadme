/*
  Bard Hvac controller by LettUsGrow.
  Software Ver 3.00_mqtt

  ** Note Real Time Clock **
  When flashing the controllino for the first time, the setting under the void setup() section, named Controllino_SetTimeDate(), will need to
  be un commented and the numbers entered for the correct date and time set accordingly, after the initial upload to the controllino the clcck will be set.
  This line of code should then be commented out and the controllino re flashed.
  Please see the readme.md "Notes for setup (RTC)" for more infromation about clock setup https://github.com/jonathanw82/HVAC-Controller#readme
*/

#include <Adafruit_SHT31.h>         // Temperature Humidity Sensor
#include <EEPROM.h>                 // EEprom Lib
#include <Wire.h>                   // I2c enable Lib
#include <avr/wdt.h>                // Watchdog Lib
#include <Controllino.h>            // Controllino Lib to allow aliases
#include <SPI.h>                    // Allow access to serial
#include <PID.h>
#include <Ethernet.h>
#include <MQTT.h>
#include <MQTTClient.h>

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Mqtt declarations  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#define PUBLISH_PATH "germination/Hvac/"
#define SUBSCRIBE_PATH "Workshop/sub/"
#define DEVICE_NAME "Hvac"
#define MQTT_HOST "192.168.88.1"
#define LOCATION "Germination"
MQTTClient mqtt_client;
EthernetClient www_client;

long last_connection_attempt = 0;
byte mac[] = { 0xA3, 0x40, 0x20, 0x6F, 0x73, 0x3B };
byte ip[] = { 192, 168, 88, 15 };
String MAC_ADDRESS = "A3:40:20:6F:73:3B";

String software_ver = "3.20_Mqtt";
int on = HIGH;
int off = LOW;
int eeAddress = 0;                       // Address to start saving to EEprom

//~~~~~~~~~~~~~~~~~~~~~~~~~~ Decalre Controllino pins with alias  ~~~~~~~~~~~~~~~~~~~~~~~~
int heat = CONTROLLINO_D0;
int cooling = CONTROLLINO_D1;
int humidifier = CONTROLLINO_D2;
int dehum = CONTROLLINO_D3;

int night;                         // Day and night Mode
unsigned long current_time;
const long seconds_per_day = 24l * 60l * 60l; //86400

float target_temp = 0;
float target_hum = 0;
float day_target_temp = 20;
float day_target_hum = 50;
float night_target_temp = 20;
float night_target_hum = 50;

float heat_on_time = 0;
float heat_off_time = 0;
float hum_on_time = 0;
float hum_off_time = 0;
float time_period = 60;
float temp_output = 0;
float hum_output = 0;
bool system_standby = false;
bool skins = false;

int next_reading = 4;
int mqtt_time_loop_counter = 0;
bool initial_message_delay = false;


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ RTC declarations  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

int actualHour = 0;
int actualMinute = 0;
unsigned long actualSeconds = 0;
int actualDay = 0;
int actualWeekday = 0;
int actualMonth = 0;
int actualYear = 0;

int currentHour = 0;
int currentMinute = 0;
unsigned long currentSeconds = 0;
int currentDay = 0;
int currentWeekday = 0;
int currentMonth = 0;
int currentYear = 0;
int day_light_saving = 0;

int night_hour_start = 20;              // start night time hours
int night_minute_start = 0;
int night_hour_finish = 6;             // set end night hours and go back to day mode
int night_minute_finish = 0;


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Air Temperature & Humidity sensor ~~~~~~~~~~~~~~~~~~~~~~~

Adafruit_SHT31 sht31 = Adafruit_SHT31();        // Declare the sensor function
int SHT31_Address = 0x44;                       // Set to 0x45 for alternate i2c address
float temp;                                     // Stores temperature value as a floating point integer
float hum;                                      // Stores humidity value as a floating point integer
float temp_error_sensor;
float hum_error_sensor;


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ PID ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

PID tempPID(&temp, &temp_output, &target_temp, 1, 1, 1); // Decalre the PID classes
PID humPID(&hum, &hum_output, &target_hum, 1, 1, 1);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Millis declarations ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
unsigned long time_loop_start = 0;
unsigned long prev_Compute_time;
unsigned long compute_interval = 5000;
unsigned long prev_mqtt_send_time;
unsigned long previous_millis_sensor;
unsigned long temp_hum_sensor_read_interval = 1000;
unsigned long prev_mqtt_send;
unsigned long send_interval = 7000;

unsigned long previous_millis_seconds;  // Used for RTC sub 

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Get Temp Humid Data ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

void sensors() {
    if (millis() - previous_millis_sensor > temp_hum_sensor_read_interval) {
      previous_millis_sensor = millis();
      temp = sht31.readTemperature() - 1;                   // Get current Temperature
      hum = sht31.readHumidity();                           // Get current Humidity
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Set Up ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

void setup() {
  Serial.begin(9600);                       // Initialise Serial monitor @ a baud rate of 6900
  Ethernet.begin(mac, ip);                  // Initialise ethernet
  Controllino_RTC_init(0);                  // Initialise the real time clock
  Wire.begin();                             // Begin I2c on arduino nano

  /*
    ********************************************************************
      Set date/time (day, week day, month, year, hour, minute, second)
      week day =  Monday 1, Sunday 7 etc
    ********************************************************************
  */
  //Controllino_SetTimeDate(27,1,2,23,14,16,00); // set initial values to the RTC chip

  get_actual_date_time();                       // Get the actual time and date form the internal RTC
  sht31.begin(SHT31_Address);

  sensors();                                // Collect initial temp and humidity

  tempPID.init();                           // Initialise Pid for temp and hum
  tempPID.max_out = 100;
  tempPID.min_out = -100;
  humPID.init();
  humPID.max_out = 100;
  humPID.min_out = -100;

  pinMode(heat, OUTPUT);                    // set controllino connection pins initial states
  digitalWrite(heat, off);
  pinMode(cooling, OUTPUT);
  digitalWrite(cooling, off);
  pinMode(humidifier, OUTPUT);
  digitalWrite(humidifier, off);
  pinMode(dehum, OUTPUT);
  digitalWrite(dehum, off);

  get_EEprom();                             // Get saved data from memory
  setUpMqtt();                              // Setup the Mqtt connection

  wdt_enable(WDTO_2S);                      // enable the watchdog timer for 2 seconds
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Loop ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

void loop() {
  wdt_reset();                              // Reset Watchdog and reset processor if crashed or inactive
  get_date_time();                          // Check and update the Real time clock
  maintain_mqtt_connection();               // Keep the mqtt connection connected
  check_mode();                             // Sets the diff and targets to day or night mode
  check_time_values();                      // Check the values and +- accordingly
  Mqtt_publish();                           // Send Mqtt messages

  if (!system_standby) {
    time_control_loop();                       // Contol output pins
    sensors();                                 // Read Temp and Humidity sensors
    if (millis() - prev_Compute_time > compute_interval) { // Compute every 5 seconds
      prev_Compute_time = millis();
      tempPID.Compute();
      humPID.Compute();
    }
  }
  else {
    digitalWrite(heat, off);
    digitalWrite(cooling, off);
    digitalWrite(humidifier, off);
    digitalWrite(dehum, off);
  }
  mqtt_client.loop();                       // Loop the mqtt client to keep checking for changes
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Time values ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
void check_time_values() {
  // Convert a negative number to a positive number

  if (temp_output < 0) heat_on_time = (temp_output * time_period) / 100 * -1;             // Temp
  else heat_on_time = (temp_output * time_period) / 100;
  heat_off_time = time_period - heat_on_time;

  if (hum_output < 0) hum_on_time = (hum_output * time_period) / 100 * -1;                // Hum
  else hum_on_time = (hum_output * time_period) / 100;
  hum_off_time = time_period - hum_on_time;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Time loop control ~~~~~~~~~~~~~~~~~~~~~~~~~~
void time_control_loop() {

  if (millis() - time_loop_start  > (time_period * 1000)) {
    time_loop_start = millis();
    mqtt_time_loop_counter = 0;
  }

  if (millis() - time_loop_start < (heat_on_time * 1000)) {
    if (temp_output > 0) {                                        // Heating On/Off
      digitalWrite(heat, on);
      digitalWrite(cooling, off);
    }
    else {
      digitalWrite(heat, off);
      digitalWrite(cooling, on);
    }
  }
  else {
    digitalWrite(heat, off);
    digitalWrite(cooling, off);
  }

  if (millis() - time_loop_start  < (hum_on_time * 1000)) {
    if (hum_output > 0) {                                        // Humidity On/Off
      digitalWrite(humidifier, on);
      digitalWrite(dehum, off);
    }
    else {
      digitalWrite(humidifier, off);
      digitalWrite(dehum, on);
    }
  }
  else {
    digitalWrite(humidifier, off);
    digitalWrite(dehum, off);
  }
}
