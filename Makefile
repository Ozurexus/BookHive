up-local:
	python3 setup.py -c localhost && docker-compose up -d --build

up-local-no-client:
	python3 setup.py -c localhost && docker-compose up -d --build db_postgres setup backend ml

up-prod:
	python3 setup.py -c 51.250.70.194 && docker-compose up -d --build

down:
	docker-compose down