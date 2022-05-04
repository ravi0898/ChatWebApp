from rest_framework import serializers
from .models import User,chat,names,user1,twogroup

class userCreationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['name','emails','password']


class dataSerializer(serializers.ModelSerializer):
    class Meta:
        model = chat
        fields = '__all__'

class twogroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = twogroup
        fields = '__all__'

class user1Serializer(serializers.ModelSerializer):
    class Meta:
        model = user1
        fields = '__all__'


class userNamesSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['pk','name','images']

class imageSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['images']


class namesSerializer(serializers.ModelSerializer):
    class Meta:
        model = names
        fields = ['pk','allnames']


class chatSerializer(serializers.ModelSerializer):
    class Meta:
        model = chat
        fields = ['chatsection']






