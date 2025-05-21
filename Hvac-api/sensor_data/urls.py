from django.urls import path

from sensor_data.graph_views import GraphData
from sensor_data.views import (  # IDHvacControllerView,
    BoolMeasurementView,
    FloatMeasurementView,
    HvacControllerView,
    IDHvacControllerView,
    IntMeasurementView,
    LastBoolMeasurementView,
    LastFloatMeasurementView,
    SendMqttMessagesView,
)

urlpatterns = [
    path("hvac_controllers/", HvacControllerView.as_view(), name="hvac_controllers"),
    path(
        "hvac_controllers/<int:record_id>/",
        IDHvacControllerView.as_view(),
        name="IDHvac_controllers",
    ),
    path(
        "float_measurements/", FloatMeasurementView.as_view(), name="float_measurements"
    ),
    path("bool_measurements/", BoolMeasurementView.as_view(), name="bool_measurements"),
    path("int_measurements/", IntMeasurementView.as_view(), name="int_measurements"),
    path(
        "last_measurement/float/<str:measurement_type>/",
        LastFloatMeasurementView.as_view(),
    ),
    path(
        "last_measurement/bool/<str:measurement_type>/",
        LastBoolMeasurementView.as_view(),
    ),
    path("send_mqtt_message/", SendMqttMessagesView.as_view()),
    path(
        "graph_data/<str:measurement_type>/<int:hours_of_history>/", GraphData.as_view()
    ),
]
