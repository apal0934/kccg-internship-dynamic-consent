from graphene import ObjectType

from consent import CreateConsent, DeleteConsent, UpdateConsent
from user import AddConsents, CreateUser, DeleteUser, RevokeConsents, UpdateUser


class Mutations(ObjectType):
    create_user = CreateUser.Field()
    update_user = UpdateUser.Field()
    add_consents = AddConsents.Field()
    revoke_consents = RevokeConsents.Field()
    delete_user = DeleteUser.Field()

    create_consent = CreateConsent.Field()
    update_consent = UpdateConsent.Field()
    delete_consent = DeleteConsent.Field()
