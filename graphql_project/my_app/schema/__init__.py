import graphene
from .schema_clientes import Query as ClientesQuery, ClientesMutation
from .schema_porcinos import Query as PorcinosQuery
from .schema_alimentos import Query as AlimentosQuery

# Unificar consultas y mutaciones en el esquema
class Query(ClientesQuery,PorcinosQuery, AlimentosQuery, graphene.ObjectType):
    pass

class Mutation(ClientesMutation, graphene.ObjectType):
    pass

# Definir el esquema con queries y mutaciones
schema = graphene.Schema(query=Query, mutation=Mutation)