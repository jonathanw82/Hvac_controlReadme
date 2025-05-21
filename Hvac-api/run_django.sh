#!/bin/bash
set -x
python3 manage.py migrate
nginx -c config/nginx.conf -p /src
gunicorn hvac_control.wsgi --threads 4