from graphene_mongo import MongoengineObjectType

from dynamic_consent_backend.models.user import UserModel, UserIdModel


class User(MongoengineObjectType):
    class Meta:
        model = UserModel


class UserId(MongoengineObjectType):
    class Meta:
        model = UserIdModel
