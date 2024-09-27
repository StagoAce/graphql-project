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
        payload = {
            "cedula": cedula,
            "nombre": nombre,
            "apellidos": apellidos,
            "direccion": direccion,
            "telefono": telefono
        }

        url = BASE_URL + ""
        response = requests.post(url, json=payload)
        if response.status_code == 200 or response.status_code == 201:
            data = response.json()
            cliente = Clientes(
                cedula=data["cedula"],
                nombre=data["nombre"],
                apellidos=data["apellidos"],
                direccion=data["direccion"],
                telefono=data["telefono"]
            )
            return CreateClienteMutation(cliente=cliente)
        else:
            raise Exception('Error al consumir la API')

class DeleteClienteMutation(graphene.Mutation):
    class Arguments:
        cedula = graphene.ID(required=True)
    
    message = graphene.String()
    success = graphene.Boolean()

    def mutate(self, info, cedula):
        url = BASE_URL + cedula + "/"
        query = ""
        json_query = {'query': query}
        response = requests.delete(url, json=json_query)
        if response.status_code == 200 or response.status_code == 204:
           return DeleteClienteMutation(success=True,message="Cliente deleted")
        else:
            return DeleteClienteMutation(success=False, message=f'Error al eliminar el cliente: {response.status_code} - {response.text}')

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
        
class ClientesMutation(graphene.ObjectType):
    create_cliente = CreateClienteMutation.Field()
    delete_cliente = DeleteClienteMutation.Field() 