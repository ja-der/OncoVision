from flask import Flask, jsonify, request
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import numpy as np
import os

app = Flask(__name__)
CORS(app)
MODEL_PATH = "cancer_classifier.h5"
model = load_model(MODEL_PATH)

# @app.route("/")
# def hello_world():
#     return "<p>Hello, World!</p>"

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400 

    filepath = os.path.join("uploads", file.filename)
    os.makedirs("uploads", exist_ok = True)
    file.save(filepath)

    image = load_img(filepath, target_size = (150,150))
    image = img_to_array(image)
    image = np.expand_dims(image, axis = 0)

    prediction = model.predict(image)
    os.remove(filepath)
    
    return jsonify({"prediction": "Benign" if prediction[0][0] < 0.5 else "Malignant"})

if __name__ == "__main__":
    app.run(debug=True)