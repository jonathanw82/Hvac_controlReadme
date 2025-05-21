from typing import Any

from django.core.handlers.wsgi import WSGIRequest
from django.shortcuts import render


def chart(request: WSGIRequest) -> Any:
    """View to display the charts page"""

    return render(request, "charts/chart.html")
