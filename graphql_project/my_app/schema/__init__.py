import graphene
from .schema_clientes import Query as ClientesQuery

class Query(ClientesQuery, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query)