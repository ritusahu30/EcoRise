import os
import warnings
import sys
import json
import zipfile
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from sklearn.model_selection import train_test_split
from PIL import Image
import tensorflow as tf
from tensorflow import keras

warnings.filterwarnings('ignore')

def check_dependencies():
    required_packages = {
        'tensorflow': '2.17.0',
        'numpy': None,
        'matplotlib': None,
        'seaborn': None,
        'pandas': None,
        'scikit-learn': None,
        'Pillow': None
    }
    
    missing_packages = []
    for package, version in required_packages.items():
        try:
            __import__(package)
            if version:
                import pkg_resources
                installed_version = pkg_resources.get_distribution(package).version
                if installed_version != version:
                    print(f"Warning: {package} version {installed_version} is installed, but version {version} is required")
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("Missing required packages. Please install:")
        for package in missing_packages:
            ver = f"=={required_packages[package]}" if required_packages[package] else ""
            print(f"pip install {package}{ver}")
        sys.exit(1)

# Check dependencies before importing
check_dependencies()

class WasteClassificationModel:
    def __init__(self, img_height=224, img_width=224):
        print("Initializing model...")
        self.img_height = img_height
        self.img_width = img_width
        self.model = None
        self.history = None
        self.class_names = None
        
        # Print GPU availability
        if tf.config.list_physical_devices('GPU'):
            print("GPU is available for training")
        else:
            print("No GPU found, using CPU for training")
        
    def load_and_preprocess_data(self, data_path):
        """Load and preprocess images from zip file or directory"""
        print("Loading and preprocessing data...")
        
        # Handle both zip files and directories
        if data_path.endswith('.zip'):
            if not os.path.exists(data_path):
                raise FileNotFoundError(f"Dataset zip file not found at {data_path}")
            
            # Extract zip file
            with zipfile.ZipFile(data_path, 'r') as zip_ref:
                zip_ref.extractall('dataset')
            data_dir = 'dataset'
        else:
            data_dir = data_path
            
        if not os.path.exists(data_dir):
            raise FileNotFoundError(f"Dataset directory not found at {data_dir}")
            
        # Get class names
        self.class_names = [d for d in os.listdir(data_dir) 
                          if os.path.isdir(os.path.join(data_dir, d))]
        print(f"Found {len(self.class_names)} classes: {self.class_names}")
        
        images = []
        labels = []
        
        # Load images and labels in chunks to manage memory
        total_images = sum(len(os.listdir(os.path.join(data_dir, class_name))) 
                          for class_name in self.class_names)
        processed_images = 0
        chunk_size = 100  # Define chunk size for loading images
        
        for class_idx, class_name in enumerate(self.class_names):
            class_dir = os.path.join(data_dir, class_name)
            print(f"\nProcessing class: {class_name}")
            
            image_files = os.listdir(class_dir)
            for i in range(0, len(image_files), chunk_size):
                chunk_files = image_files[i:i + chunk_size]
                for img_name in chunk_files:
                    img_path = os.path.join(class_dir, img_name)
                    try:
                        # Load and preprocess image
                        img = Image.open(img_path).convert('RGB')
                        img = img.resize((self.img_height, self.img_width))
                        img_array = tf.keras.preprocessing.image.img_to_array(img)
                        img_array = img_array / 255.0  # Normalize pixel values
                        
                        images.append(img_array)
                        labels.append(class_idx)
                        
                        # Update progress
                        processed_images += 1
                        if processed_images % 100 == 0:
                            print(f"Progress: {processed_images}/{total_images} images processed")
                            
                    except Exception as e:
                        print(f"Error processing image {img_path}: {e}")
                        continue
                
                # Clear the lists to free memory after processing each chunk
                images.clear()
                labels.clear()
        
        # Convert to numpy arrays
        X