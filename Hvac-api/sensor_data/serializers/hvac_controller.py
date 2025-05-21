import re
from typing import Dict

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from sensor_data.models import HvacController


class HvacControllerSerializer(serializers.Serializer):
    """Hvac controller serializer"""

    id = serializers.PrimaryKeyRelatedField(read_only=True)
    uuid = serializers.UUIDField(read_only=True)
    mac_address = serializers.CharField(max_length=50)
    name = serializers.CharField(max_length=50)
    location = serializers.CharField(max_length=50)
    host_name = serializers.CharField(max_length=50)
    software_version = serializers.CharField(max_length=50)
    night_day = serializers.BooleanField(default=None, required=False)
    temp_p = serializers.FloatField(default=None, required=False)
    temp_i = serializers.FloatField(default=None, required=False)
    temp_d = serializers.FloatField(default=None, required=False)
    hum_p = serializers.FloatField(default=None, required=False)
    hum_i = serializers.FloatField(default=None, required=False)
    hum_d = serializers.FloatField(default=None, required=False)
    target_temp = serializers.FloatField(default=None, required=False)
    night_target_temp = serializers.FloatField(default=None, required=False)
    target_hum = serializers.FloatField(default=None, required=False)
    night_target_hum = serializers.FloatField(default=None, required=False)
    time_period = serializers.IntegerField(default=None, required=False)
    night_start_hour = serializers.IntegerField(default=None, required=False)
    night_finish_hour = serializers.IntegerField(default=None, required=False)
    night_start_minute = serializers.IntegerField(default=None, required=False)
    night_finish_minute = serializers.IntegerField(default=None, required=False)
    standby = serializers.BooleanField(default=None, required=False)
    daylight_saving = serializers.BooleanField(default=None, required=False, allow_null=True)
    skins =  serializers.BooleanField(default=False)

    def create(self, validated_data: Dict) -> HvacController:
        """Creata a new instance of a Hvac controller"""

        hvaccontroller = HvacController.new_hvac_controller(
            name=validated_data["name"],
            location=validated_data["location"],
            mac=validated_data["mac_address"],
            host=validated_data["host_name"],
            software=validated_data["software_version"],
        )
        hvaccontroller.save()
        return hvaccontroller

    def validate_mac_address(self, data: str) -> str:
        """Validate mac address for valid format"""

        pattern = r"^(\w){2}:(\w){2}:(\w){2}:(\w){2}:(\w){1,2}:(\w){1,2}$"
        if not re.match(pattern, data):
            raise ValidationError("invalid mac address format")
        # if HvacController.objects.filter(mac_address=data).exists():
        #     raise ValidationError("Mac address already exists")
        return data

    def validate_name(self, data: str) -> str:
        """Make name lower case"""

        return data.lower()

    def validate_location(self, data: str) -> str:
        """Make location lower case"""

        return data.lower()

    def update(self, instance: HvacController, validated_data: Dict) -> HvacController:
        """Update a single record"""

        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance
