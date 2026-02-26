from django.urls import path
from .views import * 
urlpatterns = [
    
    path("signup/", Signup.as_view()),
    path("signin/", Signin.as_view(), name=""),
    path("csrftoken/", csrftoken.as_view(), name=""),

    path("logout/", logoutView.as_view(), name=""),

    path("posts/", Posts.as_view()),
    path("deletepost/", DeletePost.as_view(), name=""),

    path("profile/" , ProfileData.as_view()),
    path("publicprofile/<username>", UserProfileView.as_view(), name=""),
    
    path("visibility/", Visibility.as_view(), name=""),
    path("updateaccount/", UpdateAccount.as_view(), name=""),

    path("toggleLike/<int:pk>/", toggleLike.as_view()),
    path("toggleSave/<int:pk>/", toggleSave.as_view()),

    path("follow/<int:pk>/", toggleFollow.as_view()),
    path("getfollow/", getFollowings.as_view()),
    path("followingsposts/", FollowingsPosts.as_view()),

    path("getNoti/", getNoti.as_view()),

    path("check/", UserCheck.as_view(), name=""),

    path("deleteuser/", DeleteUser.as_view(), name="")

]
