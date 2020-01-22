from mongoengine import Document
from mongoengine.fields import ListField, StringField, IntField


class UserModel(Document):
    meta = {"collection": "user"}
    user_id = IntField()
    email = StringField(required=True)
    first_name = StringField(max_length=50)
    last_name = StringField(max_length=50)
    consent_orgs = ListField(IntField())
    consent_purposes = ListField(IntField())
    consent_hpos = ListField(IntField())
