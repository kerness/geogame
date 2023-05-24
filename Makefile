install:
	pipenv install

activate:
	pipenv shell

run:
	python manage.py runserver

migration:
	python manage.py makemigrations

migrate:
	python manage.py migrate
