# from typing import Any

# from paho.mqtt.client import Client

# from .settings import MQTT_HOST, MQTT_PORT, MQTT_PUBLISH

# HOST = MQTT_HOST
# PORT = MQTT_PORT
# PUBLISH_PATH = MQTT_PUBLISH


# def send_messages_mqtt(client: Any, msg: Any) -> None:
#     """Send messages to mqtt server"""

#     print("here")
#     client = Client()
#     client.connect(HOST, PORT, 60)
#     print("Send to Mqtt >>>> " + msg.topic + "=" + msg.message)
#     client.publish(PUBLISH_PATH + msg.topic, msg.message)
