from mongoengine import Document
from mongoengine.fields import ListField, ReferenceField, StringField

from .consent import ConsentModel


class UserModel(Document):
    meta = {"collection": "user"}
    email = StringField(required=True)
    first_name = StringField(max_length=50)
    last_name = StringField(max_length=50)
    consents = ListField(ReferenceField(ConsentModel))
