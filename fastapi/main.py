from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from enum import Enum
import sys
from pydantic import BaseModel
import uvicorn

sys.path.append("../../pynoddy/")
sys.path.append("../../randomhistory")
import randomhistory as rh
import pynoddy
from typing import List, Optional
import pynoddy.experiment
import numpy as np

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
        "num_layers": 18,
        "layer_names": [
            'layer 1', 'layer 2', 'layer 3',
            'layer 4', 'layer 5', 'layer 6',
            'layer 7', 'layer 8', 'layer 9',
            'layer 10', 'layer 11', 'layer 12',
            'layer 13', 'layer 14', 'layer 15',
            'layer 16', 'layer 17', 'layer 18'
        ],
        "layer_thickness": [
            2500, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
            150, 150, 150, 150, 150, 150, 150, 150
        ]
    }
}]
extent_default = [0, 10000, 0, 1000, 0, 5000]


def init_pynoddy(extent: List[float]):
    """Initialize RandomHistory stochastic wrapper for pynoddy.

    Args:
        extent (List[float]): x,X,y,Y,z,Z.
    """
    app.rhist = rh.RandomHistory(extent)
    if not app.history:
        app.history = history_default
    app.rhist.history = app.history


def parse_events(
        events: list,
        fistory_fn: str = None
) -> pynoddy.experiment.Experiment:
    nh = pynoddy.history.NoddyHistory()
    for event_type, properties in events:
        nh.add_event(event_type, properties)
    fistory_fn = fistory_fn if fistory_fn else "temp.his"
    nh.write_history(fistory_fn)
    exp = pynoddy.experiment.Experiment(fistory_fn)
    return exp


def get_sample_exp(seed: int) -> pynoddy.experiment.Experiment:
    events_sample = app.rhist.sample_events(seed=seed)
    return parse_events(events_sample)


class Event(BaseModel):
    type: str
    name: Optional[str]
    parameters: dict


class Section(str, Enum):
    x = "x"
    y = "y"
    z = "z"


init_pynoddy(extent_default)


@app.get("/")
async def root():
    return {"message": "Hello API!"}


class History(BaseModel):
    history: str

@app.post("/history")
async def history(history: History):
    app.history = history
    return {"history": app.history}


@app.get("/sample/{seed}")
async def model(seed: int):
    # compute block model
    return {"model": [], "seed": seed}


@app.get("/sample/{seed}/{section}")
async def section(
        seed: int,
        section: Section,
        position: int = None
):
    exp = get_sample_exp(seed)
    if not position:
        position = 'center'
    tmp_out = exp.get_section(
        direction=section.value,
        position=position
    )
    section, _ = tmp_out.get_section_voxels()
    section = np.flip(section, axis=0).astype(int).tolist()
    return {'section': section, 'seed': seed, 'position': position}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)