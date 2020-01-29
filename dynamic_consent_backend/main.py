from fastapi import FastAPI
from graphene import Field, List, ObjectType, Schema, String, Int
from mongoengine import connect, disconnect_all
from starlette.graphql import GraphQLApp
from starlette.middleware.cors import CORSMiddleware

from dynamic_consent_backend.models.user import UserModel
from dynamic_consent_backend.mutations.mutations import Mutations
from dynamic_consent_backend.object_types.user import User


class Query(ObjectType):
    users = List(User, consent_org=Int(), consent_purpose=String(), consent_hpo=Int())
    user = Field(User, id=String())

    def resolve_users(self, info, consent_org=None, consent_purpose=None, consent_hpo=None):
        if consent_org and consent_purpose and consent_hpo:
            return list(UserModel.objects(consent_orgs=consent_org, consent_purposes=consent_purpose, consent_hpos=consent_hpo))
        return list(UserModel.objects.all())

    def resolve_user(self, info, id):
        return UserModel.objects.get(pk=id)


app = FastAPI()


@app.on_event("startup")
def connect_db_client():
    connect("consent")


@app.on_event("shutdown")
def shutdown_db_client():
    disconnect_all()


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_route("/", GraphQLApp(schema=Schema(query=Query, mutation=Mutations)))
