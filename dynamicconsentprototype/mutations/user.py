from graphene import Field, List, Mutation, String

from dynamicconsentprototype.models.consent import ConsentModel
from dynamicconsentprototype.models.user import UserModel
from dynamicconsentprototype.object_types.user import User


class CreateUser(Mutation):
    class Arguments:
        email = String()
        first_name = String()
        last_name = String()
        consents = List(String)

    user = Field(lambda: User)

    @staticmethod
    def mutate(root, info, email, first_name, last_name, consents=[]):
        user = UserModel(
            email=email, first_name=first_name, last_name=last_name, consents=consents
        )
        user.save()
        return CreateUser(user=user)


class UpdateUser(Mutation):
    class Arguments:
        id = String(required=True)
        email = String()
        first_name = String()
        last_name = String()
        consents = List(String)

    user = Field(lambda: User)

    @staticmethod
    def mutate(
        root, info, id, email=None, first_name=None, last_name=None, consents=None
    ):
        user = UserModel.objects.get(id=id)
        if email:
            user.email = email
        if first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name
        if consents:
            for consent in consents:
                consent = ConsentModel.objects.get(id=consent)
                user.consents.append(consent)

        user.save()
        return UpdateUser(user=user)


class DeleteUser(Mutation):
    class Arguments:
        id = String(required=True)

    user = Field(lambda: User)

    @staticmethod
    def mutate(root, info, id):
        user = UserModel.objects.get(id=id)
        user.delete()
        return DeleteUser(user=user)
