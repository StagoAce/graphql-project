import graphene
from graphene_django import DjangoObjectType
from ..models import Porcinos
import requests
from django.http import JsonResponse

BASE_URL = "http://127.0.0.1:8000/api/v1/porcinos/"

class PorcinoType(DjangoObjectType):
    class Meta:
        model = Porcinos
        fields = ("idporcinos","edad","peso","razas_idrazas","clientes_cedula")

class Query(graphene.ObjectType):
    porcinos = graphene.List(PorcinoType)


    def resolve_porcinos(self, info):
        url = BASE_URL + ""
        query = ""
        json_query = {'query': query}
        response = requests.get(url, json=json_query)
        
        if response.status_code == 200:
            data = response.json()
            # Convierte cada cliente en una instancia de ClienteType
            return [PorcinoType(**porcino) for porcino in data]
        else:
            return JsonResponse({'error': 'Error al consumir la API'}, status=response.status_code)