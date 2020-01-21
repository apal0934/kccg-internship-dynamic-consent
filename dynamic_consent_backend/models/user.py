from mongoengine import Document
from mongoengine.fields import ListField, ReferenceField, StringField

from dynamic_consent_backend.models.consent import ConsentOrgModel, ConsentPurposeModel, ConsentHPOModel


class UserModel(Document):
    meta = {"collection": "user"}
    email = StringField(required=True)
    first_name = StringField(max_length=50)
    last_name = StringField(max_length=50)
    consent_orgs = ListField(ReferenceField(ConsentOrgModel, reverse_delete_rule=4))
    consent_purposes = ListField(ReferenceField(ConsentPurposeModel, reverse_delete_rule=4))
    consent_hpos = ListField(ReferenceField(ConsentHPOModel, reverse_delete_rule=4))
