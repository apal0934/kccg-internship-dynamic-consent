from graphene import Boolean, Field, Mutation, String

from dynamic_consent_backend.models.consent import ConsentModel
from dynamic_consent_backend.object_types.consent import Consent


class CreateConsent(Mutation):
    class Arguments:
        name = String()
        purpose = String()
        commercial = Boolean()

    consent = Field(lambda: Consent)

    @staticmethod
    def mutate(root, info, name, purpose, commercial):
        consent = ConsentModel(name=name, purpose=purpose, commercial=commercial)
        consent.save()
        return CreateConsent(consent=consent)


class UpdateConsent(Mutation):
    class Arguments:
        id = String(required=True)
        name = String()
        purpose = String()
        commercial = Boolean()

    consent = Field(lambda: Consent)

    @staticmethod
    def mutate(root, info, id, name=None, purpose=None, commercial=None):
        consent = ConsentModel.objects.get(id=id)
        if name:
            consent.name = name
        if purpose:
            consent.purpose = purpose
        if commercial is not None:
            consent.commercial = commercial

        consent.save()
        return UpdateConsent(consent=consent)


class DeleteConsent(Mutation):
    class Arguments:
        id = String(required=True)

    consent = Field(lambda: Consent)

    @staticmethod
    def mutate(root, info, id):
        consent = ConsentModel.objects.get(id=id)
        consent.delete()
        return DeleteConsent(consent=consent)
