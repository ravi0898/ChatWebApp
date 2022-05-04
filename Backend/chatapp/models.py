from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime

class User(AbstractUser):
    name = models.CharField(max_length=40,null=False)
    emails = models.EmailField(unique=True)
    images = models.ImageField(upload_to='images/',null=True,blank=True)
    username = None
    # username = models.CharField(max_length=50,unique=True,default=True)

    USERNAME_FIELD = 'emails'
    REQUIRED_FIELDS = []


class chat(models.Model):
    firstuser = models.ForeignKey(User, on_delete=models.CASCADE,related_name='sender')
    seconduser = models.ForeignKey(User, on_delete=models.CASCADE,related_name='receiver')
    chatsection = models.TextField(null=True)
    star = models.BooleanField(default=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(default=datetime.datetime.now(),blank=True)

    def __str__(self):
        return str(self.chatsection[0:30])


class names(models.Model):
    allnames = models.CharField(max_length=40,null=False,default=True)

    def __str__(self):
        return str(self.allnames)

class twogroup(models.Model):
    user_one = models.ForeignKey(names, on_delete=models.CASCADE,related_name='firstuser')
    user_two = models.ForeignKey(names, on_delete=models.CASCADE,related_name='seconduser')
    def __str__(self):
        return str(self.pk)

class user1(models.Model):
    group = models.ForeignKey(twogroup, on_delete=models.CASCADE,related_name='groups')
    user_name = models.ForeignKey(names, on_delete=models.CASCADE)
    user_chat = models.TextField(max_length=200,null=True)
    def __str__(self):
        return str(self.user_chat)











