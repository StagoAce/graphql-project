import graphene
from graphene_django import DjangoObjectType
from .models import *
import requests
from django.http import JsonResponse

BASE_URL = "http://127.0.0.1:8000/api/v1/"

class ClienteType(DjangoObjectType):
    class Meta:
        model = Clientes
        fields = ("cedula", "nombre", "apellidos", "direccion", "telefono")

class Query(graphene.ObjectType):
    clientes = graphene.List(ClienteType)

    def resolve_clientes(self, info):
        url = BASE_URL + "clientes/"
        query = ""
        json_query = {'query': query}
        response = requests.get(url, json=json_query)
        
        if response.status_code == 200:
            data = response.json()
            
            # Convierte cada cliente en una instancia de ClienteType
            return [Clientes(**cliente) for cliente in data]
        else:
            return JsonResponse({'error': 'Error al consumir la API'}, status=response.status_code)

# Define el esquema GraphQL
schema = graphene.Schema(query=Query)