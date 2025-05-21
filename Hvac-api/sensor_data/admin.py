from django.contrib import admin

from sensor_data.models import HvacController, MeasurementBool, MeasurementFloat

admin.site.register(HvacController)
admin.site.register(MeasurementFloat)
admin.site.register(MeasurementBool)
