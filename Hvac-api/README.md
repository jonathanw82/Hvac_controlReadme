Hvac Control Interface
For use with Hvac control firmware [here]()


## Pi setup and deployment

* Install Raspian [here](https://www.raspberrypi.com/software/operating-systems/)
* While flashing the sd card setup wifi with passwords etc and then setup ssh 
* Setup the graphics congif file more can ber found [here](https://www.waveshare.com/wiki/7inch_HDMI_LCD)
* Disable blank screen via desktop 
* Check IP adresses using ifconfig
* setup static IP address for wired connection & assign an IP address the same as on the Hvac control firmware 192.168.88.1
* Download the repository to desktop
* Install doker and docker compose
* Move to the repo directory 
* now place the autostart.txt data in to a file called autostart.desktop and place it in the file .config/autostart directory
* make the file executable sudo chmod 770 autostart.desktop
* make the file Desktop/Hvac_django/autostart.sh executable sudo chmod 770 autostartup.sh
* docker-compose build
* docker-compose up 
* docker ps to see the container_id for the next step
* docker exec -it container_id python manage.py createsuperuser 
* go to the webpage and go to admin terminal then create a hvac device using mac address(A3:40:20:6F:73:3B)
* go the login and admin on the webpage and reboot the contollino.
* reboot the Pi sudo reboot now


credit:

Pi screen Bezel 3d print
https://www.thingiverse.com/thing:3664665

Bezel Update by Temi Odanye

HTML virtual keyboard
https://virtual-keyboard.js.org/


https://www.amazon.co.uk/Raspberry-LCD-Resistive-HDMI-Interface/dp/B07V5WDW4P


192.168.1.226
