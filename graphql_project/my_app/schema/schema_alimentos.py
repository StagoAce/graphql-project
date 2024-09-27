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

class CreateAlimentoMutation(graphene.Mutation):
    class Arguments:
        descripcion = graphene.String()
        dosis = graphene.Float()
    
    alimento = graphene.Field(AlimentacionType)

    def mutate(self, info, descripcion, dosis):
        payload = {
            "descripcion": descripcion,
            "dosis": dosis
        }

        url = BASE_URL + ""
        response = requests.post(url, json=payload)
        if response.status_code == 200 or response.status_code == 201:
            data = response.json()
            alimento = Alimentacion(
                idalimentacion=data["idalimentacion"],
                descripcion=data["descripcion"],
                dosis=data["dosis"]
            )
            return CreateAlimentoMutation(alimento=alimento)
        else:
            raise Exception('Error al consumir la API')

class DeleteAlimentoMutation(graphene.Mutation):
    class Arguments:
        idalimentacion = graphene.ID(required=True)
    
    message = graphene.String()
    success = graphene.Boolean()

    def mutate(self, info, idalimentacion):
        url = BASE_URL + idalimentacion + "/"
        query = ""
        json_query = {'query': query}
        response = requests.delete(url, json=json_query)
        if response.status_code == 200 or response.status_code == 204:
           return DeleteAlimentoMutation(success=True,message="Alimento deleted")
        else:
            return DeleteAlimentoMutation(success=False, message=f'Error al eliminar el alimento: {response.status_code} - {response.text}')


class UpdateAlimentoMutation(graphene.Mutation):
    class Arguments:
        idalimentacion = graphene.ID(required = True)
        descripcion = graphene.String(required = False)
        dosis = graphene.String(required = False)
    
    alimento = graphene.Field(AlimentacionType)
    message = graphene.String()

    def mutate(self, info, idalimentacion, descripcion=None, dosis=None):
       
        get_url = BASE_URL + idalimentacion + "/"
        get_response = requests.get(get_url)

        if get_response.status_code != 200:
            raise Exception(f"Error al obtener los datos del alimento: {get_response.status_code}")

        current_data = get_response.json()

        # Si no se proporciona un campo, usa el valor actual del cliente
        payload = {
            "idalimentacion": idalimentacion,
            "descripcion": descripcion if descripcion is not None else current_data["descripcion"],
            "dosis": dosis if dosis is not None else current_data["dosis"],
        }

        # Realiza la solicitud de actualización
        url = BASE_URL + idalimentacion + "/"
        response = requests.put(url, json=payload)

        if response.status_code == 200:
            data = response.json()
            # Crear una instancia de ClienteType con los datos actualizados
            alimento = AlimentacionType(
                idalimentacion=data['idalimentacion'],
                descripcion=data['descripcion'],
                dosis=data['dosis']
            )
            return UpdateAlimentoMutation(message="Actualizado con exito",alimento=alimento)
        else:
            return UpdateAlimentoMutation(message=f'Error al eliminar el cliente: {response.status_code} - {response.text}')

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
        

class AlimentosMutation(graphene.ObjectType):
    create_alimento = CreateAlimentoMutation.Field()
    delete_alimento = DeleteAlimentoMutation.Field()
    update_alimento = UpdateAlimentoMutation.Field()