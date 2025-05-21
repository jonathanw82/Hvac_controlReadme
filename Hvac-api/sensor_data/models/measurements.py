import datetime

from django.db import models
from django.db.models import PROTECT


class MeasurementFloat(models.Model):
    """
    The measurement float model uses data enconded from the Mqtt

    messages to create the relevent measurement types
    """

    class Meta:
        """Meta data for indexing the time stamp"""

        indexes = [models.Index(fields=["time_stamp"], name="time_stamp_index")]

    class Measurement_Type(models.TextChoices):
        """Types of measurements"""

        TEMP = "temp"
        TEMP_PID_ERROR = "temp_pid_error"
        TEMP_P_RESPONSE = "temp_p_response"
        TEMP_I_RESPONSE = "temp_i_response"
        TEMP_D_RESPONSE = "temp_d_response"
        TEMP_PID_OUTPUT = "temp_pid_output"
        TEMP_HEAT_TIME_ON = "temp_heat_time_on"
        TEMP_HEAT_TIME_OFF = "temp_heat_time_off"

        HUM = "hum"
        HUM_PID_ERROR = "hum_pid_error"
        HUM_P_RESPONSE = "hum_p_response"
        HUM_I_RESPONSE = "hum_i_response"
        HUM_D_RESPONSE = "hum_d_response"
        HUM_PID_OUTPUT = "hum_pid_output"
        HUM_HEAT_TIME_ON = "hum_heat_time_on"
        HUM_HEAT_TIME_OFF = "hum_heat_time_off"

        ERROR_TEMP = "error_temp"
        ERROR_HUM = "error_hum"

    device = models.ForeignKey(
        "HvacController", on_delete=PROTECT, related_name="floatmeasurements"
    )
    time_stamp = models.DateTimeField(default=datetime.datetime.now)
    measurement_type = models.CharField(choices=Measurement_Type.choices, max_length=25)
    value = models.FloatField()

    def __str__(self):
        return f"{self.device}, {self.time_stamp}"


class MeasurementBool(models.Model):
    """
    The measurement bool model uses data enconded from the Mqtt

    messages to create the relevent measurement types.
    """

    class Measurement_Type(models.TextChoices):
        """Types of measurements"""

        TEMP_HEAT_OUTPUT = "temp_heat_output"
        TEMP_COOLING_OUTPUT = "temp_cooling_output"
        HUM_OUTPUT = "humidifier_output"
        DEHUM_OUTPUT = "dehumidifier_output"

    device = models.ForeignKey(
        "HvacController", on_delete=PROTECT, related_name="boolmeasurements"
    )
    time_stamp = models.DateTimeField(default=datetime.datetime.now)
    measurement_type = models.CharField(choices=Measurement_Type.choices, max_length=25)
    value = models.BooleanField()

    def __str__(self):
        return f"{self.device}, {self.time_stamp}"


class MeasurementInt(models.Model):
    """
    The measurement Int model uses data enconded from the Mqtt messages to

    create the relevent measurement types
    """

    class Measurement_Type(models.TextChoices):
        """Types of measurements"""

        NEXT_COMPUTE_PERIOD = "next_compute_period"

    device = models.ForeignKey(
        "HvacController", on_delete=PROTECT, related_name="intmeasurements"
    )
    time_stamp = models.DateTimeField(default=datetime.datetime.now)
    measurement_type = models.CharField(choices=Measurement_Type.choices, max_length=25)
    value = models.IntegerField()

    def __str__(self):
        return f"{self.device}, {self.time_stamp}"
