from mongoengine import Document
from mongoengine.fields import ListField, ReferenceField, StringField

from dynamicconsentprototype.models.consent import ConsentModel


class UserModel(Document):
    meta = {"collection": "user"}
    email = StringField(required=True)
    first_name = StringField(max_length=50)
    last_name = StringField(max_length=50)
    consents = ListField(ReferenceField(ConsentModel, reverse_delete_rule=4))
