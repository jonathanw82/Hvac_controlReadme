#!/bin/bash
chromium-browser --kiosk --app=http://localhost/ --disable-session-crashed-bubble --start-fullscreen --force-device-scale-factor=1
(while sleep 10000; do xdotool key ctrl+R; done) &