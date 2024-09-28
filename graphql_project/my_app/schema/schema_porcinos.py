import graphene
from graphene_django import DjangoObjectType
from ..models import Porcinos
import requests
from django.http import JsonResponse
from .schema_clientes import ClienteType

BASE_URL = "http://127.0.0.1:8000/api/v1/porcinos/"

class PorcinoType(DjangoObjectType):
    class Meta:
        model = Porcinos
        fields = ("idporcinos","edad","peso","razas_idrazas","clientes_cedula")

    clientes_cedula = graphene.Field(ClienteType)

class Query(graphene.ObjectType):
    porcinos = graphene.List(PorcinoType)


    def resolve_porcinos(self, info):
        url = BASE_URL + ""
        query = ""
        json_query = {'query': query}
        response = requests.get(url, json=json_query)
        
        if response.status_code == 200:
            data = response.json()

            clientes_cedulas = [porcino_data['clientes_cedula'] for porcino_data in data]

        # Hacer una solicitud en lote para obtener todos los clientes
        cliente_url = "http://127.0.0.1:8000/api/v1/clientes/?cedulas=" + ",".join(map(str, clientes_cedulas))
        cliente_response = requests.get(cliente_url)
            
        if cliente_response.status_code == 200:
            clientes_data = cliente_response.json()

            # Crear un diccionario de clientes por cédula para acceso rápido
            clientes_dict = {cliente['cedula']: cliente for cliente in clientes_data}

            porcinos_list = []
            for porcino_data in data:

                cliente_data = clientes_dict.get(porcino_data['clientes_cedula'])
                
                cliente_instance = ClienteType(
                    cedula=cliente_data['cedula'],
                    nombre=cliente_data['nombre'],
                    apellidos=cliente_data['apellidos'],
                    direccion=cliente_data['direccion'],
                    telefono=cliente_data['telefono']
                )

                # Obtener los datos completos del cliente desde el diccionario
                porcino = PorcinoType( 
                    idporcinos=porcino_data.get('idporcinos'),
                    edad=porcino_data.get('edad'),
                    peso=porcino_data.get('peso'),
                    clientes_cedula=cliente_instance   # Asigna los datos del cliente
                )
                
                porcinos_list.append(porcino)
            return porcinos_list
        else:
            return JsonResponse({'error': 'Error al consumir la API'}, status=response.status_code)