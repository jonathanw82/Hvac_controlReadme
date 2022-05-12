<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/repoimage.jpg" alt="repo image" width="100%"/></div>

# HVAC-Controller
Temperature and humidity controller Firmware Ver 3.00_mqtt

Hvac Control firmware is used in conjunction with HVAC Django a control interface with a touch screen for control of wall-mounted Bard HVAC units to effectively, control the environment with high precision.


### <b>Problem:</b>

The current controllers have very little precision and the user has no easy way of setting day or night setpoints. After testing the controllers for some time and using the data from the 30mhz sensor platform, their flaws became apparent. The temperature had a tendency to regularly overshoot its setpoint causing the HVAC to switch between heating and cooling unnecessarily. It was also found that the humidity was also overshooting and creating a sawtooth style wave as can be seen in (Fig 1) as the HVAC was switching between humidifying and dehumidifying. Both of these issues can potentially waste energy and have unstable results.
The display was also red so the grow lights are on it is difficult to read any information from the display.

### (Fig 1)
<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/humid.jpg" alt="humidity histrory graph" width="100%"/></div>

### <b>Solution:</b>

HVAC Control utilizes an integrated real-time clock, Mqtt gives the user control of the environment day or night (Fig 2), with the ability to adjust temperature targets and humidity levels. 

MQTT integration allows messages to be sent to a database for historic data but also to an HVAC Django control interface to display history and current status.

PID loops are used to control the temperature and humidity, this allows the controller to seamlessly control the environment without massive overshoots and will stop constant switching from heating to cooling, and humidify to dehumidifying.

### (Fig 2)
<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/graph.jpg" alt="expected temp histrory graph" width="100%"/></div>

### (Fig 3)
<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/humhvac.jpg" alt="expected hum histrory graph" width="100%"/></div>


<br/>


## So how does it work?
After the user has set up the initial settings such as temperature target, humidity target, P, I, and D for both temperature and humidity, time period for PID and also set a night time on/off times from the HVAC Django control interface, the controller will pretty much look after itself.

A sensor will read the current temperature in the room and feed the data back to a PID algorithm, from here it will decide on the next course of action. For instance, if the temperature is less than the target temperature, the controller will turn on the heater for a set period of time of a percentage of 2.5 minutes (this could be 5, 10 or whatever length of time you want to tune the PID algorithm to, for now, we will say 2.5 minutes), after the 2.5 minutes have elapsed it will turn on the heater again for a percentage of the time, depending on how far or close to the set point the temperature is the PID controller will adjust the percentage of time accordingly to attempt to reach the setpoint and maintain it without overshooting it. 
<br/>

<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/timeperiod.jpg" alt="time representation" width="100%"/></div>

<br/>
The same is true if the temperature in the room is over the setpoint, the controller will in effect act in reverse, but this time turning on the cooling coils pulling the temperature down towards the setpoint. This behaviour stops the constant switching from heating/cooling as the controller tries to correct its error with overshooting as seen with the current controller.

This use of a PID algorithm is also implemented with humidity, if the humidity is below the setpoint the PID turns the humidifier on for a percentage of 2.5 minutes as explained with temperature. 

During operation, if a value changes such as temperature/humidity sensor values, PID values, and a myriad of other values are transmitted via MQTT. These messages are then collected by the Mosquitto Mqtt Broker that is installed on the Raspberry Pi, that is connected to the Controllinio Maxi via an ethernet cable. 

## Control Testing:
Current testing is producing promising results, it is worth bearing in mind that with the container not being insulated or sealed, the results we are seeing may not be a true representation of what we will actually see in the correct environments but, the results are pleasing so far.

* With a time period of 2.5 minutes, 
temperature is stable within +- 0.15°c (Fig 3.1) and humidity around +- 2% with far less saw-tooth effect. (Fig 3.2) with was done over a time period of 2.5 minutes with basic PID parameters set.

### (Fig 3.1)
<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/temp_pid%20.png" alt="temp histrory graph" width="100%"/></div>

### (Fig 3.2)
<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/hum_pid%20.png" alt="hum histrory graph" width="100%"/></div>

* Further tuning has been done with slightly different PID parameters but this time over a period of 1 minute the results are tighter with temperature peaking @ 25.12 and dropping to 25.02 (Fig 3.3)and humidity on average  +- 0.5% (Fig 3.4) so much tighter results.

### (Fig 3.3)
<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/temp60sec.jpg" alt="temp histrory graph" width="100%"/></div>

### (Fig 3.4)
<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/hum60sec.jpg" alt="hum histrory graph" width="100%"/></div>

<br/>

## The User's Goals Of This Controller Are:
* Easy to navigate touch screen user interface.
* Future integration into Ostara.
* Low power consumption.
* Automatic operation.
* Automated monitoring of temperature and humidity to regulate the indoor climate.

## Features:
* Easy to read display with icons that allow the user to know exactly what is going on in their environment.
* Automatic adjustment relative to rises in room temperature or humidity, with user-programmable target parameters.
* Historical data displayed line charts for Temperature and Humidity.
* User authentication to protect sensitive settings.
* Mqtt message integration for external control.
* Ability to reset the controlling if required.
* Ability to shut the system down into a standby mode.

<br/>

## Main User Interface:
The main screen consists of a navigation bar across the top of the screen with options (Home, Charts, Info and Login) after logging in the login icon becomes the logged-in user's name with a dropdown menu that contains Admin and Logout.
The current time is also displayed at the bottom left of all pages.

### Home:
It consists of large, easy-to-read current temperature and humidity data with status icons on either side for day/night humidifying/dehumidifying run status and temp/cooling.

If the dehumidifying icon is flashing, this is because heating and cooling always take precedence over dehumidification, if heating or cooling is idle the icon will stop flashing and dehumidification will take place.

<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/landing.jpg" alt="landing page" width="80%"/></div>

### Charts:
This consists of multiple line charts displaying historical data for temperature and humidity for 24 hours and P & I responses (D response will come in further releases) over a 6 hour period. 

If the user is logged in, PID setting options will also appear under each heading for both temperature and humidity.

<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/charts.jpg" alt="charts" width="50%"/><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/chartslog.jpg" alt="charts loggedin" width="50%"/></div>

### Info:
This page displays all info including 
* Software Version, Location and Device Name.
* P I and D responses for both temperature and humidity.
* PID output value and duration of heating/cooling, humidification/dehumidification.
* The actual temperature and humidity out of the HVAC itself.

<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/info.jpg" alt="indo page" width="80%"/></div>

### Login:
This page consists of a login box with username and password when either of these input boxes is clicked an on-screen keyboard will appear click on the screen outside the keyboard to make it disappear.

After logging in the user will be redirected to the charts page.

If logged in and the controller is not touched for 30 minutes the user will be automatically be logged out and redirected to the main home page.

<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/login.jpg" alt="login page" width="80%"/></div>

### Admin:
From this page, the user can see info such as
* Logged In User, Device Name, Location, Software Version, Mac Address and Host Name.
* A link to MQTT commands see below.
* A Controllino reset button, when the button is clicked you will be asked if you wish to continue and be given a chance to cancel, if OK the Controllino will be given a command to reset and the and reset box will disappear.
* Time period setting input.
* Daylight saving on/off,
* Note on Day light Saving: setting day light saving is done explicitly by the user, this is not done automatically, this is done on purpose as crops in controlled enviroments do not neccaraly need day light saving. If the Real Time Clock needs updating, it is imporant that if the actual current time is currently british summertime hour +1, the time entered is Coordinated Universal Time (UTC) to allow the user explicit contol of daylight saving.

<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/adminnew1.jpg" alt="admin" width="50%"/><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/reset.jpg" alt="reset" width="50%"/></div>

<br>

### MQTT Commands:
This page displays the list of MQTT commands their values and options. 

* temp_P              
* temp_I                           
* temp_D                           
* target_temp
* time_period
* day_light_saving
* night_hour_start
* night_minute_start
* night_hour_finish
* night_minute_finish
* hum_P                               
* hum_I                                
* hum_D                              
* target_hum  
* standby    
* reset             

<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/mqttcommands1.jpg" alt="mqtt commands" width="80%"/></div>


#

## Technology Used:
Current and Future:
<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/tech.jpg" alt="tech used" width="80%"/></div>


## Main Hardware:
* 1x Controllino Maxi.
* 2x SHT31 Temperature humidity sensor.
* 1x 9548A I2C Multiplexer.
* 1x 24v DC Psu.
* 1x 5v DC Psu.
* 1x 24v-5vdc buck converter.
* 4x 25v-240v SPDT relays.
* 1x Raspberry Pi.
* 1x Ethernet cable.
* 1x 7inch LCD display with resistive touchscreen.

### Why a resistive touch screen rather than capacitive?

Even though a capacitive touch screen allows for multiple contact points and has far more gesture control, due to its nature it can not be used with gloves or in high humidity areas. The resistive touch screen has far less gesture control and touchpoints, however, it can be used with gloves and in wet/hi humidity areas, therefore, reducing any errors caused by water environmental factors.

<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/sensor.jpg" alt="sensor" width="50%"/><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/controllino.jpg" alt="mirco controller" width="50%"/></div>


## Software for Controllino:
The Software is written in C++, compiled and uploaded to the microcontroller by the Arduino Ide, most libraries used are Arduino standard, apart from any items listed in the additional section.

### Standard
* EEPROM for writing to the controller memory.
* Wire for use of I2C bus.
* avr/wdt for use of the built in watchdog.
* Ethernet.

### Additional
* Controllino for allowing controllino specific aliases.
* SPI for the serial peripheral interface.
* Mqtt.
* Mqtt Client.

## Software for Front and Backend:
Hvac Django control interface is written in Python3 Django Rest Api, utilising an SQLLite database and Phoe MQTT for the messaging service, the front end uses HTML5, CSS3 and JavaScript.

<br/>

## Power Consumption:
Estimated Power Consumption as rated in docs, actual may vary.

| Component                  | Average Consumption        |
| :----------------          | :-------           |
| Controllino Maxi           | @ 24v 300 ma       |
| 2 x SHT31 temp/hum sensor  | @ 5v < 300 ma      |
| 9548A I2C Multiplexer      | @ 5v < 100 ma      |
| Raspberry Pi 4             | @ 5v > 760 ma      |
| Lcd with touch screen      | @ 5v > 1 amp       |


<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/wiring.jpg" alt="wiring diagram" width="100%"/></div>


# Deployment & Setup

## Controllino Setup:

#### <b>Real time Clock (RTC):</b>
It is worth noting that the Controllino has a built-in battery to hold the RTC  when there is no external power, however it only holds the RTC for about 2 weeks, after this time the RTC may need resetting.

Regular polling of the RTC chip can causes drift of the RTC internal clock. It is possible this can slowdown the RTC for several seconds per day, the reason is that the RTC chip stops its internal clock counter during the SPI communication between the main processor and the RTC chip. To avoid this we only call the RTC internal clock every 12 hours to update the current time with the actual time, between these 12 hour periods we use the controllinos system time (millis) to act as a RTC reducing the calls to the RTC internal clock and mitigating the time drift. If the controllino is reset the current time will automaically be updated to the actual time straight off the bat.

To set the RTC, you will require a laptop or similar device, with the [Arduino Ide](https://www.arduino.cc/en/software) software installed and set up correctly to do this open the Arduino Ide, go to File, Preferences, under the settings tab locate the  "Additional boards manager URLs", then put a comma after the anything already in the box then append this line of code https://raw.githubusercontent.com/CONTROLLINO-PLC/CONTROLLINO_Library/master/Boards/package_ControllinoHardware_index.json you will then need to go to tools, board, board manager, then search for Controllino and install, the last step to install go to sketch, include a library, manage libraries search and install Controllino, you will now need a USB to USB B cable, and the relevant Hvac firmware, please make a note of the correct firmware version, this can be obtained by entering the info tab on Hvac Django control interface. (Fig 5)

### (Fig 5)
<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/softver.jpg" alt="software version" width="50%"/></div>
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

Plugin the Controllino to the laptop and go to tools, board, and select Controllino Mini from the drop-down, then select the port, it should already have the device name next to it (this is for Windows users, Linux users may have something different), when all is set up, press the circle with a right-pointing arrow, top left of the screen, allow the firmware to compile and it will say "uploading to the device" at the bottom of the screen then, "upload done", the lights on the Controllino will flash a few times and then reset. 

After the initial upload to the Controllino the RTC will be set.

This line of code in (Fig 7) should then be commented out as shown, and the Controllino reflashed by pressing the circle with a right-pointing arrow as before.

The Controllino is now set up, further settings are now set from the Lcd screen.

### (Fig 7)

<div align="center"><img src="https://github.com/jonathanw82/Hvac_controlReadme/blob/main/media/RTcommeted.jpg" alt="Setup of real time clock" width="100%"/></div>


It is possible to allow the code to automatically update the clock when the firmware is uploaded, however, this will interfere with the UTC time if done in BST.

## Raspberry Pi Setup

* Install Ubuntu LTS [here](https://ubuntu.com/download/raspberry-pi)
* Follow the initial setup options to setup the keyboard language,wifi and Pi name password etc.
* Install net-tools (sudo apt install net-tools) 
* Disable sleep [here](https://stackoverflow.com/questions/64157889/prevent-raspberry-pi-4-for-going-to-sleep-shutdown-ubuntu-server-18-04)
* Disable screen lock
* Install Chrome or another type of browser
* Install Openssh (sudo apt install openssh) 
* Check IP adresses by typeing (ifconfig)
* Setup SSH with Putty or Bitwise ssh using the IP address from ifconfig and the 
* Setup static IP address for wired connection eth0 & assign an IP address the same as on the HVAC control firmware
* Check docker is installed
* Download the repo for Hvac-Django [here](https://github.com/jonathanw82/Hvac-django) to the Pi
* To install the software on the Pi, move to the HVAC Django folder, in the root of it type (docker-compose up)
* All files and dependencies will now be installed.



## Initial setup after installation:

* From the main screen set the targets for both temperature and humidity for both day and night.
* Then click on nighttime settings and set the start and finish times. 
* Click on the login icon on the navigation bar across the top of the screen, you will require a username and password (these can be obtained from the administrator) you will be redirected to the charts page where you will have options to set the PID for temperature under the temperature heading.
* To set the humidity PID scroll down you will see settings for PID humidity settings further down the page under the heading Humidity.
* After Logging in you will see your user name on the navigation bar with a dropdown menu click this and then click admin.
* From here you can set the daylight saving and the time duration for the PID.
* You are now all set up and HVAC is now controlling your environment!

#

## Version 4.00_mqtt:
* Integration of Modbus to control Mitsubishi and other types of HVAC systems.

#

## Credits:

Ideas for day-night https://forum.arduino.cc/t/check-if-time-is-between-two-time-inputs/517765/23?page=2

Pi screen Bezel 3d print
https://www.thingiverse.com/thing:3664665


HTML virtual keyboard
https://virtual-keyboard.js.org/


https://www.amazon.co.uk/Raspberry-LCD-Resistive-HDMI-Interface/dp/B07V5WDW4P

Thank you to:

Adam Waterman for PID tuning,

Harry Willis for best practices,  

Will Derriman for software mentoring and creation of a Django API V3+,

Temi Odanye for updating the screen bezel design.

[Back_to_top](#HVAC-Controller)
