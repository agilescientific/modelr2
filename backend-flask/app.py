from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import json
import sys
sys.path.append("../pynoddy/")
import pynoddy
import pynoddy.experiment
import numpy as np


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