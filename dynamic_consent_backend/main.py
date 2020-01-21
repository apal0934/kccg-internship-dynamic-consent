from fastapi import FastAPI
from graphene import Field, List, ObjectType, Schema, String
from mongoengine import connect, disconnect_all
from starlette.graphql import GraphQLApp
from starlette.middleware.cors import CORSMiddleware

from dynamic_consent_backend.models.consent import ConsentOrgModel, ConsentPurposeModel, ConsentHPOModel
from dynamic_consent_backend.models.user import UserModel
from dynamic_consent_backend.mutations.mutations import Mutations
from dynamic_consent_backend.object_types.consent import ConsentOrg, ConsentPurpose, ConsentHPO
from dynamic_consent_backend.object_types.user import User


class Query(ObjectType):
    users = List(User)
    user = Field(User, id=String())

    consent_orgs = List(ConsentOrg)
    consent_org = Field(ConsentOrg, id=String())

    consent_purposes = List(ConsentPurpose)
    consent_purpose = Field(ConsentPurpose, id=String())

    consent_hpos = List(ConsentHPO)
    consent_hpo = Field(ConsentHPO, id=String())

    def resolve_users(self, info):
        return list(UserModel.objects.all())

    def resolve_user(self, info, id):
        return UserModel.objects.get(pk=id)

    def resolve_consent_orgs(self, info):
        return list(ConsentOrgModel.objects.all())

    def resolve_consent_org(self, info, id):
        return ConsentOrgModel.objects.get(pk=id)

    def resolve_consent_purposes(self, info):
        return list(ConsentPurposeModel.objects.all())

    def resolve_consent_purpose(self, info, id):
        return ConsentPurposeModel.objects.get(pk=id)

    def resolve_consent_hpos(self, info):
        return list(ConsentHPOModel.objects.all())

    def resolve_consent_hpo(self, info, id):
        return ConsentHPOModel.objects.get(pk=id)


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
