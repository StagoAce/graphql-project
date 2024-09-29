import graphene
from graphene_django import DjangoObjectType
from ..models import Razas
import requests
from django.http import JsonResponse

BASE_URL = "http://127.0.0.1:8000/api/v1/clientes/"

class RazaType(DjangoObjectType):
    class Meta:
        model = Razas
        fields = ("idrazas", "name")
