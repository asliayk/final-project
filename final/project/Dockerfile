FROM python:3
ENV PYTHONBUFFERED 1
WORKDIR /finapp
ADD . /finapp
COPY ./requirements.txt /finapp/requirements.txt
RUN pip install -r requirements.txt
COPY . /finapp