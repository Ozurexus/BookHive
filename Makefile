up-local:
	python3 setup.py -c local.json && docker-compose up -d --build

up-local-no-client:
	python3 setup.py -c local.json && docker-compose up -d --build db_postgres setup backend

down:
	docker-compose down