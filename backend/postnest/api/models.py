from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import pathlib
import uuid
from django.contrib.auth.models import User


# Create your models here.
def pic_upload(instance, filepath):
    fname = str(uuid.uuid1())
    ext = pathlib.Path(filepath).suffix
    return f"Posts/{fname}{ext}"

def pfp(instance, filepath):
    fname = str(uuid.uuid1())
    ext = pathlib.Path(filepath).suffix
    return f"profilepictures/{fname}{ext}"




class Profile(models.Model):
    class Visibility(models.TextChoices):
        PUBLIC = "public", "Public"
        PRIVATE = "private", "Private"

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.CharField(max_length=125, blank=True, null=True,default="Hello World!.")
    pfp = models.ImageField(upload_to=pfp, blank=True, null=True)
    
    visibility = models.CharField(
        max_length=10,
        choices=Visibility.choices,
        default=Visibility.PUBLIC
    )    


    def __str__(self):
        return self.user.username
    
@receiver(post_save, sender=Profile)
def CreateProfile(sender, instance, created, **kwargs):
    if created:
        print(f"Profile Created for {instance.user}")

class PostsModel(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="posts", null=True)

    content = models.CharField(max_length=250, null=True)
    
    image = models.ImageField(upload_to=pic_upload, blank=True, null=True)

    created = models.DateField(auto_now=True)

    liked_by = models.ManyToManyField(User, related_name="liked_posts", blank=True)

    saved_by = models.ManyToManyField(User, related_name="saved_posts", blank=True)

    def __str__(self):
        return self.content[:10]
    
class Notifications(models.Model):
    NOTIFICATION_TYPES = [
        ("LIKE", "Like"),
        ("COMMENT", "Comment"),
        ("FOLLOW", "Follow"),
    ]
    recipient = models.ForeignKey(User, related_name="Notireceived", on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name="Notisent", on_delete=models.CASCADE)
    message = models.CharField(max_length=100)
    notif_type = models.CharField(max_length=10, choices=NOTIFICATION_TYPES, default="LIKE")
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} -> {self.recipient}: {self.message}"


