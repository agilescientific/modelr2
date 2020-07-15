from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import json
import sys
sys.path.append("../pynoddy/")
import pynoddy
import pynoddy.experiment
import numpy as np
import scipy.stats
import bruges


# configuration
DEBUG = True

# instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})
# TODO: make sure to not allow all cross-origin requests in production

@app.route("/compute", methods=['POST'])
def compute():
    data = json.loads(request.data)

    # compute geomodel from payload history
    history = data.get('history')
    section = np.flip(compute_geomodel(history), axis=0).astype(int)

    if data.get("computeSeismic") == "true":
        seismic = compute_seismic(section).tolist()
    else:
        seismic = None
    
    payload = {
        'section': section.tolist(),
        'seismic': seismic
    }
    return jsonify(payload)


def compute_geomodel(history: list) -> np.ndarray:
    events = []
    for event in json.loads(history):
        event_type, event_name = event.get("type"), event.get("name")
        event_params = event.get("parameters")
        if event_name:
            event_params['name'] = event_name
        events.append([event_type, event_params])

    exp = parse_events(events)
    tmp_out = exp.get_section()
    section, _ = tmp_out.get_section_voxels()
    return section


def compute_seismic(section: np.ndarray) -> np.ndarray:
    n_layers = len(np.unique(section))  # TODO: get this from history?

    np.random.seed(42)
    rho = np.array(
        [scipy.stats.uniform(2550, 100).rvs() for _ in range(n_layers + 1)]
    )
    vp = np.array(
        [scipy.stats.uniform(3200, 100).rvs() for _ in range(n_layers + 1)]
    )
    ai = vp * rho

    # turn geomodel into velocity model
    boolean = np.repeat(
        section.flatten()[None, :], n_layers, axis=0
    )==np.arange(1, n_layers + 1)[None, :].T
    velocity = np.sum(
        boolean.astype(int) * ai[None, :n_layers].T, axis=0
    ).reshape(*section.shape)

    upper, lower = velocity[:-1][:], velocity[1:][:]
    rc = (lower - upper) / (lower + upper)

    w = bruges.filters.ricker(duration=0.100, dt=0.002, f=40)

    seismic = np.apply_along_axis(
        lambda t: np.convolve(t, w, mode='same'),
        axis=0, arr=rc #+ np.random.randn(99,200) * 0.01
    )

    seismic += np.abs(np.min(seismic))
    seismic /= np.max(seismic)
    return seismic


def parse_events(
    events: list,
    history: str = None
) -> pynoddy.experiment.Experiment:
    nh = pynoddy.history.NoddyHistory()
    for event_type, properties in events:
        nh.add_event(event_type, properties)
    history = history if history else "history.his"
    nh.write_history(history)
    exp = pynoddy.experiment.Experiment(history)
    return exp

if __name__ == '__main__':
    app.run()