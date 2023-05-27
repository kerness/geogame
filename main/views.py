from django.shortcuts import render, redirect
from .forms import RegisterForm
from django.contrib.auth import login
from .models import Game
from django.db.models import Max

def home(request):
    return render(request, 'main/home.html')


def sign_up(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('/home')

    else:
        form = RegisterForm()

    return render(request, 'registration/sign-up.html', {'form': form})


def ranking(request):
    # TODO: show only the highest score for each user!!
    games = Game.objects.all().order_by('-score').annotate(max_score=Max('score'))
    return render(request, 'main/ranking.html', {'games': games})
