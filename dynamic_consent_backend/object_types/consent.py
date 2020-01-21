from graphene_mongo import MongoengineObjectType

from dynamic_consent_backend.models.consent import ConsentOrgModel, ConsentPurposeModel, ConsentHPOModel


class ConsentOrg(MongoengineObjectType):
    class Meta:
        model = ConsentOrgModel


class ConsentPurpose(MongoengineObjectType):
    class Meta:
        model = ConsentPurposeModel


class ConsentHPO(MongoengineObjectType):
    class Meta:
        model = ConsentHPOModel
