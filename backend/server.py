import os
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import threading
import signal
from pyngrok import ngrok

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:5173",
    "https://mpl-id-s15-prediction-z4fl.netlify.app"
])
port = 5000
subdomain = "deeply-lenient-mammoth"

def register_routes(model, helper_function):
    @app.route("/", methods=["GET"])
    def index():
        return "Flask + Ngrok running..."

    @app.route("/predict", methods=["POST"])
    def predict():
        try:
            data = request.get_json()
            if not data or 'data_picks' not in data or 'attributes' not in data:
                return jsonify({'error': 'Missing required fields: data_picks or attributes'}), 400

            picks_df = pd.DataFrame(data['data_picks'])
            attributes_df = pd.DataFrame(data['attributes'])

            processed_data = helper_function(picks_df, attributes_df)

            prediction = model.predict(processed_data)[0]
            side_chance_win = model.predict_proba(processed_data)[0]
            blue_chance = round(side_chance_win[0] * 100, 2)
            red_chance = round(side_chance_win[1] * 100, 2)

            return jsonify({
                'prediction': str(prediction),
                'blue_chance': blue_chance,
                'red_chance': red_chance
            })

        except Exception as e:
            return jsonify({'error': str(e)}), 500

def run_flask():
    app.run(port=port)

def shutdown(signal_received, frame):
    print("Shutdown requested. Closing ngrok...")
    try:
        print("Stopping ngrok...")
        ngrok.disconnect(f"http://{subdomain}.ngrok-free.app")
        ngrok.kill()
    except Exception as e:
        print(f"Error during ngrok shutdown: {e}")
    time.sleep(0.5)
    os._exit(0)

def run(model, helper_function):
    signal.signal(signal.SIGINT, shutdown)

    # Register all routes
    register_routes(model, helper_function)

    # Start Flask in thread
    threading.Thread(target=run_flask, daemon=False).start()

    # Start ngrok
    public_url = ngrok.connect(addr=port, domain=f"{subdomain}.ngrok-free.app")
    print(f"Public URL: {public_url}")
