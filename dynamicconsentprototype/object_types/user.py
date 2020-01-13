from graphene_mongo import MongoengineObjectType

from dynamicconsentprototype.models.user import UserModel


class User(MongoengineObjectType):
    class Meta:
        model = UserModel
