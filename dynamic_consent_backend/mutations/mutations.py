from graphene import ObjectType

from dynamic_consent_backend.mutations.user import (
    AddConsentOrgs,
    CreateUser,
    DeleteUser,
    RevokeConsentOrgs,
    UpdateUser,
    AddConsentPurposes,
    RevokeConsentPurposes,
    AddConsentHPOs,
    RevokeConsentHPOs
)


class Mutations(ObjectType):
    create_user = CreateUser.Field()
    update_user = UpdateUser.Field()
    delete_user = DeleteUser.Field()

    add_consent_orgs = AddConsentOrgs.Field()
    revoke_consent_orgs = RevokeConsentOrgs.Field()
    add_consent_purposes = AddConsentPurposes.Field()
    revoke_consent_purposes = RevokeConsentPurposes.Field()
    add_consent_hpos = AddConsentHPOs.Field()
    revoke_consent_hpos = RevokeConsentHPOs.Field()
