"""Script to generate some dummy data
    Run only within manage.py shell.
"""
from django.contrib.auth.models import User
from main.models import Game

for i in range(1, 20):
    user_name = 'user' + str(i)
    user = User.objects.create_user(user_name, f'{user_name}@{user_name}.com', 'sn@pswrd')
    user.save()
    game = Game(player=user, score=654 + i * 32)
    game.save()
