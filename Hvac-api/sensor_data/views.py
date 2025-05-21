import datetime
import http
from typing import Callable

import django_filters
from django.db.models import QuerySet
from paho.mqtt.client import Client
from rest_framework import serializers
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from mqtt.settings import MQTT_HOST, MQTT_PORT, MQTT_PUBLISH
from sensor_data.models import (
    HvacController,
    MeasurementBool,
    MeasurementFloat,
    MeasurementInt,
)
from sensor_data.serializers.hvac_controller import HvacControllerSerializer
from sensor_data.serializers.measurements import (
    BoolMeasurementsSerializer,
    FloatMeasurementsSerializer,
    IntMeasurementsSerializer,
)


class HvacControllerView(APIView):
    """Hvac controller endpoints"""

    def get(self, request: Request) -> Response:
        """Return all hvac controllers in system"""

        query_set = HvacController.objects.all()
        # filtered_qs = self.Filter(request.query_params, queryset=query_set).qs
        serializer = HvacControllerSerializer(query_set, many=True)
        return Response(serializer.data)

    def post(self, request: Request) -> Response:
        """Post data to create a new hvac object"""

        serializer = HvacControllerSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=http.HTTPStatus.BAD_REQUEST)
        hvac_controller = serializer.save()
        json_data = HvacControllerSerializer(hvac_controller)
        return Response(json_data.data, status=http.HTTPStatus.CREATED)


def get_record_instance(func: Callable) -> Callable:
    """Error handling decorator"""

    def _wrapper(
        cls: "IDHvacControllerView", request: Request, record_id: int
    ) -> Response:
        try:
            record = HvacController.objects.get(id=record_id)
        except HvacController.DoesNotExist:
            message = "ID does not exist"
            return Response(message, status=http.HTTPStatus.BAD_REQUEST)
        return func(cls, request, record_id, record)

    return _wrapper


class IDHvacControllerView(APIView):
    """Hvac controller single entry endpoint"""

    @get_record_instance
    def get(
        self, request: Request, record_id: int, record: HvacController = None
    ) -> Response:
        """Get an instance of a single record"""

        serializer = HvacControllerSerializer(record, many=False)
        return Response(serializer.data)

    @get_record_instance
    def put(
        self, request: Request, record_id: int, record: HvacController = None
    ) -> Response:
        """Update a single record"""

        serializer = HvacControllerSerializer(
            data=request.data, instance=record, partial=True
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=http.HTTPStatus.BAD_REQUEST)

        hvac_controller = serializer.save()
        json_data = HvacControllerSerializer(hvac_controller)
        return Response(json_data.data, status=http.HTTPStatus.OK)

    @get_record_instance
    def delete(
        self, request: Request, record_id: int, record: HvacController = None
    ) -> Response:
        """Delete a single record"""

        record.delete()
        message = f"Record id={record_id} has been deleted"
        return Response(message)


class FloatMeasurementView(GenericAPIView):
    """Hvac controller float view handle time series float data.

    The data can be sorted by appanding ? then page_size=10 to reduce the page numbers to 10
    followed by & then page_number=2 etc for paginated pages.
    Specific measurements can be sorted using ?measurement_type=temp etc.
    """

    serializer_class = FloatMeasurementsSerializer
    model = MeasurementFloat

    class Filter(django_filters.FilterSet):
        """Filter results for the exact required measurements"""

        class Meta:
            """Meta data for filter class"""

            model = MeasurementFloat
            fields = {
                "measurement_type": ["exact", "in"],
                "time_stamp": ["lt", "gt", "range", "year"],
                "device_id": ["exact", "in", "lt", "gt", "lte", "gte"],
                "value": ["exact", "in", "lt", "gt", "range", "lte", "gte"],
            }

        in_hour = django_filters.BooleanFilter(
            method="get_within_hour",
        )

        in_24_hours = django_filters.BooleanFilter(
            method="get_within_24_hours",
        )

        in_one_week = django_filters.BooleanFilter(
            method="get_within_one_week",
        )

        in_two_weeks = django_filters.BooleanFilter(
            method="get_within_two_weeks",
        )

        def get_within_hour(
            self, queryset: QuerySet, name: str, value: bool
        ) -> QuerySet:
            """Check to see if the time is within the hour"""

            if not value:
                return queryset

            time_threshold = datetime.datetime.now() - datetime.timedelta(hours=1)
            return queryset.order_by("-time_stamp").filter(
                time_stamp__gte=time_threshold
            )

        def get_within_24_hours(
            self, queryset: QuerySet, name: str, value: bool
        ) -> QuerySet:
            """Check to see if the time is within 12 hours"""

            if not value:
                return queryset

            time_threshold = datetime.datetime.now() - datetime.timedelta(hours=24)
            return queryset.order_by("-time_stamp").filter(
                time_stamp__gte=time_threshold
            )

        def get_within_one_week(
            self,
            queryset: QuerySet,
            name: str,
            value: bool,
        ) -> QuerySet:
            """Filter to get items for one week"""

            if not value:
                return queryset

            date_threshold = datetime.datetime.now() - datetime.timedelta(days=7)
            return queryset.order_by("-time_stamp").filter(
                time_stamp__gte=date_threshold
            )

        def get_within_two_weeks(
            self,
            queryset: QuerySet,
            name: str,
            value: bool,
        ) -> QuerySet:
            """Filter to get items for two weeks"""

            if not value:
                return queryset

            date_threshold = datetime.datetime.now() - datetime.timedelta(days=14)
            return queryset.order_by("-time_stamp").filter(
                time_stamp__gte=date_threshold
            )

    def get_queryset(self) -> QuerySet:
        """Return all objects in the queryset"""

        return MeasurementFloat.objects.all().order_by("time_stamp")

    def get(self, request: Request) -> Response:
        """Return all hvac float measurements in system"""

        query_set = self.model.objects.all()
        filter = self.Filter(request.query_params, queryset=query_set)
        if not filter.is_valid():
            return Response(filter.errors, status=400)
        filtered_qs = filter.qs
        page_size = int(request.query_params.get("page_size", 1000))
        page_number = int(request.query_params.get("page_number", 1))
        start_idx = 0 + ((page_number - 1) * page_size)
        end_idx = (page_size - 1) + ((page_number - 1) * page_size)
        data = filtered_qs[start_idx:end_idx].values(
            "measurement_type", "value", "time_stamp"
        )
        return Response(data)

    def post(self, request: Request) -> Response:
        """Post data to create a new measurement object"""

        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=http.HTTPStatus.BAD_REQUEST)
        serializer = serializer.save()
        json_data = self.serializer_class(serializer)
        return Response(json_data.data, status=http.HTTPStatus.CREATED)


class BoolMeasurementView(GenericAPIView):
    """Hvac controller boolean view handles time series boolean data"""

    serializer_class = BoolMeasurementsSerializer
    model = MeasurementBool

    class Filter(django_filters.FilterSet):
        """Filter results for the exact required measurements"""

        class Meta:
            """Meta data for filer class"""

            model = MeasurementBool
            fields = {
                "measurement_type": ["exact", "in"],
                "time_stamp": ["lt", "gt", "range", "year"],
                "device_id": ["exact", "in", "lt", "gt", "lte", "gte"],
                "value": ["exact", "in", "lt", "gt", "range", "lte", "gte"],
            }

    def get_queryset(self) -> QuerySet:
        """Return all objects in the queryset"""

        return MeasurementBool.objects.all()

    def get(self, request: Request) -> Response:
        """Return all hvac bool measurements in system"""

        query_set = self.model.objects.all()
        filtered_qs = self.Filter(request.query_params, queryset=query_set).qs
        page_size = int(request.query_params.get("page_size", 1000))
        page_number = int(request.query_params.get("page_number", 1))
        start_idx = 0 + ((page_number - 1) * page_size)
        end_idx = (page_size - 1) + ((page_number - 1) * page_size)
        data = filtered_qs[start_idx:end_idx].values(
            "device_id", "time_stamp", "measurement_type", "value"
        )
        return Response(data)

    def post(self, request: Request) -> Response:
        """Post data to create a new measurement object"""

        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=http.HTTPStatus.BAD_REQUEST)
        serializer = serializer.save()
        json_data = self.serializer_class(serializer)
        return Response(json_data.data, status=http.HTTPStatus.CREATED)


class IntMeasurementView(GenericAPIView):
    """Hvac controller int view to handle all integer mneasurements"""

    serializer_class = IntMeasurementsSerializer
    model = MeasurementInt

    class Filter(django_filters.FilterSet):
        """Filter results for the exact required measurements"""

        class Meta:
            """Meta data for filer class"""

            model = MeasurementBool
            fields = {
                "measurement_type": ["exact", "in"],
                "time_stamp": ["lt", "gt", "range", "year"],
                "device_id": ["exact", "in", "lt", "gt", "lte", "gte"],
                "value": ["exact", "in", "lt", "gt", "range", "lte", "gte"],
            }

    def get_queryset(self) -> QuerySet:
        """Return all objects in the queryset"""

        return MeasurementInt.objects.all()

    def get(self, request: Request) -> Response:
        """Return all hvac int measurements in system"""

        query_set = self.model.objects.all()
        filtered_qs = self.Filter(request.query_params, queryset=query_set).qs
        page_size = int(request.query_params.get("page_size", 1000))
        page_number = int(request.query_params.get("page_number", 1))
        start_idx = 0 + ((page_number - 1) * page_size)
        end_idx = (page_size - 1) + ((page_number - 1) * page_size)
        data = filtered_qs[start_idx:end_idx].values(
            "device_id", "measurement_type", "value", "time_stamp"
        )
        return Response(data)

    def post(self, request: Request) -> Response:
        """Post data to create a new measurement object"""

        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=http.HTTPStatus.BAD_REQUEST)
        serializer = serializer.save()
        json_data = self.serializer_class(serializer)
        return Response(json_data.data, status=http.HTTPStatus.CREATED)


class LastFloatMeasurementView(GenericAPIView):
    """A view to get the last float measurement submitted to the database"""

    serializer_class = FloatMeasurementsSerializer
    model = MeasurementFloat

    def get(self, request: Request, measurement_type: str) -> Response:
        """Locate the last entered measurement"""

        if measurement_type not in self.model.Measurement_Type.values:
            return Response(
                "Unknown measurement type", status=http.HTTPStatus.BAD_REQUEST
            )

        qs = self.model.objects.filter(measurement_type=measurement_type).last()
        return Response(self.serializer_class(qs).data)


class LastBoolMeasurementView(GenericAPIView):
    """A view to get the last bool measurement submitted to the database"""

    serializer_class = BoolMeasurementsSerializer
    model = MeasurementBool

    def get(self, request: Request, measurement_type: str) -> Response:
        """Locate the last entered measurement"""

        if measurement_type not in self.model.Measurement_Type.values:
            return Response(
                "Unknown measurement type", status=http.HTTPStatus.BAD_REQUEST
            )

        qs = self.model.objects.filter(measurement_type=measurement_type).last()
        return Response(self.serializer_class(qs).data)


class SendMqttMessagesView(APIView):
    """Send data to mqtt via this view"""

    class MqttSerializer(serializers.Serializer):
        """Serialize being sent from the front end to the mqtt client"""

        topic = serializers.ChoiceField(
            choices=[
                "temp_P",
                "temp_I",
                "temp_D",
                "target_temp",
                "night_target_temp",
                "target_hum",
                "night_target_hum",
                "time_period",
                "night_hour_start",
                "night_minute_start",
                "night_hour_finish",
                "night_minute_finish",
                "hum_P",
                "hum_I",
                "hum_D",
                "reset",
                "standby",
                "daylight_saving",
                "skins",
            ]
        )
        payload = serializers.CharField(max_length=1000)

    serializer_class = MqttSerializer

    def post(self, request: Request) -> Response:
        """Print the incomming data"""
        print(request.data)
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=http.HTTPStatus.BAD_REQUEST)

        HOST = MQTT_HOST
        PORT = MQTT_PORT
        PUBLISH_PATH = MQTT_PUBLISH
        client = Client()
        client.connect(HOST, PORT, 60)
        client.publish(
            PUBLISH_PATH + serializer.validated_data["topic"],
            serializer.validated_data["payload"],
        )
        return Response("ok")
