import graphene
from graphene_django import DjangoObjectType
from ..models import Razas
import requests
from django.http import JsonResponse

BASE_URL = "http://127.0.0.1:8000/api/v1/razas/"

class RazaType(DjangoObjectType):
    class Meta:
        model = Razas
        fields = ("idrazas", "name")

class Query(graphene.ObjectType):
    razas = graphene.List(RazaType)  # Consulta para obtener todas las razas
    raza = graphene.Field(RazaType, idrazas=graphene.ID(required=True))  # Consulta para obtener una raza específica

    def resolve_razas(self, info):
        url = BASE_URL + ""  # Ajusta esta URL según sea necesario
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            # Convierte cada raza en una instancia de RazaType
            return [Razas(**raza) for raza in data]  # Asegúrate de que `data` sea una lista de dicts
        else:
            raise Exception('Error al consumir la API: {}'.format(response.status_code))

    def resolve_raza(self, info, idrazas):
        url = BASE_URL + f"{idrazas}/"  # Ajusta esta URL según sea necesario
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            # Asegúrate de que `data` sea un dict que representa una sola raza
            return Razas(**data)
        else:
            raise Exception('Error al consumir la API: {}'.format(response.status_code))

