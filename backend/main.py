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


# allow cross-origin communication
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
        "value": 1
    },
    "layer_names": {
        "value": [
            'layer 1'
        ]
    },
    "layer_thickness": {
        "value": [
            2500
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



def sample_history(
    seed: int,
    history_fn: str = None
):
    events = app.rhist.sample_events(seed=seed)
    logging.debug(events)
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

    fistory_fn = history_fn if history_fn else "tmp_section.his"
    nh.write_history(fistory_fn)
    return history_fn

def sample_experiment(
    seed: int, 
    history_fn: str = None
) -> pynoddy.experiment.Experiment:
    """Sample events and parse them into pynoddy Experiment object.

    Args:
        seed (int): Random seed.

    Returns:
        pynoddy.experiment.Experiment: Parametrized pynoddy Experiment object.
    """
    history_fn = sample_history(seed=seed, history_fn=history_fn)
    exp = pynoddy.experiment.Experiment("tmp_section.his")
    exp.set_extent(*app.extent)
    exp.set_origin(*app.origin)
    return exp


def sample_model(
    seed: int,
    history_fn: str = None,
    sim_type: str = "TOPOLOGY"
):
    history_fn = sample_history(seed=seed, history_fn=history_fn)
    pynoddy.compute_model(history_fn, "output", sim_type=sim_type)
    return "output"


init_pynoddy(extent_default)


##  #########################################
##  Routes
##  #########################################
@app.post("/history")
async def set_probabilistic_history(model: Model):
    """Set or update front-end parametrization in RandomHistory object.

    Args:
        model (Model): Model parametrization.
    """
    events = json.loads(model.history)
    app.rhist.history = events
    app.rhist.rock_library = json.loads(model.rock_library)
    app.origin = (model.extent.x, model.extent.y, model.extent.Z)
    app.extent = (model.extent.X, model.extent.Y, model.extent.z + model.extent.Z)


@app.get("/events/{seed}")
async def sample_experiment_events(seed: int):
    exp = sample_experiment(seed)
    events = exp.events
    return events


@app.get("/rocklibrary/")
async def get_current_rock_library():
    return {'library': app.rhist.rock_library}


@app.get("/sample/{seed}/{x}/{y}")
async def sample_1d_borehole(seed: int, x: int, y: int):
    exp = sample_experiment(seed)
    return {
        'seed': seed,
        'x': x,
        'y': y,
        'model': exp.get_drillhole_data(x, y).tolist()
        }


def fb_diff(fb: np.ndarray, nd: int=1) -> np.ndarray:
    d0 = fb[nd:, :,:] - fb[:-nd, :,:]
    d1 = fb[:,nd:,:] - fb[:,:-nd,:]
    d2 = fb[:,:, nd:] - fb[:,:, :-nd]
    
    d0 = d0.astype(bool)
    d1 = d1.astype(bool)
    d2 = d2.astype(bool)
    
    diff = np.logical_or(
        d0[:, nd:, nd:], 
        d1[nd:, :, nd:], 
        d2[nd:, nd:, :]
    )
    return diff


def fb_diff_2d(fb: np.ndarray, nd: int=1) -> np.ndarray:
    d0 = fb[nd:, :] - fb[:-nd, :]
    d1 = fb[:,nd:] - fb[:,:-nd]
    
    d0 = d0.astype(bool)
    d1 = d1.astype(bool)
    
    diff = np.logical_or(
        d0[:, nd:], 
        d1[nd:, :], 
    )
    return diff


@app.get("/sample/{seed}/{direction}")
async def sample_2d_section(
        seed: int,
        direction: Section,
        position: int = None,
        cubesize: int = 50,
        faultlabels: bool = False,
        faultdiff: int = 1,
        faultblock: bool = False
):
    exp = sample_experiment(seed)
    
    if not position:
        position = 'center'
    
    exp.change_cube_size(cube_size=cubesize)

    if faultlabels or faultblock:
        tmp_out = exp.get_section(
            direction=direction.value,
            position=position,
            sim_type="TOPOLOGY",
            remove_tmp_files=False
        )
    else:
        tmp_out = exp.get_section(
            direction=direction.value,
            position=position,
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

    payload = {
        'seed': seed,
        'position': position,
        'shape': shape,
        'lithologies': app.rhist.rock_sample,
        'section': section.tolist(),
    }
    if faultblock:
        fb = tmp_out.faultblock
        if direction.value == 'y':
            fb = np.flip(fb[:, 0, :].T, axis=0).astype(int)
        elif direction.value == 'x':
            fb = np.flip(fb[0, :, :].T, axis=0).astype(int)

        if faultblock:
            payload["faultblock"] = fb.tolist()

        if faultlabels:
            fb = fb_diff_2d(fb, nd=faultdiff).astype(int)
            payload["faultlabels"] = fb.tolist()

    return payload


def parse_g21(lines: list, res: tuple) -> np.ndarray:
    """
    Parse given .g21 file lines into 3D numpy array representing
    the fault block of the Noddy model.    
    """
    nx, ny, nz = res
    splits = []
    for line in lines:
        if line == "\n":
            continue
        split = [int(l) for l in line.rstrip().split("\t")]
        splits.append(split)

    sections = []
    for n in range(1, nz + 1):
        sections.append(np.array(splits[(n-1)*ny:n*ny]))

    return np.array(sections)


@app.get("/sample/{seed}")
async def sample_3d_model(
    seed: int,
    faultblock: bool = False
):
    output = {"seed": seed}
    nout_fn = sample_model(seed)
    nout = pynoddy.output.NoddyOutput(nout_fn)

    # compute block model
    model = nout.block
    output["model"] = model.tolist()
    # fault block
    if faultblock:
        with open(nout_fn + ".g21", "r") as f:
            lines = f.readlines()
        fb = parse_g21(lines, (nout.nx, nout.ny, nout.nz))
        faultblock = fb_diff(fb, nd=1)
        output["faultblock"] = faultblock.tolist()

    return output


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)