from graphene_mongo import MongoengineObjectType

from dynamic_consent_backend.models.consent import ConsentModel


class Consent(MongoengineObjectType):
    class Meta:
        model = ConsentModel
