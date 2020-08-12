from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import uvicorn
sys.path.append("../../randomhistory")
sys.path.append("../../pynoddy/")
import randomhistory as rh
import pynoddy
import pynoddy.experiment
import json
import numpy as np
from uvicorn.config import logger as logging
from typing import List, Optional, Union, Dict
from models import Section, Model
app = FastAPI()

origins = [
    'http://localhost:8080'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=['*'],
)


app.history = None
history_default = [{
    "type": "stratigraphy",
    "parameters": {
    "num_layers": {
        "value": 18
    },
    "layer_names": {
        "value": [
            'layer 1', 'layer 2', 'layer 3',
            'layer 4', 'layer 5', 'layer 6',
            'layer 7', 'layer 8', 'layer 9',
            'layer 10', 'layer 11', 'layer 12',
            'layer 13', 'layer 14', 'layer 15',
            'layer 16', 'layer 17', 'layer 18'
        ]
    },
    "layer_thickness": {
        "value": [
            2500, 150, 150, 150, 150, 150, 150,
            150, 150, 150, 150, 150, 150, 150,
            150, 150, 150, 150, 150
        ]
    },
    }
}]
extent_default = [0, 10000, 0, 1000, 0, 5000]


def init_pynoddy(extent: List[float]):
    """Initialize RandomHistory stochastic wrapper for pynoddy.

    Args:
        extent (List[float]): x,X,y,Y,z,Z.
    """
    app.rhist = rh.RandomHistory(extent)
    app.extent = (extent[1], extent[3], extent[5])
    app.origin = (extent[0], extent[2], extent[4])
    if not app.history:
        app.history = history_default
    app.rhist.history = app.history


def get_sample_exp(seed: int) -> pynoddy.experiment.Experiment:
    events_sample = app.rhist.sample_events(seed=seed)
    return parse_events(events_sample)


def parse_events(
        events: list,
        fistory_fn: str = None
) -> pynoddy.experiment.Experiment:
    logging.debug("--- EVENT PARSING ---")
    nh = pynoddy.history.NoddyHistory()

    for event_type, properties in events:
        if not properties.get('name'):
            properties['name'] = str(np.random.randn())

        logging.debug(f"--- {event_type}")
        for pname, prop in properties.items():
            if type(prop) is list:
                prop = [prop[0], "...", prop[-1]]
            logging.debug(f"{pname}: {prop}")

        nh.add_event(event_type, properties)

    fistory_fn = fistory_fn if fistory_fn else "temp.his"
    nh.write_history(fistory_fn)
    exp = pynoddy.experiment.Experiment(fistory_fn)
    exp.set_extent(*app.extent)
    exp.set_origin(*app.origin)
    return exp


init_pynoddy(extent_default)


@app.post("/history")
async def set_probabilistic_history(model: Model):
    events = json.loads(model.history)
    app.rhist.history = events
    app.rhist.rock_library = json.loads(model.rock_library)
    app.origin = (model.extent.x, model.extent.y, model.extent.Z)
    app.extent = (model.extent.X, model.extent.Y, model.extent.z + model.extent.Z)


@app.get("/events/{seed}")
async def sample_history(seed: int):
    exp = get_sample_exp(seed)
    events = exp.events
    return events


@app.get("/rocklibrary/")
async def rock_library():
    pass


@app.get("/rocklibrary/{name}")
async def rock_library_name(name: str):
    pass


@app.get("/sample/{seed}/{x}/{y}")
async def sample_1d_borehole(seed: int, x: int, y: int):
    exp = get_sample_exp(seed)
    return {
        'seed': seed,
        'x': x,
        'y': y,
        'model': exp.get_drillhole_data(x, y).tolist()
        }


@app.get("/sample/{seed}/{direction}")
async def sample_2d_section(
        seed: int,
        direction: Section,
        position: int = None
):
    exp = get_sample_exp(seed)
    
    if not position:
        position = 'center'
    tmp_out = exp.get_section(
        direction=direction.value,
        position=position
    )
    section = tmp_out.block
    if direction.value == 'y':
        section = np.flip(section[:, 0, :].T, axis=0).astype(int)
    elif direction.value == 'x':
        section = np.flip(section[0, :, :].T, axis=0).astype(int)
    shape = section.shape
    logging.debug("--- 2D SECTION ---")
    logging.debug(f"Section horizons: {np.unique(section)}")
    logging.debug(f"Lithologies: {app.rhist.rock_sample}")
    return {
        'seed': seed,
        'position': position,
        'shape': shape,
        'lithologies': app.rhist.rock_sample,
        'section': section.tolist(),
    }


@app.get("/sample/{seed}")
async def sample_3d_model(seed: int):
    # compute block model
    return {"model": [], "seed": seed}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)