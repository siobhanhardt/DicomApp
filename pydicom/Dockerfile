FROM python:3.9-slim

WORKDIR /app

RUN pip3 install requests numpy pydicom flask matplotlib gunicorn

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server:app"]
