from graphene import ObjectType

from .consent import CreateConsent, DeleteConsent, UpdateConsent
from .user import CreateUser, DeleteUser, UpdateUser


class Mutations(ObjectType):
    create_user = CreateUser.Field()
    update_user = UpdateUser.Field()
    delete_user = DeleteUser.Field()

    create_consent = CreateConsent.Field()
    update_consent = UpdateConsent.Field()
    delete_consent = DeleteConsent.Field()
