from fastapi import FastAPI
from graphene import Field, List, ObjectType, Schema, String
from mongoengine import connect, disconnect_all
from starlette.graphql import GraphQLApp
from starlette.middleware.cors import CORSMiddleware

from dynamicconsentprototype.models.consent import ConsentModel
from dynamicconsentprototype.models.user import UserModel
from dynamicconsentprototype.mutations.mutations import Mutations
from dynamicconsentprototype.object_types.consent import Consent
from dynamicconsentprototype.object_types.user import User


class Query(ObjectType):
    users = List(User)
    user = Field(User, id=String())
    consents = List(Consent)
    consent = Field(Consent, id=String())

    def resolve_users(self, info):
        return list(UserModel.objects.all())

    def resolve_user(self, info, id):
        return UserModel.objects.get(pk=id)

    def resolve_consents(self, info):
        return list(ConsentModel.objects.all())

    def resolve_consent(self, info, id):
        return ConsentModel.objects.get(pk=id)


app = FastAPI()


@app.on_event("startup")
def connect_db_client():
    connect("consent")


@app.on_event("shutdown")
def shutdown_db_client():
    disconnect_all()


origins = ["http://localhost", "http://localhost:8000", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_route("/", GraphQLApp(schema=Schema(query=Query, mutation=Mutations)))
