from typing import Any

from django.contrib.auth.decorators import login_required
from django.core.handlers.wsgi import WSGIRequest
from django.shortcuts import render


def home(request: WSGIRequest) -> Any:
    """View to display the home page"""

    return render(request, "home/index.html")


def info(request: WSGIRequest) -> Any:
    """View to display the info page"""

    return render(request, "home/info.html")


@login_required
def login(request: WSGIRequest) -> Any:
    """View to display the info page"""

    return render(request, "charts/chart.html")


@login_required
def userAdmin(request: WSGIRequest) -> Any:
    """View to display the admin page"""

    return render(request, "home/admin.html")


@login_required
def mqttinfo(request: WSGIRequest) -> Any:
    """View to display mqtt commands page"""

    return render(request, "home/mqttinfo.html")
