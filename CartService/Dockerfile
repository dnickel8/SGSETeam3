# pull official base image
FROM python:3.8.10-buster

# set work directory
WORKDIR /app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy project
COPY . .

# port
EXPOSE 8000

# start server
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]