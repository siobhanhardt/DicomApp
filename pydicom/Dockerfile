FROM python:3.9-slim

WORKDIR /app

RUN pip3 install requests numpy pydicom flask matplotlib

COPY . .

EXPOSE 5000

CMD ["python", "server.py"]
