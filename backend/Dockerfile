FROM python:3.8-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY backend_functions.py backend_functions.py

#CMD [ "python3", "-u", "main.py"]