from django.db.models import Q
from rest_framework.decorators import api_view,permission_classes,parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser,FormParser
from rest_framework.response import Response


from .serializer import (
    userCreationSerializer,
    dataSerializer,
    userNamesSerializer,
    imageSerializer,
    namesSerializer,
    twogroupSerializer,
    chatSerializer,
    user1Serializer
    )
from .models import User,names,user1,twogroup,chat
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from itertools import chain
from time import sleep
import threading


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['name'] = user.name
        token['username'] = user.username
        token['pk'] = user.pk
        try:
            token['image'] = user.images.url
        except:
            print()
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# creating user
@api_view(['POST'])
def userCreation(request):
    if request.method == 'POST':
        serializer = userCreationSerializer(data=request.data)

        if serializer.is_valid():
            password = make_password(request.data['password'])
            serializer.save(password=password)
            return Response("Successfully user created")
        else:
            return Response(serializer.error)

@api_view(['POST'])
@parser_classes([MultiPartParser])
@permission_classes([IsAuthenticated])
def gettingImages(request):
    if request.method == 'POST':
        serializer = imageSerializer(instance=request.user,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

# getting user related data
@permission_classes([IsAuthenticated,])
@api_view(['GET'])
def userdata(request):
    allusers = User.objects.all()                         # returnin all user listed on app
    serializer = userNamesSerializer(allusers,many=True)
    return Response(serializer.data)



# getting data for authorized data

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMainUser(request):
    user = request.user
    data = user.sender.last()
    serializer = dataSerializer(data)
    return Response(serializer.data)

#getting chat of second user of user requested
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def gettingBothchat(request):
    requestedUser = request.user                                                           # both user all chats
    receiverUser = request.data['second_user']                                             # {
    allchat = chat.objects.filter(Q(Q(firstuser=receiverUser) & Q(seconduser=requestedUser)) | Q(Q(firstuser=requestedUser) & Q(seconduser=receiverUser))) #   "second_user": pk_value
    serializer = dataSerializer(allchat,many=True)                                         # }
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def postngUserChat(request):                            #provide:-
    firstuser = request.user
    print("data is ",request.data)                           # {
    request.data['firstuser'] = firstuser.pk            #   "seconduser" : 4,
    serializer = dataSerializer(data=request.data)      #   "chatsection" : "your chat to second user"
    usr = chat.objects.filter(Q(firstuser=firstuser) | Q(seconduser=firstuser))                                                    # }

    def erasedata():                                   #this functionality make sure that after 24 hour
        sleep(60*60*24)                                    #All chats of the user that first time send a message to backend
        usr.delete()                                   #will be deleted

    if not usr:
        thrd = threading.Thread(target=erasedata)
        thrd.start()

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userschatForus(request):
    user = request.user                          # all user chat for us(user)
    cht = chat.objects.filter(seconduser=user)
    serializer = dataSerializer(cht,many=True)
    return Response(serializer.data)

# getting data for unauthorized user
@api_view(['GET','POST'])
def randomData(request):
    nams = names.objects.all()
    serializer = namesSerializer(nams,many=True)
    if request.method == 'POST':
        pkvalue = request.data['pk']
        F_Suser = twogroup.objects.filter(Q(user_one=pkvalue) | Q(user_two=pkvalue))
        chatare = []
        for users in F_Suser:
            chatare += users.groups.all()
        serializer1 = user1Serializer(chatare,many=True)
        # serializer = twogroupSerializer(F_Suser,many=True)
        return Response(serializer1.data)
    return Response(serializer.data)

# creating a room for unuthorized user
# getting room data
@api_view(['POST'])
def getRoomData(request):
    dataitems = twogroup.objects.filter(Q(Q(user_one=request.data['user_one'])|Q(user_one=request.data['user_two'])) & Q(Q(user_two=request.data['user_two'])|Q(user_two=request.data['user_one'])))
    if(dataitems):
        chatare = []
        for chatsIn in dataitems:
            chatare += chatsIn.groups.all()
        if(chatare == []):
            serializer3 = twogroupSerializer(dataitems,many=True)
            datA = serializer3.data[0]
            return Response(datA)
        serializer1 = user1Serializer(chatare,many=True)
        return Response(serializer1.data)
    else:
        serializer = twogroupSerializer(data=request.data) #data should be as twogroup model fields have
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)



#posting chat for unauthorized users
@api_view(['POST'])
def postingChat(request):
    # here you have to provide group id,chat data,user1 or user2 pk(user_name=pk),all things will
    # be created automatically using react except chat data
    group = twogroup.objects.get(id=request.data['id'])
    request.data['group'] = request.data['id'] #edited might be wrong
    # intanceofuser1 = group.groups.get(user_name=request.data['user_name'])
    serializer = user1Serializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)

 #THIS IS ANOTHER APPROACH
    # pkval = request.data['pk']
    # userinstance = names.objects.get(pk=pkval)
    # serializer = user1Serializer(instance=userinstance,data=request.data)
    # if serializer.is_valid():
    #     serializer.save()
    #     return Response(serializer.data)
    # else:
    #     return Response(serializer.errors)

@api_view(['GET'])
def alldata(request):
    # here you have to provide group,chat data,user1,user2 ,all things will
    # be created automatically using react except chat data
   dt = twogroup.objects.all()
   serializer = twogroupSerializer(dt,many=True)
   return Response(serializer.data)



# saving name of unauthorized user
@api_view(['POST'])
def makeName(request):
    serializer = namesSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)

# i also tried lil bit complex approach :) 
# for random chat
# @api_view(['POST'])
# def random_chat(request):

#     if request.method == 'POST':
#         # filtering out parent from child
#         nameIs = request.data['name']
#         chatIs = randomchat.objects.filter(name_user__names_foruser=nameIs)
#         serializer = randomDataSerializer(chatIs,many=True)
#         primerykeyIs = names.objects.filter(names_foruser=request.data['name']).first()
#         keyIs = primerykeyIs.pk
#         request.data["name_user"] = keyIs
#         serializer2 = randomDataSerializer(data=request.data)
#         if serializer2.is_valid():
#             serializer2.save()
#         else:
#             return Response(serializer2.errors)
#         responseIs = {
#             "data_forname":serializer.data,
#             "saved_data":serializer2.data
#         }
#         return Response(responseIs)
#     return Response(serializer2.errors)


# class gettingImages(APIView):
#     # permission_classes = [IsAuthenticated]
#     parser_classes = [MultiPartParser,FormParser]

#     def post(self,request):
#         print(request.data)
#         serializer = imageSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         else :
#             return Response(serializer.error)




























