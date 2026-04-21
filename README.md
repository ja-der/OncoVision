# OncoVision 🩺 - Skin Cancer Detection Model

OncoVision (from _oncology_ + _vision_) is a project I built to help people check skin lesions for potential risks from home. It uses a CNN model to classify skin images as either Benign or Malignant with `~93% accuracy`.

The goal isn't to replace a real doctor, but to help people catch potential issues early so they know when it's time to seek professional medical advice.

## Demo
https://github.com/user-attachments/assets/3be5d8af-1919-4008-97a1-6f91b8da62c1

## Features
- **Classification:** Categorizes skin lesion images using a deep learning model.
- **Explainability:** Generates Grad-CAM heatmaps to show exactly which parts of the image the AI is looking at.
- **Fast UI:** A clean, professional dashboard built with React and Vite.

## Model Architecture:
- Convolutional layers with `ReLU` activation for feature extraction
- `MaxPooling` for spatial downsampling
- `Dropout` to prevent overfitting
- Fully connected layers leading to a `sigmoid` output for binary classification

## Tech Stack
- **Backend:** Flask, TensorFlow, Keras, OpenCV
- **Frontend:** React, Vite, Framer Motion, Lucide Icons
- **Model:** Convolutional Neural Network (CNN) trained on thousands of labeled skin lesion images

## Setup & Running Locally

The easiest way to run this is directly from source. You'll need two terminals open.

### 1. Backend (Flask)
```bash
cd server
pip install -r requirements.txt
python app.py
```
The server will run on `http://localhost:5000`.

### 2. Frontend (React)
```bash
cd client
npm install
npm run dev
```
The UI will be available at `http://localhost:5173`.

or if you have docker

```bash
docker build -t oncovision:latest .
docker run -d -p 80:80 -p 5000:5000 oncovision:latest
```

## Dataset & Model
The model was trained on a dataset of skin images. You can find the raw data I used [here](https://drive.google.com/drive/folders/17CKcffTFqglyzb-2vB_uN_Y0j00d5rIf?usp=drive_link).

## Future Ideas
- Differentiating between specific cancer types (melanoma vs basal cell).
- Mobile optimization for easier photo taking.
- Improving the Grad-CAM resolution for better clinical insights.
