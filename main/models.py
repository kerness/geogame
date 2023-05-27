from django.db import models
from django.contrib.auth.models import User


class Game(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField()
    played_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.score) + self.player.first_name

