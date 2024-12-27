# OncoVision: Skin Cancer Classification Using Deep Learning

## Project Overview:

OncoVision, combining "oncology" (cancer) and "vision" (image classification), was created to help individuals easily assess skin lesions from home. Inspired by the personal experiences of family and friends affected by skin cancer, this project aims to support early detection.

The idea is for individuals to evaluate potential risks and seek professional advice, contributing to better outcomes through early diagnosis.

#### Achieves ~91% accuracy in classifying skin lesions as benign or malignant.

## Technologies 🔧:

- **TensorFlow/Keras** for building and training the CNN model.
- **Python** libraries such as NumPy, and Seaborn for image handling
- **Sklearn** for metrics including confusion matrix and train-test splits
- **Matplotlib** for creating visualizations like training/validation accuracy and loss curves, as well as confusion matrices.

## Dataset 📊:

The dataset includes images of benign and malignant skin lesions, which are preprocessed to ensure uniformity.

**All images can be found here:**
https://drive.google.com/drive/folders/17CKcffTFqglyzb-2vB_uN_Y0j00d5rIf?usp=drive_link

## Model Structure 🏗️:

- Convolutional layers with ReLU activation for feature extraction.
- MaxPooling layers for downsampling.
- Fully connected layers for classification.
- Dropout layer to prevent overfitting.
- Sigmoid output layer for binary classification.

## Future Work 🔮:

- Furthur tweak the accuracy of the model
- Implement a user-friendly UI that will allow users to upload their own images
- Use a more extensive dataset
- Differentiate between different types of skin cancer (melanoma, basal cell carcinoma, and squamous cell carcinoma)

## Lessons Learned:

This project builds upon my experiences during **uOttahack** (Canada's capital hackathon), where I initially tried to create a machine learning model for reading cursive handwriting. Although the model didn't perform well, I learned a lot about **TensorFlow**, **image preprocessing**, and the importance of data augmentation and CNNs. This project is a culmination of those lessons and has inspired me to continue working on machine learning models for healthcare challenges.

- **Image Preprocessing**: Learned to resize, normalize, and enhance images
- **CNNs**: Gained experience with CNNs to extract important features
- **Model Evaluation**: Learned to use metrics like accuracy and precision to check model performance
