import graphene
from graphene_django import DjangoObjectType
from ..models import PorcinosHasAlimentacion
import requests
from django.http import JsonResponse
from .schema_porcinos import PorcinoType
from .schema_alimentos import AlimentacionType

BASE_URL = "http://127.0.0.1:8000/api/v1/hasAlimentacion/"

class PorcinosHasAlimentacionType(DjangoObjectType):
    class Meta:
        model = PorcinosHasAlimentacion
        fields = ("porcinos_idporcinos", "alimentacion_idalimentacion")
    
    porcinos_idporcinos = graphene.Field(PorcinoType)
    alimentacion_idalimentacion = graphene.Field(AlimentacionType)

    # Método para obtener el objeto Porcino completo
    def resolve_porcinos_idporcinos(self, info):
        url = f"http://127.0.0.1:8000/api/v1/porcinos/{self.porcinos_idporcinos}/"  # Ajustar según tu endpoint
        response = requests.get(url)
        if response.status_code == 200:
            return PorcinoType(**response.json())  # Convierte a objeto Porcino
        return None

    # Método para obtener el objeto Alimentación completo
    def resolve_alimentacion_idalimentacion(self, info):
        url = f"http://127.0.0.1:8000/api/v1/alimentos/{self.alimentacion_idalimentacion}/"  # Ajustar según tu endpoint
        response = requests.get(url)
        if response.status_code == 200:
            return AlimentacionType(**response.json())  # Convierte a objeto Alimentación
        return None

class Query(graphene.ObjectType):
    porcinosAlimentos = graphene.List(PorcinosHasAlimentacionType)
    porcinoAlimentos = graphene.Field(PorcinosHasAlimentacionType, porcinos_idporcinos=graphene.ID(), alimentacion_idalimentacion=graphene.ID())

    def resolve_porcinosAlimentos(self, info):
        url = BASE_URL
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            resultados = []

            for item in data:
                # Crear una instancia de PorcinosHasAlimentacionType con los IDs
                porcino_alimento = PorcinosHasAlimentacionType(
                    porcinos_idporcinos=item['porcinos_idporcinos'],
                    alimentacion_idalimentacion=item['alimentacion_idalimentacion']
                )
                resultados.append(porcino_alimento)
            
            return resultados
        else:
            return JsonResponse({'error': 'Error al consumir la API'}, status=response.status_code)

    def resolve_porcinoAlimentos(self, info, porcinos_idporcinos, alimentacion_idalimentacion):
        url = f"{BASE_URL}?porcinos_idporcinos={porcinos_idporcinos}&alimentacion_idalimentacion={alimentacion_idalimentacion}"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            if data:  # Verifica que haya datos
                item = data[0]  # Suponiendo que el API devuelve un solo elemento
                return PorcinosHasAlimentacionType(
                    porcinos_idporcinos=item['porcinos_idporcinos'],
                    alimentacion_idalimentacion=item['alimentacion_idalimentacion']
                )
            return None  # Si no hay datos, devuelve None
        else:
            return JsonResponse({'error': 'Error al consumir la API'}, status=response.status_code)

class CreatePorcinosAlimentosMutation(graphene.Mutation):
    class Arguments:
        porcinos_idporcinos = graphene.Int()
        alimentacion_idalimentacion = graphene.Int()

    success = graphene.Boolean()

    def mutate(self, info, porcinos_idporcinos, alimentacion_idalimentacion):
        payload = {
            "porcinos_idporcinos" : porcinos_idporcinos,
            "alimentacion_idalimentacion" : alimentacion_idalimentacion
        }

        url = BASE_URL + ""
        response = requests.post(url, json=payload)
        if response.status_code == 200 or response.status_code == 201:
            data = response.json()
            return CreatePorcinosAlimentosMutation(success = True)
        else:
            raise Exception('Error al consumir la API ', Success = False)

class PorcinosAlimentosMutation(graphene.ObjectType):
    create_porcinosalimentos = CreatePorcinosAlimentosMutation.Field()
