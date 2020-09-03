FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

COPY . .
WORKDIR .

RUN pip install -r requirements.txt
RUN git clone https://github.com/cgre-aachen/pynoddy.git
WORKDIR ./pynoddy
RUN python setup.py install
WORKDIR ..