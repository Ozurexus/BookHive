FROM python:3.9

WORKDIR /app

COPY . .
RUN pip3 install --upgrade -r requirements.txt

CMD [ "python3", "-u", "./app/main.py"]
