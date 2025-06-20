import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))


import pickle
from utility.feature_engineering import helper_function

# Load model
with open("../model/rf_model.pkl", "rb") as f:
    loaded_model = pickle.load(f)

# Jalankan server (Flask ada di server.py)
import server
if __name__ == "__main__":
    server.run(loaded_model, helper_function)
