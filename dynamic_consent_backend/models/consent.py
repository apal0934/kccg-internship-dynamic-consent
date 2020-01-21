from mongoengine import Document
from mongoengine.fields import IntField


class ConsentOrgModel(Document):
    org_type = IntField(required=True)


class ConsentPurposeModel(Document):
    purpose = IntField(required=True)


class ConsentHPOModel(Document):
    hpo = IntField(required=True)
