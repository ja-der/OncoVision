# 🩺 OncoVision - Early Skin Cancer Detection with Deep Learning

## Demo:
> apologies, slow pc hence slow demo

https://github.com/user-attachments/assets/2537cbbd-7497-47cb-9dcb-b92030a183bc


OncoVision (from _oncology_ + _vision_) is a project I built to help people assess skin lesions safely from home using image classification.

This idea came from seeing close friends and family affected by skin cancer, and realizing how critical early detection can be.

My goal isn’t to replace a dermatologist, but to **empower individuals to identify potential risks early** and seek professional advice when needed.

## Project Overview:

OncoVision, combining "oncology" (cancer) and "vision" (image classification), was created to help individuals easily assess skin lesions from home. Inspired by the personal experiences of family and friends affected by skin cancer, this project aims to support early detection.

The idea is for individuals to evaluate potential risks and seek professional advice, contributing to better outcomes through early diagnosis.

> Currently achieves **~31% accuracy** in classifying skin lesions as **benign or malignant**.

## Technologies Used

- TensorFlow / Keras - for building and running the deep learning model (CNN)
- Flask - Python framework for serving the backend server + API
- React - for creating the user-friendly frontend interface
- Docker - for containerizing the application (frontend, backend, and Nginx)
- Nginx - for serving the frontend and reverse-proxying API requests to the backend.

## Dataset

The dataset contains labelled images of both **benign** and **malignant** skin lesions.  
Before training, all images were preprocessed (resized, normalized, and balanced)to ensure consistent input quality.

**Dataset link:**  
[Google Drive Folder](https://drive.google.com/drive/folders/17CKcffTFqglyzb-2vB_uN_Y0j00d5rIf?usp=drive_link)

## Model Architecture:

- Convolutional layers with **ReLU** activation for feature extraction
- **MaxPooling** for spatial downsampling
- **Dropout** to prevent overfitting
- Fully connected layers leading to a **sigmoid** output for binary classification

The model was trained on GPU (TensorFlow) with a focus on interpretability and balanced generalization.

## 🐳 Docker Containerization

OncoVision is fully containerized, making it easy to **run locally or deploy anywhere** without worrying about environment setup.

### Pre-Built Image

A pre-built container image is available on **GitHub Container Registry (GHCR)** (Available also in packages tab in this repo):

```bash
docker pull ghcr.io/ja-der/oncovision:1.2.6
```

### Run the App

Once pulled, simply run:

```bash
docker run -d -p 80:80 -p 5000:5000 ghcr.io/ja-der/oncovision:1.2.6
```

or whichever port mapping you prefer

Then open your browser at http://localhost:80
to access the application.

### Build Locally

Or if you prefer to build from source:

```bash
docker build -t oncovision:latest .
docker run -d -p 80:80 -p 5000:5000 oncovision:latest
```

> Note: Tensorflow is a resource-intensive library, which contributes to the larger size of the container.

## Future Work:

- Furthur tweak the accuracy of the model
- Differentiate between different types of skin cancer (melanoma, basal cell carcinoma, and squamous cell carcinoma)

## Lessons Learned

Working on OncoVision deepened my understanding of how **machine learning and software engineering** come together to create meaningful, real-world tools.

Instead of focusing solely on building models, I explored how to **design, package, and deploy** AI systems that can be easily used by others, from preprocessing data and training models to containerizing them for deployment.

Through this project, I learned to:

- **Preprocess and standardize images** for reliable model input
- **Build and refine CNNs** for robust, generalizable performance
- **Integrate ML** into production-ready web applications using Python and Docker
- **Evaluate and interpret models** through metrics like confusion matrices
