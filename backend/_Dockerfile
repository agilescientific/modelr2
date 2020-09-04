FROM python:3.7

RUN mkdir /usr/src/app
ADD . /usr/src/app/backend
ADD ./requirements.txt /usr/src/app/backend
WORKDIR /usr/src/app/backend

RUN pip install -r requirements.txt

RUN git clone https://github.com/cgre-aachen/pynoddy.git
WORKDIR /usr/src/app/backend/pynoddy
RUN python setup.py install
WORKDIR /usr/src/app/backend
#RUN git clone https://github.com/alex-schaaf/randomhistory/
EXPOSE 8000
RUN uvicorn main:app --host 0.0.0.0 --port 8000
# git clone pynoddy, install, export noddy execsutable to path