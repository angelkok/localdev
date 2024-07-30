FROM python:3.6

ADD . /app
RUN cd /app && pip install -r requirements.txt

EXPOSE 8000
ENTRYPOINT ["python", "/app/app.py"]
