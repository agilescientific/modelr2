# modelr2



## Installation

The recommended way to install and run the app on your machine is by using Docker Compose. 

You can also install the dependencies for both the back and frontend and then run both services 
manually (only recommended for people experienced with Python webservers and `npm`).

### Docker (recommended)

To install the app using Docker Compose, first clone the repository, change into the repository directory and
run the Docker command with the `--build` flag.
```
git clone https://github.com/softwareunderground/modelr2.git
cd modelr2
docker-compose up --build
```
Once the multi-container Docker application is built once, you can start it without the flag: 
```
docker-compose up
```

You can then access the API (backend) at `localhost:8000`, and the frontend at `localhost:8080`.

### Manual
####  Frontend

```
npm install
```

##### Compiles and hot-reloads for development
```
npm run serve
```

##### Compiles and minifies for production
```
npm run build
```


#### Backend

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