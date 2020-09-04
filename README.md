
# Installation
## Docker (recommended)
The recommended way to install and run the app on your machine is by using Docker Compose
```
docker-compose up --build
```

```
docker-compose up
```

And you can access the API (backend) at `localhost:8000`, and the frontend at `localhost:8080`.

## manual
###  frontend

```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```


### backend

Install 
```
cd backend
pip install pipenv
pipenv install
```

```
git clone https://github.com/cgre-aachen/pynoddy
cd pynoddy
pipenv run python setup.py install
```

```
cd backend
pipenv shell
uvicorn main:app --reload
```