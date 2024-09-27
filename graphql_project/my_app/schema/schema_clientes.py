import graphene
from graphene_django import DjangoObjectType
from ..models import Clientes
import requests
from django.http import JsonResponse

BASE_URL = "http://127.0.0.1:8000/api/v1/clientes/"

class ClienteType(DjangoObjectType):
    class Meta:
        model = Clientes
        fields = ("cedula", "nombre", "apellidos", "direccion", "telefono")

class CreateClienteMutation(graphene.Mutation):
    class Arguments:
        cedula = graphene.Int()
        nombre = graphene.String()
        apellidos = graphene.String()
        direccion = graphene.String()
        telefono = graphene.Int()
    
    cliente = graphene.Field(ClienteType)

    def mutate(self, info, cedula, nombre, apellidos, direccion, telefono):
        cliente = Clientes(
            cedula = cedula,
            nombre = nombre,
            apellidos = apellidos,
            direccion = direccion,
            telefono = telefono
        )

        url = BASE_URL + ""
        query = cliente
        json_query = {'query': query}
        response = requests.post(url, json=json_query)

        

class Query(graphene.ObjectType):
    clientes = graphene.List(ClienteType)
    cliente = graphene.Field(ClienteType, cedula=graphene.ID())

    def resolve_clientes(self, info):
        url = BASE_URL + ""
        query = ""
        json_query = {'query': query}
        response = requests.get(url, json=json_query)
        
        if response.status_code == 200:
            data = response.json()
            # Convierte cada cliente en una instancia de ClienteType
            return [Clientes(**cliente) for cliente in data]
        else:
            return JsonResponse({'error': 'Error al consumir la API'}, status=response.status_code)
    
    def resolve_cliente(self, info, cedula):
        url = BASE_URL + cedula + "/"
        query = ""
        json_query = {'query': query}
        response = requests.get(url, json=json_query)

        if response.status_code == 200:
            data = response.json()
            # Convierte cada cliente en una instancia de ClienteType
            return Clientes(**data)
        else:
            return JsonResponse({'error': 'Error al consumir la API'}, status=response.status_code)
        
class Mutation(graphene.ObjectType):
    create_cliente = CreateClienteMutation.Field()