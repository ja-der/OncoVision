from flask import Flask, jsonify, request
from flask_cors import CORS
from tensorflow.keras.models import load_model, Model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import numpy as np
import os
import time
import base64
from io import BytesIO
import matplotlib.cm as cm
import tensorflow as tf

app = Flask(__name__)
CORS(app)
MODEL_PATH = "cancer_classifier.h5"
if not os.path.exists(MODEL_PATH):
    MODEL_PATH = "server/cancer_classifier.h5"

model = load_model(MODEL_PATH)
MODEL_VERSION = "1.0.0"

def find_last_conv_layer(m):
    for layer in reversed(m.layers):
        if "conv2d" in layer.name.lower():
            return layer.name
    return None

LAST_CONV_LAYER = find_last_conv_layer(model)
print(f"Detected last conv layer: {LAST_CONV_LAYER}")

def make_gradcam_heatmap(img_array, model, last_conv_layer_name):
    if not last_conv_layer_name:
        raise ValueError("No conv2d layer found in model.")
        
    grad_model = Model(
        model.inputs, [model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        last_conv_layer_output, preds = grad_model(img_array)
        class_channel = preds[:, 0]

    grads = tape.gradient(class_channel, last_conv_layer_output)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()

def get_superimposed_heatmap(img_path, heatmap, alpha=0.6):
    img = load_img(img_path)
    img_array = img_to_array(img)

    heatmap = np.uint8(255 * heatmap)
    jet = cm.get_cmap("jet")
    jet_colors = jet(np.arange(256))[:, :3]
    jet_heatmap = jet_colors[heatmap]

    jet_heatmap = tf.keras.preprocessing.image.array_to_img(jet_heatmap)
    jet_heatmap = jet_heatmap.resize((img_array.shape[1], img_array.shape[0]))
    jet_heatmap = img_to_array(jet_heatmap)

    superimposed_img = jet_heatmap * alpha + img_array
    superimposed_img = tf.keras.preprocessing.image.array_to_img(superimposed_img)

    buffered = BytesIO()
    superimposed_img.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400 

    start_time = time.perf_counter()
    
    filepath = os.path.join("uploads", file.filename)
    os.makedirs("uploads", exist_ok=True)
    file.save(filepath)

    image = load_img(filepath, target_size=(150, 150))
    img_array = img_to_array(image)
    img_array_expanded = np.expand_dims(img_array, axis=0)

    # Perform prediction
    prediction_raw = model.predict(img_array_expanded)
    confidence = float(prediction_raw[0][0])
    
    try:
        heatmap = make_gradcam_heatmap(img_array_expanded, model, LAST_CONV_LAYER)
        heatmap_base64 = get_superimposed_heatmap(filepath, heatmap)
    except Exception as e:
        print(f"Grad-CAM error: {e}")
        heatmap_base64 = None

    os.remove(filepath)
    
    inference_time = (time.perf_counter() - start_time) * 1000
    
    is_malignant = confidence >= 0.5
    display_confidence = confidence if is_malignant else (1.0 - confidence)
    
    return jsonify({
        "prediction": "Malignant" if is_malignant else "Benign",
        "confidence": float(display_confidence),
        "model_version": MODEL_VERSION,
        "inference_time_ms": round(inference_time, 2),
        "heatmap": heatmap_base64
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
