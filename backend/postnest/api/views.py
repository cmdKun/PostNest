from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from friendship.models import Follow, Block
from django.shortcuts import get_object_or_404
from .serializers import *
from .models import *

from django.contrib.auth import login, authenticate, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.cache import cache_page
from django.core.cache import cache

# Create your views here.

@method_decorator(ensure_csrf_cookie, name="dispatch")
class csrftoken(APIView):
    def get(self,request):
        return Response({"detial" : "CSRF cookie set."})


    
class Signup(APIView):
    permission_classes = [AllowAny] 

    def post(self,request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            profile = Profile(user=user)
            profile.save()

            return Response({"message": "User registered successfully!"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class Signin(APIView):
    authentication_classes = [SessionAuthentication]
    
    def post(self,request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request,user)

            return Response({"message" : "Logged in successfully"})
        else: 
            return Response({"error" : "Invalid Credenitials"}, status=status.HTTP_403_FORBIDDEN)

class logoutView(APIView):
        permission_classes = [IsAuthenticated]
        def post(self,request):
            logout(request)
            return Response({"message": "logged out !!"})

class Posts(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
            Post = PostsModel.objects.exclude(profile__visibility="private")
            serializer = PostsSerializer(Post, many=True)
            data = serializer.data
            return Response(data)
    
    def post(self,request):
        serializer = PostsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(profile=request.user.profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors ,status=status.HTTP_400_BAD_REQUEST)

class toggleLike(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        try:
            post = PostsModel.objects.get(pk=pk)
        except PostsModel.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        
        user = request.user
        other_user = post.profile.user
        if user in post.liked_by.all():
            post.liked_by.remove(user)
            liked = False
        elif user == other_user:
            post.liked_by.add(user)
            liked = True
        else:
            post.liked_by.add(user)
            SendNotification("Like", other_user, user, post.content[:18])
            liked = True
        return Response({"Liked": liked, "Count": post.liked_by.count()})
    
class toggleSave(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request,pk):
        try:
            post = PostsModel.objects.get(pk=pk)      
        except PostsModel.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        
        user = request.user
        other_user = post.profile.user
        if user in post.saved_by.all():
            post.saved_by.remove(user)
            Saved = False
        elif user == other_user:
            post.saved_by.add(user)
            Saved = True
        else:
            post.saved_by.add(user)
            Saved = True
        return Response({"Saved": Saved, "Count": post.saved_by.count()})
        

        

class ProfileData(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user

        profile = Profile.objects.get(user=user)
        liked_posts = user.liked_posts.all()
        saved_posts = user.saved_posts.all()

        LikedPosts = PostsSerializer(liked_posts, many=True)
        SavedPosts = PostsSerializer(saved_posts, many=True)

        profile_data = {
            "id": profile.id,
            "bio": profile.bio,
            "user": {"username": user.username,
                     "email": user.email},
            "liked_posts": LikedPosts.data,
            "saved_posts": SavedPosts.data
        }
        if profile.pfp and hasattr(profile.pfp, "url"):
            profile_data["pfp"] = profile.pfp.url  
        else:
            profile_data["pfp"] = None  

        

        return Response(profile_data)
    
    def patch(self,request):
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response ({"error": "Profile not found"})
        
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request, username):
        user = request.user
        profileUser = get_object_or_404(User, username=username)
        profile = get_object_or_404(Profile, user=profileUser)
        

        liked_posts = user.liked_posts.all()
        saved_posts = user.saved_posts.all()
        LikedPosts = PostsSerializer(liked_posts, many=True)
        SavedPosts = PostsSerializer(saved_posts, many=True)
        
        owner = profileUser == user

        data = {
            "username": profile.user.username,
            "bio": profile.bio,
            "followers_count": len(Follow.objects.followers(profile.user)),
            "following_count": len(Follow.objects.following(profile.user)),
            "isowner": owner,

        }

        if profile.pfp and hasattr(profile.pfp, "url"):
            data["pfp"] = profile.pfp.url  
        else:
            data["pfp"] = None  

        if owner:
            data["liked"] = LikedPosts.data
            data["saved"] = SavedPosts.data

        data["posts"] = PostsSerializer(profile.posts.all(), many=True).data

        return Response(data)
            
def SendNotification(type, recipient, sender, content):
    if type == "Like":
        if not Notifications.objects.filter(recipient=recipient, sender=sender, message=f"{sender} liked your post! {content}", notif_type="LIKE").exists():
            Notifications.objects.create(recipient=recipient, sender=sender, message=f"{sender} liked your post! '{content}'",notif_type="LIKE")

    if type == "Follow":
        if not Notifications.objects.filter(recipient=recipient, sender=sender, message=f"{sender} started following you!.", notif_type="FOLLOW").exists():
            Notifications.objects.create(recipient=recipient, sender=sender, message=f"{sender} started following you!.",notif_type="FOLLOW")

class toggleFollow(APIView):
    def post(self, request, pk):
        try:
            other_user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user

        if other_user == user:
            return Response({"error": "You cannot add yourself!"}, status=status.HTTP_400_BAD_REQUEST)
        
        if other_user in Follow.objects.following(user):
            Follow.objects.remove_follower(request.user, other_user)
            following=False
            return Response({"message": f"You are not following {other_user} anymore!!", "Following":following},status=status.HTTP_200_OK)
        
        Follow.objects.add_follower(user, other_user)
        SendNotification("Follow", other_user, user, None)
        following=True
        return Response({"message": f"{user} is following {other_user} now !!!", "Following":following})
    
class getFollowings(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        Followings = Follow.objects.following(user)
        following_ser = ({"id": u.id} for u in Followings)
        return Response({"followings":following_ser})


class FollowingsPosts(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        
        followings = Follow.objects.following(user)

        posts = PostsModel.objects.filter(profile__user__in=followings).order_by('-created')

        serializer = PostsSerializer(posts,many=True)

        return Response({"posts": serializer.data})


        
class getNoti(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        mode = request.query_params.get("mode")
        if mode == "bell":
            recevied = (
                user.Notireceived
                .select_related("sender", "sender__profile")
                .order_by("-created")[:3]
            )
        elif mode == "page":
             recevied = (
                user.Notireceived
                .select_related("sender", "sender__profile")
                .order_by("-created")
            )

        serializer = NotificationSerializer(
            recevied,
            many = True,
            context={"request":request}
        )
        return Response({"notifications": serializer.data})

class UserCheck(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        return Response({"message": "Authenticated!"})

class DeletePost(APIView):
    permission_classes =[IsAuthenticated]

    def post(self,request):
        post_id = request.data.get('id')
        try:
            post = PostsModel.objects.get(id=post_id)
        except PostsModel.DoesNotExist:
            return Response({"error": "Post not found"})
        
        post.delete()
        return Response({"message": "Post has been deleted"},status=status.HTTP_200_OK)
    
class Visibility(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        visibility = request.data.get("visibility")
        profile = Profile.objects.get(user=user)

        choices = ["public", "private"]
        if visibility not in choices:
            return Response({"error":"invalid data"}, status=status.HTTP_400_BAD_REQUEST)

        profile.visibility = visibility
        profile.save()

        return Response({"message": "Visibility updated", "visibility": profile.visibility}, status=status.HTTP_200_OK)
    
class UpdateAccount(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self,request):
        user = request.user

        username = request.data.get("username")
        email = request.data.get("email")

        if username:
            if User.objects.exclude(id=user.id).filter(username=username).exists():
                return Response({"error": "Username is already taken"}, status=status.HTTP_400_BAD_REQUEST)
            user.username = username
        
        if email:
            if User.objects.exclude(id=user.id).filter(username=username).exists():
                return Response({"error": "Email is already taken"}, status=status.HTTP_400_BAD_REQUEST)
            user.email = email
        
        user.save()
        return Response(
            {"message": "Account has been updated successfully", "username": user.username, "email": user.email},
            status=status.HTTP_200_OK
        )

class DeleteUser(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        user = request.user
        user.delete()

        return Response({"message": "User deleted"}, status=status.HTTP_200_OK)