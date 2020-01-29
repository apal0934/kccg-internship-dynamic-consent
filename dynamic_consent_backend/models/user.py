from mongoengine import Document
from mongoengine.fields import ListField, StringField, IntField, DateTimeField


class UserModel(Document):
    meta = {"collection": "user"}
    user_id = IntField()
    email = StringField(required=True)
    first_name = StringField(max_length=50)
    last_name = StringField(max_length=50)
    date_of_birth = DateTimeField()
    consent_orgs = ListField(IntField())
    consent_purposes = ListField(StringField())
    consent_hpos = ListField(IntField())


class UserIdModel(Document):
    counter = IntField()
