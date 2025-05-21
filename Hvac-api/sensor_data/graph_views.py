import collections
import http
from datetime import datetime, timedelta
from operator import itemgetter

from django.db import connection
from rest_framework.response import Response
from rest_framework.views import APIView


class GraphData(APIView):
    """Graph data class to return averaged values over time"""

    def get(
        self, request: str, measurement_type: str, hours_of_history: int
    ) -> Response:
        """Return specific averaged measurement values over a time period"""

        valid_types = [
            "temp",
            "hum",
            "temp_p_response",
            "temp_i_response",
            "hum_p_response",
            "hum_i_response",
        ]

        if measurement_type not in valid_types:
            return Response(
                "invalid measurement type", status=http.HTTPStatus.BAD_REQUEST
            )

        with connection.cursor() as cursor:
            now = datetime.now()
            startpoint = now - timedelta(hours=hours_of_history)
            cursor.execute(
                """
                select DISTINCT strftime(%s, time_stamp) as timestamp, avg(value) over (
                    PARTITION by strftime(%s, time_stamp), measurement_type
                    ) as avg

                from sensor_data_measurementfloat
                where measurement_type = %s
                and time_stamp > datetime(%s)
                ;
                """,
                [
                    "%Y-%m-%d %H:%M:00",
                    "%Y%m%d%j%H%M",
                    measurement_type,
                    startpoint.isoformat(),
                ],
            )
            rows = cursor.fetchall()
            data_output = collections.OrderedDict(rows)
            startpoint = startpoint.replace(second=0, microsecond=0)

            while startpoint < now:
                if startpoint.isoformat(" ") not in data_output:
                    data_output[startpoint.isoformat(" ")] = None
                startpoint = startpoint + timedelta(minutes=1)

        return Response(sorted(data_output.items(), key=itemgetter(0)))
