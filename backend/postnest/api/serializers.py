from rest_framework import serializers
from .models import * 
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username"]

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Profile
        fields = ["id", "bio", "user", "pfp"]


class PostsSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)  # <-- nested serializer
    likes = serializers.SerializerMethodField()
    saves = serializers.SerializerMethodField()
    class Meta:
        model = PostsModel
        fields = ["id", "content", "created", "profile", "image" ,"likes", "saves"]

    def get_likes(self, obj):
        return obj.liked_by.count()
    def get_saves(self, obj):
        return obj.saved_by.count()

    
class SignupSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["username","email","password","password2"]
    
    def validate_username(self,value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already taken")
        return value
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value
    
    def create(self, validated_data):
        validated_data.pop('password2', None)
        user = User.objects.create_user(**validated_data)
        return user

class NotificationSerializer(serializers.ModelSerializer):
    user_pfp = serializers.SerializerMethodField()

    class Meta:
        model = Notifications
        fields = ["id", "message", "created", "user_pfp"]

    def get_user_pfp(self,obj):
        request = self.context.get("request")
        if request and obj.sender and hasattr(obj.sender, "profile") and obj.sender.profile.pfp:
            return request.build_absolute_uri(obj.sender.profile.pfp.url)
        return None
