<div align="center"><img src="https://github.com/jonathanw82/HVAC-Controller/blob/main/media/repoimage.jpg" alt="repo image" width="100%"/></div>

# HVAC-Controller
Bard Hvac and humidity controller Ver 1.26

Hvac Control is used in conjunction with wall-mounted Bard HVAC units to effectively, control the environment with high precision.


### <b>Problem:</b>

The current controllers have very little precision and the user has no way of setting day or night setpoints, after testing the controllers for some time and using the data from the 30mhz sensor platform, their flaws became apparent, the temperature had a tendency to regularly overshoot it setpoint causing the Hvac to switch between heating and cooling unnecessarily,  it was also found that the humidity was also overshooting and creating a sawtooth style wave as can be seen in (Fig 1) as the Hvac was switching between humidifying and dehumidifying. both of these issues can potentially wast energy and have unstable results.

### (Fig 1)
<div align="center"><img src="https://github.com/jonathanw82/HVAC-Controller/blob/main/media/humid.jpg" alt="humidity histrory graph" width="100%"/></div>

### <b>Solution:</b>

Havc Control utilizes an integrated real-time clock, giving the user control of the environment day or night (Fig 2), with the ability to adjust temperature targets, differential, and humidity levels. 
An LCD display, shows you the current temperature, humidity, target parameters, current status from heating, cooling, or dehumidification (Fig 3), day or night modes, the current time, and night mode start-finish times.
For full control, the rotary knob allows access to an easy-to-navigate array of settings, for control right down to the precision of 0.1 of a degree.

### (Fig 2)
<div align="center"><img src="https://github.com/jonathanw82/HVAC-Controller/blob/main/media/graph.jpg" alt="expected temp histrory graph" width="100%"/></div>

### (Fig 3)
<div align="center"><img src="https://github.com/jonathanw82/HVAC-Controller/blob/main/media/humhvac.jpg" alt="expected hum histrory graph" width="100%"/></div>


#

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


## Technology Used:
* [Arduino Ide](https://www.arduino.cc/en/software)
* [drawio](https://www.diagrams.net/)
* [Photoshop](https://www.adobe.com/uk/products/photoshop/landpa.html?mv=search&mv=search&sdid=LZ32SYVR&ef_id=CjwKCAiAlfqOBhAeEiwAYi43F9Sq_9DlibH_vqFkxU4ar26NIl-3JLx06j0UGyqSEN3qlIh81HB_ghoCcdcQAvD_BwE:G:s&s_kwcid=AL!3085!3!474050983863!e!!g!!adobe%20photoshop!1422700211!58647953511&gclid=CjwKCAiAlfqOBhAeEiwAYi43F9Sq_9DlibH_vqFkxU4ar26NIl-3JLx06j0UGyqSEN3qlIh81HB_ghoCcdcQAvD_BwE)


## Main Hardware:
* 1x Controllino Mini,
* 1x SHT31 Temperature humidity sensor,
* 1x Lcd I2C,
* 1x KY-040 Rotary Encoder,
* 1x 24v DC Psu,
* 1x 24v-5vdc buck converter,
* 4x 25v-240v SPDT relays.

<div align="center"><img src="https://github.com/jonathanw82/HVAC-Controller/blob/main/media/sensor.jpg" alt="sensor" width="50%"/><img src="https://github.com/jonathanw82/HVAC-Controller/blob/main/media/controllino.jpg" alt="mirco controller" width="50%"/></div>


## Software:
The Software is written in C++, compiled and uploaded to the micro controller by the Arduino Ide, most libraries used are Arduino standard, apart from any items listed in the additional section.

### Standard
* EEPROM for writing to the controller memory.
* Wire for use of I2C bus.
* avr/wdt for use of the built in watchdog.
* TimerOne for use with the encoder timeing.

### Additional
* encoder-arduino for the Rotary encoder.
* Liquidcrystal-IC2 for the LCD Display.
* Controllino for allowing controllino specific aliases.
* SPI for the serial peripheral interface.
#

## Power Consumption:
Estimated Power Consumption as rated in docs, actual may vary.

| Component              | Consumption        |
| :----------------      | :-------           |
| Controllino Mini       | @ 24v 200 ma       |
| Lcd i2c                | @ 5v 200 ma        |
| SHT31 temp/hum sensor  | @ 5v < 1.5 ma      |
| KY-040 Rotary Encoder  | @ 5v < 0.05 ma     |
|                        |Total =  401.55 ma  |

<div align="center"><img src="https://github.com/jonathanw82/HVAC-Controller/blob/main/media/wiring.jpg" alt="wiring diagram" width="100%"/></div>


## Setup program options:

<div align="center"><img src="https://github.com/jonathanw82/HVAC-Controller/blob/main/media/setup.jpg" alt="Setup flow Chart" width="100%"/></div>

#

| Setup Menu.                                   | Options         |
| :----------------                             | :-------        |
| Day Target Temperature.                       | +/- 0-35°c      |
| Max/Min Day Target Temperature differential.  | +/- 0.10-2.00°c |
| Day Target Humidity.                          | +/- 20-100%     |
| Max/Min Day Target Humidity differential.     | +/- 0.10-2.00%  |
| Night Target Temperature.                     | +/- 0-35°c      |
| Max/Min Night Target Temperature differential.| +/- 0.10-2.00°c |
| Night Target Humidity.                        | +/- 20-100%     |
| Max/Min Night Target Humidity differential.   | +/- 0.10-2.00%  |
| Night Mode Start Time.                        | 0-23H 0-59M     |
| Night Mode Finish Time.                       | 0-23H 0-59M     |
| Day Light Saving                              | On/Off          |
| Menu Exit.                                    |                 |

## Notes for setup:
All settings are accessed by pressing the rotary encoder once. From here rotate the button clockwise/anti-clockwise to reach desired menu option. To enter each menu press the button again, to exit a certain menu once agin press the button. To exit the settings menu either scroll to the exit menu option and press the button, or hold the button down to activate the manual reset. Either option can be used but it is better to scroll to the exit option.

* Night Start/Finish:

Night start and finish times can never be the same, if the hours and minutes are the same, the finish time will always be plus 5 minutes.

* Differential:

The differential is +/- the value that is set by the user, as an example, if the user sets the value 0.5°c as the temperature differential, and has a target temperature of 20°c, as has temperature meets its target it will enter a so-called dead zone, between the differential values and the set point value (Fig 4), At this point, the Hvac will remain dormant neither heating nor cooling as the desired setpoint has been reached. 

### (Fig 4)
<div align="center"><img src="https://github.com/jonathanw82/HVAC-Controller/blob/main/media/diff.jpg" alt="diff example" width="100%"/></div> 


If the temperature continues to rise and meets the upper differential 20.5°c, the Hvac will start to cool to bring down the temperature, once the setpoint 20°c has been met, the Hvac once again enters the dead zone (between the setpoint and differential) the same will happen if the temperature drops and meets the lower differential of now 19.5°c the Hvac will start to Heat until it meets the setpoint 20°c and enters the dead zone once again.

Ther differential can be set from 0.10°c to 2°c it is recommended to use 0.5°c, the differentail only needs to be set once and will be used for the upper and lower values.

* Constant Day & Night:

If the user wants to have constant temperature and humidity without the Day/Night frequency, set the day and night temperatrure/humidity and diffential all to the same.

* Day light Saving:

Setting day light saving is done explicitly by the user, this is not done automatically, this is done on purpose as crops in controlled enviroments do not neccaraly need day light saving. If the Real Time Clock needs updating, it is imporant that if, the actual current time, is currently british summertime hour +1, The time entered is Coordinated Universal Time (UTC) to allow the user, explicit contol of daylight saving.

#
## Real time Clock (RTC):
It is worth noting that the Controllino has a built-in battery to hold the RTC  when there is no external power, however it only holds the RTC for about 2 weeks, after this time the RTC may need resetting.

To set the RTC, you will require a laptop or similar device, with the [Arduino Ide](https://www.arduino.cc/en/software) software installed and set up correctly to do this open the Arduino Ide, go to File, Preferences, under the settings tab locate the  "Additional boards manager URLs", then put a comma after the anything already in the box then append this line of code https://raw.githubusercontent.com/CONTROLLINO-PLC/CONTROLLINO_Library/master/Boards/package_ControllinoHardware_index.json you will then need to go to tools, board, board manger, then search for Controllino and install, the last step to install go to sketch, include library, manage libraries search and install Controllino, you will now need a USB to USB B cable, and the relevant Hvac firmware, please make a note of the correct firmware version, this can be obtained by entering the menu system by pressing the encoder button. (Fig 5)

### (Fig 5)
<div align="center"><img src="https://github.com/jonathanw82/HVAC-Controller/blob/main/media/lcd.jpg" alt="Setup of real time clock" width="50%"/></div>
<br/>

Open the firmware in the Arduino IDE, when flashing the Controllino for the first time or setting the RTC, the line of code under the void setup() section, named Controllino_SetTimeDate(), will need to be uncommented. (Fig 6)
<br/>

### (Fig 6)
<div align="center"><img src="https://github.com/jonathanw82/HVAC-Controller/blob/main/media/RTCready.jpg" alt="Setup of real time clock" width="100%"/></div>

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

<div align="center"><img src="https://github.com/jonathanw82/HVAC-Controller/blob/main/media/RTcommeted.jpg" alt="Setup of real time clock" width="100%"/></div>


It is possible to the allow the code to automatically update the clock when the firmware is up loaded, however this will interfear with the UTC time if done in BST.


#

## Version 2.00:

Version 2.00 is in the pipe line featuring a plethora of other features for better UI and control, including:
* Error feeback from the Hvac itself,
* MQTT,
* Led Display with touch screen,
* Backend database,
* Graphs with historical data,
* Access control for User/Engineer,
* Possible remote control access (TBC).

## Credits:

Idaes for day night https://forum.arduino.cc/t/check-if-time-is-between-two-time-inputs/517765/23?page=2

Ideas for PID https://www.youtube.com/watch?v=LXhTFBGgskI

[Back_to_top](#HVAC-Controller)
