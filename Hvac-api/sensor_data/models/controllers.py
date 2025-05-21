import uuid
from typing import Type

from django.db import models


class HvacController(models.Model):
    """Hvac controller model"""

    name = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    uuid = models.UUIDField(unique=True, default=uuid.uuid4)
    mac_address = models.CharField(max_length=50, unique=True, blank=True)
    host_name = models.CharField(max_length=50, help_text="Mqtt host", blank=True)
    software_version = models.CharField(max_length=50, blank=True)
    night_day = models.BooleanField(default=None, blank=True)
    temp_p = models.FloatField(null=True, default=None, blank=True)
    temp_i = models.FloatField(null=True, default=None, blank=True)
    temp_d = models.FloatField(null=True, default=None, blank=True)
    hum_p = models.FloatField(null=True, default=None, blank=True)
    hum_i = models.FloatField(null=True, default=None, blank=True)
    hum_d = models.FloatField(null=True, default=None, blank=True)
    target_temp = models.FloatField(null=True, default=None, blank=True)
    night_target_temp = models.FloatField(null=True, default=None, blank=True)
    target_hum = models.FloatField(null=True, default=None, blank=True)
    night_target_hum = models.FloatField(null=True, default=None, blank=True)
    time_period = models.IntegerField(null=True, default=None, blank=True)
    night_start_hour = models.IntegerField(null=True, default=None, blank=True)
    night_finish_hour = models.IntegerField(null=True, default=None, blank=True)
    night_start_minute = models.IntegerField(null=True, default=None, blank=True)
    night_finish_minute = models.IntegerField(null=True, default=None, blank=True)
    standby = models.BooleanField(default=None, blank=True, null=True)
    daylight_saving = models.BooleanField(default=None, blank=True, null=True)
    skins = models.BooleanField(default=False)

    @classmethod
    def new_hvac_controller(
        cls: Type["HvacController"],
        name: str,
        location: str,
        mac: str,
        host: str,
        software: str,
    ) -> "HvacController":
        """Public interface for correctly creating a hvac controller"""

        hvac_controller = cls(
            name=name,
            location=location,
            mac_address=mac,
            host_name=host,
            software_version=software,
        )
        return hvac_controller
