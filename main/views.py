from django.shortcuts import render, redirect
from .forms import RegisterForm, GameForm
from django.contrib.auth import login
from .models import Game
from django.db.models import Max, Sum, OuterRef, Subquery
from django.contrib.auth.decorators import login_required


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
    played_at_subquery = Game.objects.filter(player=OuterRef('player')).order_by('-score', '-played_at').values(
        'played_at')[:1]
    games = Game.objects.values('player').annotate(max_score=Max('score'),
                                                   played_at=Subquery(played_at_subquery)).order_by('-max_score')

    return render(request, 'main/ranking.html', {'games': games})


@login_required(login_url="/login")
def profile(request):
    games_count = Game.objects.filter(player=request.user).count()
    score_count = Game.objects.filter(player=request.user).aggregate(Sum('score'))
    latest_game = Game.objects.latest('played_at')
    return render(request, 'main/profile.html',
                  {'games_count': games_count, 'score_count': score_count, 'last_game': latest_game})


@login_required(login_url="/login")
def home_loggedin(request):
    return render(request, 'main/home_loggedin.html')


@login_required(login_url="/login")
def game(request):
    if request.method == 'POST':
        form = GameForm(request.POST)
        if form.is_valid():
            form_game = form.save(commit=False)
            form_game.player = request.user
            form_game.save()
            return redirect('/game')
    else:
        form = GameForm()

    return render(request, 'main/game.html', {'form': form})
