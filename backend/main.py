from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import sys
import uvicorn
sys.path.append("../../pynoddy/")
import randomhistory as rh
import pynoddy
import pynoddy.experiment
import json
import numpy as np
from uvicorn.config import logger as logging
from typing import List
from starlette.responses import RedirectResponse
from models import Section, Model
import os

allow_3d = os.getenv("MODELR_3D", True)

app = FastAPI()

# allow cross-origin communication
origins = [
    '*'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=['*'],
    allow_headers=['*']
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
extent_default = [0, 10000, 0, 10000, 0, 5000]


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
) -> str:
    """
    Sample from probabilistic history using given random seed and
    write Noddy history file.

    Args:
        seed (int): Random seed.
        history_fn: Custom history filename.

    Returns:
        [str] History file filename.
    """
    events = app.rhist.sample_events(seed=seed)  # draw samples for all events

    logging.debug(events)
    logging.debug("--- EVENT PARSING ---")

    # create noddy history object, which takes care of noddy boilerplate
    # for history file
    nh = pynoddy.history.NoddyHistory()

    for event_type, properties in events:
        if not properties.get('name'):
            # add a random name for each event, as Noddy requires it
            properties['name'] = str(np.random.randn())

        # logging for debugging
        logging.debug(f"--- {event_type}")
        for pname, prop in properties.items():
            if type(prop) is list:
                prop = [prop[0], "...", prop[-1]]
            logging.debug(f"{pname}: {prop}")

        # add event to noddy history
        nh.add_event(event_type, properties)

    # write history file
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
        history_fn (str): History filename.

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


def fb_diff(fb: np.ndarray, nd: int = 1) -> np.ndarray:
    """Create difference fault block for a 3D model.

    Args:
        fb (np.ndarray: Geomodel fault block.
        nd (int): Number of array elements to shift along each axis
            before calculating differences.

    Returns:
        [np.ndarray] Fault difference block used as fault labels.
    """
    d0 = fb[nd:, :, :] - fb[:-nd, :, :]
    d1 = fb[:, nd:, :] - fb[:, :-nd, :]
    d2 = fb[:, :, nd:] - fb[:, :, :-nd]

    d0 = d0.astype(bool)
    d1 = d1.astype(bool)
    d2 = d2.astype(bool)

    diff = np.logical_or(
        d0[:, nd:, nd:],
        d1[nd:, :, nd:],
        d2[nd:, nd:, :]
    )
    return diff


def fb_diff_2d(fb: np.ndarray, nd: int = 1) -> np.ndarray:
    """Create difference fault block for a 2D section.

    Args:
        fb (np.ndarray: Geomodel fault block.
        nd (int): Number of array elements to shift along each axis
            before calculating differences.

    Returns:
        [np.ndarray] Fault difference block used as fault labels.
    """
    d0 = fb[nd:, :] - fb[:-nd, :]
    d1 = fb[:, nd:] - fb[:, :-nd]

    d0 = d0.astype(bool)
    d1 = d1.astype(bool)

    diff = np.logical_or(
        d0[:, nd:],
        d1[nd:, :],
    )
    return diff


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


init_pynoddy(extent_default)


#  ---------------------------------------------------------------------------------------------------------------------
#  ---------------------------------------------------------------------------------------------------------------------
#  Routes
#  ---------------------------------------------------------------------------------------------------------------------
#  ---------------------------------------------------------------------------------------------------------------------

@app.get("/")
async def documentation():
    return RedirectResponse(url="/docs")


@app.api_route("/history", methods=["GET", "POST"])
async def set_probabilistic_history(request: Request, model: Model):
    """Set/update front-end parametrization changes in RandomHistory object. So this
    communicates every relevant change to the parametrization in the front end to
    the backend to ensure synchronization at all times.

    Args:
        model (Model): Model parametrization.
    """
    if request.method == "GET":
        return app.rhist.history  # jsonify(app.rhist.history)

    elif request.method == "POST":
        events = json.loads(model.history)  # load the history json as dict from POST data
        app.rhist.history = events
        app.rhist.rock_library = json.loads(model.rock_library)  # load rock library json as dict
        app.origin = (model.extent.x, model.extent.y, model.extent.Z)  # update origin
        app.extent = (model.extent.X, model.extent.Y, model.extent.z + model.extent.Z)  # update extent
        return


# @app.get("/history")
# async def get_probabilistic_history():
#     """Returns the probabilistic history dict/JSON. Same result as using the export history button
#     in the front end."""
#     return app.rhist.history


@app.get("/events/{seed}")
async def sample_pynoddy_experiment_events(seed: int):
    """Converts a probabilistic event sample into the data structure used by pynoddy.Experiment. This
    can be used to quickly generate thousands of sample parametrizations that will work with any
    pynoddy installation on any system."""
    exp = sample_experiment(seed)
    events = exp.events
    return events


@app.get("/rocks/")
async def get_rock_properties():
    """Gets the rock property JSON."""
    return app.rhist.rock_library


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
    """
    Sample a 2D section through the model along the specified axis.

    Args:
        seed (int): Random seed.
        direction (str): Specifies along which axis to extract the section. {'x', 'y', 'z'}
        position (int): Position of the section along the axis in extent coordinates.
        cubesize (int): Discretization cube size. The smaller the more fine-grained the section.
            Significantly increases computation time.
        faultlabels (bool): If True returns the fault labels section too. Defaults to False.
        faultdiff (int): Used to adjust the shifting used to create the fault labels block from
            the fault block. Defaults to 1.
        faultblock (bool): If True returns the fault block section. Defaults to False.
    """
    # history_fn = direction.value + ".his"
    exp = sample_experiment(seed)
    
    if not position:
        position = 'center'
    
    exp.change_cube_size(cube_size=cubesize)

    if faultlabels or faultblock:
        tmp_out = exp.get_section(
            direction=direction.value,
            position=position,
            sim_type="TOPOLOGY",
            remove_tmp_files=False,
        )
    else:
        tmp_out = exp.get_section(
            direction=direction.value,
            position=position,
            remove_tmp_files=False,
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


if allow_3d:
    @app.get("/sample/{seed}")
    async def sample_3d_model(
        seed: int,
        faultlabels: bool = False,
        faultdiff: int = 1,
    ):
        output = {"seed": seed}
        nout_fn = sample_model(seed)
        nout = pynoddy.output.NoddyOutput(nout_fn)

        # compute block model
        model = nout.block
        output["model"] = model.tolist()
        # fault block
        if faultlabels:
            with open(nout_fn + ".g21", "r") as f:
                lines = f.readlines()
            fb = parse_g21(lines, (nout.nx, nout.ny, nout.nz))
            faultblock = fb_diff(fb, nd=faultdiff)
            output["faultlabels"] = faultblock.tolist()

        return output


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
