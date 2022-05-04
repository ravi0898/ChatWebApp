from django.urls import path
from . import views

from django.conf.urls.static import static
from django.conf import settings

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('login/token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/',views.userCreation,name='register'),
    path('randomdata/',views.randomData,name='random_data'),
    path('imageupload/',views.gettingImages,name='images'),
    path('getroomdata/',views.getRoomData,name='getRoom'),
    path('savename/',views.makeName),
    path('allroomdata/',views.alldata,name="Room Data"),
    path('postingchat/',views.postingChat,name='chat_posted'),
    path('userdata/',views.userdata,name='user data'),
    path('bothuserchat/',views.gettingBothchat,name='both user'),
    path('savingchat/',views.postngUserChat,name='saving chat'),
    path('otheruserchat/',views.userschatForus,name='otherUserChat'),
    path('mainuser/',views.getMainUser,name="mainuserdata")

]

urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)  #this line should be in main url.py file ,not any app's url.py file such as here 
#600 lines of code in django
