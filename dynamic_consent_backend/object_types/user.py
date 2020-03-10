from graphene_mongo import MongoengineObjectType

from dynamic_consent_backend.models.user import UserModel


class User(MongoengineObjectType):
    class Meta:
        model = UserModel
