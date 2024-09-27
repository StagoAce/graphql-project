import graphene
from .schema_clientes import Query as ClientesQuery, ClientesMutation

# Unificar consultas y mutaciones en el esquema
class Query(ClientesQuery, graphene.ObjectType):
    pass

class Mutation(ClientesMutation, graphene.ObjectType):
    pass

# Definir el esquema con queries y mutaciones
schema = graphene.Schema(query=Query, mutation=Mutation)