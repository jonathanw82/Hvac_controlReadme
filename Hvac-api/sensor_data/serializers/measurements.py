import datetime
from typing import Dict

from rest_framework import serializers

from sensor_data.models import (
    HvacController,
    MeasurementBool,
    MeasurementFloat,
    MeasurementInt,
)


class FloatMeasurementsSerializer(serializers.Serializer):
    """Measurements Serializer"""

    device = serializers.SlugRelatedField(slug_field="id", read_only=True)
    mac_address = serializers.SlugRelatedField(
        slug_field="mac_address", queryset=HvacController.objects.all(), write_only=True
    )
    time_stamp = serializers.DateTimeField(default=datetime.datetime.now)
    measurement_type = serializers.ChoiceField(
        choices=MeasurementFloat.Measurement_Type.choices,
    )
    value = serializers.FloatField()

    def create(self, validated_data: Dict) -> "MeasurementFloat":
        """Create method for the serializer"""

        measurement = MeasurementFloat()

        measurement.device = validated_data["mac_address"]
        measurement.time_stamp = validated_data["time_stamp"]
        measurement.measurement_type = validated_data["measurement_type"]
        measurement.value = validated_data["value"]

        measurement.save()
        return measurement


class BoolMeasurementsSerializer(serializers.Serializer):
    """Measurements Serializer"""

    device = serializers.SlugRelatedField(slug_field="id", read_only=True)
    mac_address = serializers.SlugRelatedField(
        slug_field="mac_address", queryset=HvacController.objects.all(), write_only=True
    )
    time_stamp = serializers.DateTimeField(default=datetime.datetime.now)
    measurement_type = serializers.ChoiceField(
        choices=MeasurementBool.Measurement_Type.choices,
    )
    value = serializers.BooleanField()

    def create(self, validated_data: Dict) -> "MeasurementBool":
        """Create method for the serializer"""

        measurement = MeasurementBool()

        measurement.device = validated_data["mac_address"]
        measurement.time_stamp = validated_data["time_stamp"]
        measurement.measurement_type = validated_data["measurement_type"]
        measurement.value = validated_data["value"]

        measurement.save()
        return measurement


class IntMeasurementsSerializer(serializers.Serializer):
    """Measurements Serializer"""

    device = serializers.SlugRelatedField(slug_field="id", read_only=True)
    mac_address = serializers.SlugRelatedField(
        slug_field="mac_address", queryset=HvacController.objects.all(), write_only=True
    )
    time_stamp = serializers.DateTimeField(default=datetime.datetime.now)
    measurement_type = serializers.ChoiceField(
        choices=MeasurementInt.Measurement_Type.choices,
    )
    value = serializers.IntegerField()

    def create(self, validated_data: Dict) -> "MeasurementInt":
        """Create method for the serializer"""

        measurement = MeasurementInt()

        measurement.device = validated_data["mac_address"]
        measurement.time_stamp = validated_data["time_stamp"]
        measurement.measurement_type = validated_data["measurement_type"]
        measurement.value = validated_data["value"]

        measurement.save()
        return measurement
