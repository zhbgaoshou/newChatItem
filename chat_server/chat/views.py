from openai import OpenAI
from openai import OpenAIError

from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework.mixins import ListModelMixin
import json
import copy

from datetime import timedelta
from .models import Room, Message
from .ser import RoomSerializer, MessageSerializer
from .pagination import ArticleCursorPagination


from django.utils import timezone

client = OpenAI(
    api_key="",
    organization="",
    project="",
)


class chatView(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body)
            tip = "You are a helpful assistant."

            # message
            message = self.get_message(request.user)
            message.append(data)

            # save user message
            self.save_message(data)

            completion = client.chat.completions.create(
                model=data["model"],
                messages=[{"role": "system", "content": tip}] + message,
                stream=True,
            )

            response = StreamingHttpResponse(
                self.event_stream(completion, data), content_type="text/event-stream"
            )
            response["Cache-Control"] = "no-cache"

            return response
        
        except OpenAIError as e:
            print(e)
            # 返回简化后的 OpenAI 错误信息
            return Response({"error": "请求错误，请在左边菜单栏联系我或者反馈"}, status=500)
        
        except Exception as e:
            # 捕获其他未知错误
            return Response({"error": "系统错误，请联系管理员"}, status=500)

    def event_stream(self, completion, data):
        ai_content = ""
        try:
            for chunk in completion:
                delta = chunk.choices[0].delta
                if delta.content:
                    ai_content += delta.content
                yield delta.content
        except Exception as e:
            return "请求错误，请联系管理员"
        finally:
            if ai_content:
                ai_data = copy.deepcopy(data)
                ai_data["role"] = "assistant"
                ai_data["content"] = ai_content
                self.save_message(ai_data)

    def get_message(self, user):
        total_messages = Message.objects.filter(user=user).count()
        message_list = Message.objects.all()[max(0, total_messages - 10) :]
        ser_message = MessageSerializer(message_list, many=True)
        return ser_message.data

    def save_message(self, data):
        user_serializer = MessageSerializer(data=data)

        if user_serializer.is_valid():
            user_serializer.save()
        else:
            return "请求参数错误，请联系管理员"



# Create your views here.
class MessagesView(ListModelMixin, GenericViewSet):
    authentication_classes = []
    permission_classes = []
    pagination_class = ArticleCursorPagination
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    filterset_fields = ["user"]

    def list(self, request, *args, **kwargs):
        # 调用父类的 list 方法获取倒序排列的分页数据
        response = super().list(request, *args, **kwargs)
        # 将 response.data 中的 results 部分正序排列
        response.data["results"].reverse()
        return response


class RoomViewSet(ModelViewSet):
    pagination_class = None
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    filterset_fields = ["user", "is_active"]

    @action(detail=False, methods=["get"])
    def categorized(self, request):

        user = request.user
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        yesterday_start = today_start - timedelta(days=1)
        three_days_ago_start = today_start - timedelta(days=3)
        today_end = today_start + timedelta(days=1)

        # 获取过滤条件范围内的所有数据
        start_time = three_days_ago_start
        end_time = today_end
        rooms = Room.objects.filter(
            created_at__gte=start_time, created_at__lt=end_time, user=user
        ).order_by("-created_at")

        # 在内存中对查询结果进行分类
        today_rooms = []
        yesterday_rooms = []
        three_days_ago_rooms = []

        for room in rooms:
            if today_start <= room.created_at < today_end:
                today_rooms.append(room)
            elif yesterday_start <= room.created_at < today_start:
                yesterday_rooms.append(room)
            elif three_days_ago_start <= room.created_at < yesterday_start:
                three_days_ago_rooms.append(room)

        # 序列化数据
        today_serializer = RoomSerializer(today_rooms, many=True)
        yesterday_serializer = RoomSerializer(yesterday_rooms, many=True)
        three_days_ago_serializer = RoomSerializer(three_days_ago_rooms, many=True)

        return Response(
            {
                "today": {"date": "今天", "data": today_serializer.data},
                "yesterday": {"date": "昨天", "data": yesterday_serializer.data},
                "three_days_ago": {
                    "date": "三天前",
                    "data": three_days_ago_serializer.data,
                },
            }
        )
