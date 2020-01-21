from graphene import Field, Mutation, Int

from dynamic_consent_backend.models.consent import ConsentOrgModel, ConsentPurposeModel, ConsentHPOModel
from dynamic_consent_backend.object_types.consent import ConsentOrg, ConsentPurpose, ConsentHPO


class CreateConsentOrg(Mutation):
    class Arguments:
        org_type = Int(required=True)

    consent_org = Field(lambda: ConsentOrg)

    @staticmethod
    def mutate(root, info, org_type):
        consent_org = ConsentOrgModel(org_type=org_type)
        consent_org.save()
        return CreateConsentOrg(consent_org=consent_org)


class CreateConsentPurpose(Mutation):
    class Arguments:
        purpose = Int(required=True)

    consent_purpose = Field(lambda: ConsentPurpose)

    @staticmethod
    def mutate(root, info, purpose):
        consent_purpose = ConsentPurposeModel(purpose=purpose)
        consent_purpose.save()
        return CreateConsentPurpose(consent_purpose=consent_purpose)


class CreateConsentHPO(Mutation):
    class Arguments:
        hpo = Int(required=True)

    consent_hpo = Field(lambda: ConsentHPO)

    @staticmethod
    def mutate(root, info, hpo):
        consent_hpo = ConsentHPOModel(hpo=hpo)
        consent_hpo.save()
        return CreateConsentHPO(consent_hpo=consent_hpo)
