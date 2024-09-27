import graphene
from graphene_django import DjangoObjectType
from ..models import Alimentacion
import requests
from django.http import JsonResponse

BASE_URL = "http://127.0.0.1:8000/api/v1/alimentos/"

class AlimentacionType(DjangoObjectType):
    class Meta:
        model = Alimentacion
        fields = ("idalimentacion", "descripcion", "dosis")

class Query(graphene.ObjectType):
    alimentos = graphene.List(AlimentacionType)
    alimento = graphene.Field(AlimentacionType, idalimentacion=graphene.ID())

    def resolve_alimentos(self, info):
        url = BASE_URL + ""
        query = ""
        json_query = {'query': query}
        response = requests.get(url, json=json_query)
        
        if response.status_code == 200:
            data = response.json()
            # Convierte cada cliente en una instancia de ClienteType
            return [Alimentacion(**alimento) for alimento in data]
        else:
            return JsonResponse({'error': 'Error al consumir la API'}, status=response.status_code)
    
    def resolve_alimento(self, info, idalimentacion):
        url = BASE_URL + idalimentacion + "/"
        query = ""
        json_query = {'query': query}
        response = requests.get(url, json=json_query)

        if response.status_code == 200:
            data = response.json()
            # Convierte cada cliente en una instancia de ClienteType
            return Alimentacion(**data)
        else:
            return JsonResponse({'error': 'Error al consumir la API'}, status=response.status_code)
        
    