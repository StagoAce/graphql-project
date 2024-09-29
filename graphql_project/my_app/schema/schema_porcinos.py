import graphene
from graphene_django import DjangoObjectType
from ..models import Porcinos
import requests
from django.http import JsonResponse
from .schema_clientes import ClienteType
from .schema_razas import RazaType

BASE_URL = "http://127.0.0.1:8000/api/v1/porcinos/"

class PorcinoType(DjangoObjectType):
    class Meta:
        model = Porcinos
        fields = ("idporcinos","edad","peso","razas_idrazas","clientes_cedula")

    clientes_cedula = graphene.Field(ClienteType)

class Query(graphene.ObjectType):
    porcinos = graphene.List(PorcinoType)
    porcino_uno = graphene.Field(PorcinoType, idporcinos=graphene.ID())


    def resolve_porcinos(self, info):
        url = BASE_URL + ""
        query = ""
        json_query = {'query': query}
        response = requests.get(url, json=json_query)

        if response.status_code == 200:
            data = response.json()
            clientes_cedulas = [porcino_data['clientes_cedula'] for porcino_data in data]
            razas_porcios = [raza_id['razas_idrazas'] for raza_id in data]

            # Hacer solicitud para las razas
            razas_url = "http://127.0.0.1:8000/api/v1/razas/?razas=" + ",".join(map(str, razas_porcios))
            razas_response = requests.get(razas_url)

            # Hacer una solicitud en lote para obtener todos los clientes
            cliente_url = "http://127.0.0.1:8000/api/v1/clientes/?cedulas=" + ",".join(map(str, clientes_cedulas))
            cliente_response = requests.get(cliente_url)
                
            if cliente_response.status_code == 200:
                clientes_data = cliente_response.json()
                razas_data = razas_response.json()

                # Crear un diccionario de clientes por cédula para acceso rápido
                clientes_dict = {cliente['cedula']: cliente for cliente in clientes_data}
                razas_dict = {raza['idrazas']: raza for raza in razas_data}

                porcinos_list = []
                for porcino_data in data:

                    raza_data = razas_dict.get(porcino_data['razas_idrazas'])
                    cliente_data = clientes_dict.get(porcino_data['clientes_cedula'])

                    raza_instance = RazaType(
                        name  = raza_data['name']
                    )
                    
                    cliente_instance = ClienteType(
                        cedula=cliente_data['cedula'],
                    )

                    # Obtener los datos completos del cliente desde el diccionario
                    porcino = PorcinoType( 
                        idporcinos=porcino_data.get('idporcinos'),
                        edad=porcino_data.get('edad'),
                        peso=porcino_data.get('peso'),
                        razas_idrazas = raza_instance,
                        clientes_cedula=cliente_instance   # Asigna los datos del cliente
                    )

                    porcinos_list.append(porcino)
                return porcinos_list
            else:
                return JsonResponse({'error': 'Error al consumir la API'}, status=response.status_code)
        
    def resolve_porcino_uno(self, info, idporcinos):
        print('dsa')
        url = BASE_URL + idporcinos + "/"
        response = requests.get(url)
    
        if response.status_code == 200:
            data = response.json()

            # Obtener directamente la cédula del cliente desde el porcino
            cliente_cedula = data['clientes_cedula']
            raza_porcino = data['razas_idrazas']

            #Obtener raza
            razas_url = f"http://127.0.0.1:8000/api/v1/razas/{raza_porcino}/"
            raza_response = requests.get(razas_url)

            # Formar la URL para obtener los datos del cliente
            cliente_url = f"http://127.0.0.1:8000/api/v1/clientes/{cliente_cedula}/"
            cliente_response = requests.get(cliente_url)

            if cliente_response.status_code == 200:
                raza_data = raza_response.json()
                cliente_data = cliente_response.json()
                
                # Instancia de raza
                raza_instance = RazaType(
                    name  = raza_data['name']
                )

                # Crear la instancia de ClienteType
                cliente_instance = ClienteType(
                    cedula=cliente_data['cedula'],
                    nombre=cliente_data['nombre'],
                    apellidos=cliente_data['apellidos'],
                    direccion=cliente_data['direccion'],
                    telefono=cliente_data['telefono']
                )

                # Crear la instancia de PorcinoType con el cliente relacionado
                porcino = PorcinoType(
                    idporcinos=data.get('idporcinos'),
                    edad=data.get('edad'),
                    peso=data.get('peso'),
                    razas_idrazas=raza_instance,
                    clientes_cedula=cliente_instance  # Asigna la instancia de ClienteType
                )
                
                return porcino  # Devuelve el porcino directamente, no una lista
            else:
                return JsonResponse({'error': 'Error al consumir la API del cliente'}, status=cliente_response.status_code)
        
        else:
            return JsonResponse({'error': 'Error al consumir la API de porcinos'}, status=response.status_code)
