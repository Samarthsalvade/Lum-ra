import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
import json

def create_skin_type_model():
    """
    Create a skin type classification model using transfer learning
    """
    # Use MobileNetV2 as base (lightweight and efficient)
    base_model = MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze the base model
    base_model.trainable = False
    
    # Create the model
    model = keras.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.3),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(128, activation='relu'),
        layers.Dense(5, activation='softmax')  # 5 skin types
    ])
    
    # Compile the model
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def train_model_with_data(data_dir, epochs=20):
    """
    Train the model with actual data
    
    Expected directory structure:
    data_dir/
        normal/
        oily/
        dry/
        combination/
        sensitive/
    """
    # Data augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        validation_split=0.2
    )
    
    train_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical',
        subset='training'
    )
    
    val_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical',
        subset='validation'
    )
    
    # Create model
    model = create_skin_type_model()
    
    # Train
    history = model.fit(
        train_generator,
        epochs=epochs,
        validation_data=val_generator
    )
    
    # Save the model
    model.save('backend/ml_model/skin_type_model.h5')
    
    # Save class indices
    class_indices = train_generator.class_indices
    with open('backend/ml_model/class_indices.json', 'w') as f:
        json.dump(class_indices, f)
    
    return model, history

if __name__ == '__main__':
    # For training with your own data
    # train_model_with_data('path/to/your/dataset', epochs=20)
    
    # For now, just create and save the architecture
    model = create_skin_type_model()
    model.save('backend/ml_model/skin_type_model.h5')
    print("Model architecture saved!")