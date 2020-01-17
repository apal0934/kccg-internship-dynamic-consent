from mongoengine import Document
from mongoengine.fields import BooleanField, StringField


class ConsentModel(Document):
    meta = {"collection": "consent"}
    name = StringField(required=True)
    purpose = StringField(required=True)
    commercial = BooleanField(required=True)
