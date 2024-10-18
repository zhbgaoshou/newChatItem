from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView,CreateAPIView
from rest_framework import status

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import update_last_login
from rest_framework_simplejwt.views import TokenObtainPairView

from .ser import UserSerializer

# 更新登录时间
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # 调用父类的验证方法，获得验证后的数据
        data = super().validate(attrs)
        
        # 获取当前用户
        user = self.user
        
        # 手动更新 last_login 字段
        update_last_login(None, user)
        
        return data
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
# end


class RegisterView(CreateAPIView):
    permission_classes = ()
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        

class InfoView(RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        # 获取当前用户
        return self.request.user