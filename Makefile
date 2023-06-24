up-local:
	python3 setup.py -c local.json && docker-compose up -d --build

down:
	docker-compose down