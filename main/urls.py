from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('home', views.home, name='home'),
    path('sign-up', views.sign_up, name='sign-up'),
    path('ranking', views.ranking, name='ranking'),
    path('profile', views.profile, name='profile'),
    path('home_loggedin', views.home_loggedin, name='home_loggedin'),
    path('game', views.game, name='game')
]