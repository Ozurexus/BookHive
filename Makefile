up-local:
	python3 setup.py -c localhost && docker-compose up -d --build

up-local-no-client:
	python3 setup.py -c localhost && docker-compose up -d --build db_postgres setup backend ml dozzle

up-prod:
	python3 setup.py -c prod && docker-compose up -d --build

down:
	docker-compose down