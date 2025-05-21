from enum import Enum
from typing import Any, Dict, List, NoReturn, Union

import requests
from paho.mqtt.client import Client
from settings import MQTT_HOST, MQTT_PORT, MQTT_PUBLISH

HOST = MQTT_HOST
PORT = MQTT_PORT
PUBLISH_PATH = MQTT_PUBLISH

base_url = "http://192.168.88.1/api/"

class ValueType(Enum):
    """Enum for value types"""

    FLOAT = 1
    STATICFLOAT = 2
    BOOL = 3
    STATICBOOL = 4
    INT = 5
    STATICINT = 6
    STRING = 7


def on_connect(client: Any, *args: List, **kwargs: Dict) -> None:
    """On connect print connected"""

    client.subscribe("#")
    print("connected to " + HOST)


def on_message(client: Any, userdata: Any, msg: Any) -> None:
    """Receive messages from mqtt"""

    topic_lookup = {
        "device_name": ("name", ValueType.STRING),
        "software_ver": ("software_version", ValueType.STRING),
        "location": ("location", ValueType.STRING),
        "time_on_off_period": ("time_period", ValueType.STATICINT),
        "next_compute_period": (
            "next_compute_period",
            ValueType.INT,
        ),  # The next time the pid compute function is called on the controllino
        "temp": ("temp", ValueType.FLOAT),
        "day_target_temp": ("target_temp", ValueType.STATICFLOAT),
        "night_target_temp": ("night_target_temp", ValueType.STATICFLOAT),
        "temp_error": ("temp_pid_error", ValueType.FLOAT),
        "temp_P": ("temp_p", ValueType.STATICFLOAT),
        "temp_I": ("temp_i", ValueType.STATICFLOAT),
        "temp_D": ("temp_d", ValueType.STATICFLOAT),
        "temp_P_response": ("temp_p_response", ValueType.FLOAT),
        "temp_I_response": ("temp_i_response", ValueType.FLOAT),
        "temp_D_response": ("temp_d_response", ValueType.FLOAT),
        "temp_output": ("temp_pid_output", ValueType.FLOAT),
        "heat_time_On": ("temp_heat_time_on", ValueType.FLOAT),
        "heat_time_Off": ("temp_heat_time_off", ValueType.FLOAT),
        "heating_output": ("temp_heat_output", ValueType.BOOL),
        "cooling_output": ("temp_cooling_output", ValueType.BOOL),
        "hum": ("hum", ValueType.FLOAT),
        "day_target_hum": ("target_hum", ValueType.STATICFLOAT),
        "night_target_hum": ("night_target_hum", ValueType.STATICFLOAT),
        "hum_error": ("hum_pid_error", ValueType.FLOAT),
        "hum_P": ("hum_p", ValueType.STATICFLOAT),
        "hum_I": ("hum_i", ValueType.STATICFLOAT),
        "hum_D": ("hum_d", ValueType.STATICFLOAT),
        "P_response": ("hum_p_response", ValueType.FLOAT),
        "I_response": ("hum_i_response", ValueType.FLOAT),
        "D_response": ("hum_d_response", ValueType.FLOAT),
        "hum_output": ("hum_pid_output", ValueType.FLOAT),
        "hum_time_On": ("hum_heat_time_on", ValueType.FLOAT),
        "hum_time_Off": ("hum_heat_time_off", ValueType.FLOAT),
        "humidifier_output": ("humidifier_output", ValueType.BOOL),
        "dehumidifier_output": ("dehumidifier_output", ValueType.BOOL),
        "night_day": ("night_day", ValueType.STATICBOOL),
        "night_start_hour": ("night_start_hour", ValueType.STATICINT),
        "night_start_minute": ("night_start_minute", ValueType.STATICINT),
        "night_finish_hour": ("night_finish_hour", ValueType.STATICINT),
        "night_finish_minute": ("night_finish_minute", ValueType.STATICINT),
        "error_temp": ("error_temp", ValueType.FLOAT),
        "error_hum": ("error_hum", ValueType.FLOAT),
        "standby": ("standby", ValueType.STATICBOOL),
        "daylight_saving": ("daylight_saving", ValueType.STATICBOOL),
        "skins": ("skins", ValueType.STATICBOOL),
    }
    """ Messages topics coming from mqtt are going to tuple that encodes the
        database type and type of measurment"""

    topic_list = msg.topic.split("/")

    if (topic_key := topic_list[-1]) in topic_lookup.keys():
        mac_address = topic_list[-3]
        measurement_type, value_type = topic_lookup[topic_key]

        if (
            value_type == ValueType.STATICINT
            or value_type == ValueType.STATICBOOL
            or value_type == ValueType.STRING
            or value_type == ValueType.STATICFLOAT
        ):
            put(measurement_type, msg.payload)
        else:
            post(mac_address, msg.payload, measurement_type, value_type)


def put(
    field_name: str,
    field_value: Union[int, str],
) -> None:
    """Put message data from mqtt to update the hvac_controller object with static values"""

    url = f"{base_url}hvac_controllers/1/"
    data = {field_name: field_value}
    try:
        requests.put(url, data=data, timeout=0.2)
    except requests.exceptions.ReadTimeout:
        print("timeout Error")


def post(
    mac_address: str, value: str, measurement_type: str, value_type: ValueType
) -> None:
    """Post messages from mqtt to relevent locations"""

    if value_type == ValueType.FLOAT:
        url = f"{base_url}float_measurements/"
    elif value_type == ValueType.BOOL:
        url = f"{base_url}bool_measurements/"
    elif value_type == ValueType.INT:
        url = f"{base_url}int_measurements/"
    else:
        print(f"Unknown type:{value_type}")
        return

    data = {
        "mac_address": mac_address,
        "value": value,
        "measurement_type": measurement_type,
    }
    try:
        requests.post(url, data=data, timeout=0.2)
    except requests.exceptions.ReadTimeout:
        print("timeout Error")


def main() -> NoReturn:
    """Mqtt listener loop"""
    print(f"Connecting to {HOST} on {PORT}")
    client = Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(HOST, PORT, 60)
    client.loop_forever()


if __name__ == "__main__":
    main()
