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
def compute_model():
    print("Compute Model")
    pass


@app.route("/seismic", methods=['POST'])
@cross_origin()
def simulate_seismic():
    data = request.data
    parsed = json.loads(data)
    section = np.array(json.loads(parsed.get('section')))
    n_layers = len(np.unique(section))  # TODO: get this from history?

    np.random.seed(42)
    rho = np.array(
        [scipy.stats.uniform(3200, 3300).rvs() for _ in range(n_layers + 1)]
    )
    vp = np.array(
        [scipy.stats.uniform(2550, 2650).rvs() for _ in range(n_layers + 1)]
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

    return jsonify({'seismic': seismic.tolist()})


request_data = {
    "history": [["stratigraphy", {}], ["fault", {}]],
    "stochastic": False,
    "samples": 1000
}


@app.route("/history", methods=['POST'])
@cross_origin()
def parse_history():
    data = request.data
    parsed = json.loads(data)
    history = json.loads(parsed.get('history'))
    events = []
    for event in history:
        event_type = event.get("type")
        event_params = event.get("parameters")
        event_name = event.get("name")
        if event_name:
            event_params['name'] = event_name
        events.append([event_type, event_params])

    exp = parse_events(events)
    tmp_out = exp.get_section()
    section, _ = tmp_out.get_section_voxels()
    return jsonify({"model": np.flip(section, axis=0).astype(int).tolist()})


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