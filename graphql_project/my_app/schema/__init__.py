import graphene
from .schema_clientes import Query as ClientesQuery, ClientesMutation
from .schema_porcinos import Query as PorcinosQuery, PorcinosMutation
from .schema_alimentos import Query as AlimentosQuery, AlimentosMutation
from .schema_porcinos_alimentacion import Query as PorcinosAlimentosQuery, PorcinosAlimentosMutation
from .schema_razas import Query as RazasQuery


# Unificar consultas y mutaciones en el esquema
class Query(ClientesQuery,PorcinosQuery, AlimentosQuery,PorcinosAlimentosQuery,RazasQuery, graphene.ObjectType):
    pass

class Mutation(ClientesMutation,AlimentosMutation,PorcinosMutation, PorcinosAlimentosMutation, graphene.ObjectType):
    pass

# Definir el esquema con queries y mutaciones
schema = graphene.Schema(query=Query, mutation=Mutation)