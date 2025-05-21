from pathlib import Path

import yaml
# from django import conf

config_file = Path(__file__).parent / "config.yaml"

if config_file.exists():
    config = yaml.safe_load(config_file.read_text()) or {}
    MQTT_HOST = config.get("MQTT_HOST", "localhost")
    MQTT_PORT = config.get("MQTT_PORT", 1883)
    MQTT_PUBLISH = config.get("MQTT_PUBLISH", "publish/path")
else:
    raise ValueError("Unable to find config file")
