<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/repoimage.jpg" alt="repo image" width="100%"/></div>

# HVAC-Controller
Temperature and humidity controller Ver 2.22_mqtt

Hvac Control is used in conjunction with wall-mounted Bard HVAC units to effectively, control the environment with high precision.


### <b>Problem:</b>

The current controllers have very little precision and the user has no easy way of setting day or night setpoints. After testing the controllers for some time and using the data from the 30mhz sensor platform, their flaws became apparent. The temperature had a tendency to regularly overshoot its setpoint causing the Hvac to switch between heating and cooling unnecessarily. It was also found that the humidity was also overshooting and creating a sawtooth style wave as can be seen in (Fig 1) as the Hvac was switching between humidifying and dehumidifying. Both of these issues can potentially waste energy and have unstable results.

### (Fig 1)
<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/humid.jpg" alt="humidity histrory graph" width="100%"/></div>

### <b>Solution:</b>

Hvac Control utilizes an integrated real-time clock, giving the user control of the environment day or night (Fig 2), with the ability to adjust temperature targets and humidity levels. 
An LCD display, shows you the current temperature, humidity, target parameters, current status from heating, cooling, or humidification (Fig 3), day or night modes, the current time, and night mode start-finish times.

For full control, the rotary knob allows access to an easy-to-navigate array of settings, for control right down to the precision of 0.1 of a degree.
Mqtt intergration allows messages to be sent to a database for historic data but also to a webpage to display history, current status and include full external control.

PID loops are used to control the temperature and humidity, this allows the controller to seamlessly control the envirmonet without massive over shoots and will stop constant switching from heating to cooling, and humidify to dehumidifying.

### (Fig 2)
<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/graph.jpg" alt="expected temp histrory graph" width="100%"/></div>

### (Fig 3)
<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/humhvac.jpg" alt="expected hum histrory graph" width="100%"/></div>


<br/>


## So how does it work?
After the user has set up the initial settings such as temperature target, humidity target, P, I, and D for both temperature and humidity, and also set a night time on/off period, the controller will pretty much look after itself.

A sensor will read the current temperature in the room and feed the data back to a PID algorithm, from here it will decide on the next course of action. For instance, if the temperature is less than the target temperature, the controller will turn on the heater for a set period of time of a percentage of 2.5 minutes (this could be 5, 10 or whaever length of time you want to tune the pid algorithm to, for now we will say 2.5 minutes), after the 2.5 minutes have elapsed it will turn on the heater again for a percentage of the time, depending on how far or close to the set point the temperature is the pid controller will adjust the percentage of time accordingly to attempt to reach the setpoint and maintain it without overshooting it. 
<br/>

<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/timeperiod.jpg" alt="time representation" width="100%"/></div>

<br/>
The same is true if the temperature in the room is over the setpoint, the controller will in effect act in reverse, but this time turning on the cooling coils pulling the temperature down towards the setpoint. This behavior stops the constant switching from heating/cooling as the controller tries to correct its error with overshooting as seen with the current controller.

This use of a PID algorythum is also implemented with humidity, if the humidity is below the setpoint the PID with turn the humidifier on for a percentage of 2.5 minutes as explained with temperature. 

When the night period is reached the controller will automatically adjust its set points to the values for the night, and start adjusting the environment accordingly, while activating the auto backlight (if user activated) on the LCD screen. More on this feature can be found notes for setup section.

During operation, once a second, the temperature/humidity sensor values, PID values, and a myriad of other values are transmitted via Mqtt. These messages are then collected by the Mosquitto Mqtt Broker that is installed on the Raspberry Pi, that is connected to the Controllinio Maxi via an ethernet cable. The Django API also installed on the Pi will then decide what messages it requires and save the data into an SQLite database. At the same time the messages will be picked up by a separate python program also running on the Pi called Phoe Mqtt, these can then be sent to JavaScript via websockets where realtime data such as temperature and humidity, night status and error messages can be displayed on a general user interface (webpage), JavaScript will also call the Django API in the backend requesting JSON formatted historical data such as temperature, humidity, the P,  I, and D responses that can then be displayed in graphs. Commands from the front end can also be sent back via the Mqtt service allowing variables such as targets and times periods to be adjusted on the Controillino in real-time.

## Testing:
Current testing is producing promising results, it is worth bearing in mind that with the container not being insulated or sealed, the results we are seeing may not be a true representation of what we will actually see in the correct environments but, the results are pleasing so far.

* With a time period of 2.5 minutes, 
temperature is stable within +- 0.15°c (Fig 3.1) and humidity around +- 2% with far less saw tooth effect. (Fig 3.2) with was done over a time period od 2.5 minutes with basic PID parameters set.

### (Fig 3.1)
<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/temp_pid%20.png" alt="temp histrory graph" width="100%"/></div>

### (Fig 3.2)
<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/hum_pid%20.png" alt="hum histrory graph" width="100%"/></div>

* Further tuning has been done with slightly different PID parameters but this time over a period of 1 minute the results are tighter with temperature peaking @ 25.12 and dropping on to 25.02 (Fig 3.3)and humidity on average  +- 0.5% (Fig 3.4) so much tighter results.

### (Fig 3.3)
<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/temp60sec.jpg" alt="temp histrory graph" width="100%"/></div>

### (Fig 3.4)
<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/hum60sec.jpg" alt="hum histrory graph" width="100%"/></div>

<br/>

## The User's Goals Of This Controller Are:
* An easy to navigate menu.
* Future intergration into Ostara.
* Low power consumption.
* Automatic operation.
* Automated monitoring of temperature and humidity to regulate the indoor climate.

## Features:
* Rotary encoder for navigation.
* Lcd display for real time data.
* Automatic adjustment relative to rises in room temperature or humidity, with user-programmable target parameters.
* Mqtt message intergration for external control.

<br/>

## Technology Used:
<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/tech.jpg" alt="tech used" width="80%"/></div>


## Main Hardware:
* 1x Controllino Maxi.
* 2x SHT31 Temperature humidity sensor.
* 1x Lcd I2C.
* 1x KY-040 Rotary Encoder.
* 1x 24v DC Psu.
* 1x 24v-5vdc buck converter.
* 4x 25v-240v SPDT relays.
* 1x Raspberry Pi.
* 1x Ethernet cable.

<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/sensor.jpg" alt="sensor" width="50%"/><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/controllino.jpg" alt="mirco controller" width="50%"/></div>


## Software for Controllino:
The Software is written in C++, compiled and uploaded to the micro controller by the Arduino Ide, most libraries used are Arduino standard, apart from any items listed in the additional section.

### Standard
* EEPROM for writing to the controller memory.
* Wire for use of I2C bus.
* avr/wdt for use of the built in watchdog.
* TimerOne for use with the encoder timeing.
* Ethernet

### Additional
* encoder-arduino for the Rotary encoder.
* Liquidcrystal-IC2 for the LCD Display.
* Controllino for allowing controllino specific aliases.
* SPI for the serial peripheral interface.
* Mqtt
* Mqtt Client

## Software for Front and Backend:
The backend is written in Python3 utalising SQLLite for the database and Phoe Mqtt for the messaging service, the front end uses HTML5, CSS3 and JavaScript.

<br/>

## Power Consumption:
Estimated Power Consumption as rated in docs, actual may vary.

| Component                  | Consumption        |
| :----------------          | :-------           |
| Controllino Maxi           | @ 24v 300 ma       |
| Lcd i2c                    | @ 5v 200 ma        |
| 2 x SHT31 temp/hum sensor  | @ 5v < 300 ma      |
| KY-040 Rotary Encoder      | @ 5v < 0.05 ma     |
| Rapberry Pi                | @ 5v > 760 ma      |
|                            |Total =  > 1.60 a   |

<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/wiring.jpg" alt="wiring diagram" width="100%"/></div>


## Setup program options:

<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/setup.jpg" alt="Setup flow Chart" width="100%"/></div>

<br/>

## Notes for setup:
All settings are accessed by pressing the rotary encoder once. From here rotate the button clockwise/anti-clockwise to reach desired menu option. To enter each menu press the button again. To exit a certain menu once agin press the button. To exit the settings menu either scroll to the exit menu option and press the button, or hold the button down to activate the manual reset. Either option can be used but it is better to scroll to the exit option.

| Setup Menu.                                   | Options         |
| :----------------                             | :-------        |
| Day Target Temperature.                       | 0-35°c          |
| Day Target Humidity.                          | 20-100%         |
| Night Target Temperature.                     | 0-35°c          |
| Night Target Humidity.                        | 20-100%         |
| Night Mode Start Time.                        | 0-23H 0-59M     |
| Night Mode Finish Time.                       | 0-23H 0-59M     |
| Day Light Saving                              | On/Off          |
| Auto Night Lcd BackLight                      | On/Off          |
| Auto Night Lcd BackLight timout duration      | 0-30 seconds    |
| Menu Exit.                                    |                 |

* Constant Day & Night:

If the user wants to have constant temperature and humidity without the Day/Night frequency, set the day and night temperatrure/humidity and diffential all to the same.

* Day light Saving:

Setting day light saving is done explicitly by the user, this is not done automatically, this is done on purpose as crops in controlled enviroments do not neccaraly need day light saving. If the Real Time Clock needs updating, it is imporant that if the actual current time is currently british summertime hour +1, the time entered is Coordinated Universal Time (UTC) to allow the user explicit contol of daylight saving.

* Automatic LCD Backlight

The LCD backlight can be set to automatic timeout, this will turn off the backlight when the controller is in night mode to not stress the crops in the indoor environment. This can be set on or off, and a specific duration can be set from 0-30 seconds. If the backlight is off and the user wants to inspect the display, turning the control nob will illuminate LCD display for the duration set in the settings menu, if the user presses the button to access the settings menu, the display will remain illuminated until the user has exited the settings menu.

#

## MQTT Control Key words:

* temp_P              
* temp_I                           
* temp_D                           
* target_temp
* time_period
* night_hour_start
* night_minute_start
* night_hour_finish
* night_minute_finish
* hum_P                               
* hum_I                                
* hum_D                              
* target_hum         
* reset             


#
## Real time Clock (RTC):
It is worth noting that the Controllino has a built-in battery to hold the RTC  when there is no external power, however it only holds the RTC for about 2 weeks, after this time the RTC may need resetting.

To set the RTC, you will require a laptop or similar device, with the [Arduino Ide](https://www.arduino.cc/en/software) software installed and set up correctly to do this open the Arduino Ide, go to File, Preferences, under the settings tab locate the  "Additional boards manager URLs", then put a comma after the anything already in the box then append this line of code https://raw.githubusercontent.com/CONTROLLINO-PLC/CONTROLLINO_Library/master/Boards/package_ControllinoHardware_index.json you will then need to go to tools, board, board manger, then search for Controllino and install, the last step to install go to sketch, include library, manage libraries search and install Controllino, you will now need a USB to USB B cable, and the relevant Hvac firmware, please make a note of the correct firmware version, this can be obtained by entering the menu system by pressing the encoder button. (Fig 5)

### (Fig 5)
<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/lcd.jpg" alt="Setup of real time clock" width="50%"/></div>
<br/>

Open the firmware in the Arduino IDE, when flashing the Controllino for the first time or setting the RTC, the line of code under the void setup() section, named Controllino_SetTimeDate(), will need to be uncommented. (Fig 6)
<br/>

### (Fig 6)
<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/RTCready.jpg" alt="Setup of real time clock" width="100%"/></div>

<br/>

Enter the numbers in the format below,
<div align="center">

    ********************************************************************************
    Controllino_SetTimeDate(6,4,1,22,12,35,10);
    *** Controllino_SetTimeDate(Day,Weekday,Month,Year,Hour,Minute,Second) **
    week day =  Monday 1, Sunday 7 etc
    *******************************************************************************
</div>

Plug in the Controllino to the laptop and go to tools, board, and select Controllino Mini from the drop-down, then select the port, it should already have the device name next to it (this is for Windows users, Linux users may have something different), when all is set up, press the circle with a right-pointing arrow, top left of the screen, allow the firmware to compile and it will say "uploading to the device" at the bottom of the screen than, "upload done", the lights on the Controllino will flash a few times and then reset. 

After the initial upload to the Controllino the RTC will be set.

This line of code in (Fig 7) should then be commented out as shown, and the Controllino reflashed by pressing the circle with a right-pointing arrow as before.

### (Fig 7)

<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/RTcommeted.jpg" alt="Setup of real time clock" width="100%"/></div>


It is possible to the allow the code to automatically update the clock when the firmware is up loaded, however this will interfear with the UTC time if done in BST.


#

## Version 3.00_mqtt:

Version 3.00_mqtt is in the pipe line featuring a plethora of other features for better UI and control, including:
* Error feeback from the Hvac itself,
* Led Display with touch screen,
* Backend database,
* Graphs with historical data,
* Access control for User/Engineer,
* Possible remote control access (TBC).

## Credits:

Idaes for day night https://forum.arduino.cc/t/check-if-time-is-between-two-time-inputs/517765/23?page=2

Thank you to:
Adam Waterman,
Harry Willis, 
Will Derriman, for software support.

[Back_to_top](#HVAC-Controller)
