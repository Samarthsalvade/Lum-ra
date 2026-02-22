'''import random
from PIL import Image

def analyze_skin(image_path):
    """
    Dummy ML service that simulates skin analysis.
    Replace this with a real ML model later.
    """
    try:
        img = Image.open(image_path)
        img.verify()
        
        skin_types = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive']
        skin_type = random.choice(skin_types)
        confidence = round(random.uniform(75, 98), 2)
        
        recommendations_map = {
            'Normal': [
                'Use a gentle cleanser twice daily',
                'Apply a lightweight moisturizer with SPF 30+'
            ],
            'Oily': [
                'Use oil-free, non-comedogenic products',
                'Try salicylic acid-based cleansers to control sebum'
            ],
            'Dry': [
                'Use a rich, hydrating moisturizer with hyaluronic acid',
                'Avoid harsh soaps and hot water'
            ],
            'Combination': [
                'Use different products for T-zone and cheeks',
                'Balance with a gentle pH-balanced cleanser'
            ],
            'Sensitive': [
                'Choose fragrance-free, hypoallergenic products',
                'Patch test new products before full application'
            ]
        }
        
        return {
            'skin_type': skin_type,
            'confidence': confidence,
            'recommendations': recommendations_map.get(skin_type, [])
        }
    
    except Exception as e:
        raise Exception(f"Image analysis failed: {str(e)}")'''
        
import numpy as np
from PIL import Image
import cv2
import os
import tensorflow as tf
from tensorflow import keras

class SkinAnalyzer:
    def __init__(self):
        self.model = None
        self.skin_types = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive']
        self.model_path = os.path.join(os.path.dirname(__file__), '../ml_model/skin_type_model.h5')
        self.load_model()
    
    def load_model(self):
        """Load the pre-trained model"""
        try:
            if os.path.exists(self.model_path):
                self.model = keras.models.load_model(self.model_path)
                print("✓ ML Model loaded successfully")
            else:
                print("⚠ Model file not found. Using feature-based analysis.")
                self.model = None
        except Exception as e:
            print(f"⚠ Error loading model: {e}. Using feature-based analysis.")
            self.model = None
    
    def preprocess_image(self, image_path):
        """Preprocess image for model input"""
        try:
            # Read image
            img = Image.open(image_path).convert('RGB')
            
            # Resize to model input size
            img = img.resize((224, 224))
            
            # Convert to numpy array
            img_array = np.array(img)
            
            # Normalize pixel values
            img_array = img_array / 255.0
            
            # Add batch dimension
            img_array = np.expand_dims(img_array, axis=0)
            
            return img_array
        except Exception as e:
            raise Exception(f"Image preprocessing failed: {str(e)}")
    
    def extract_skin_features(self, image_path):
        """
        Extract skin features using computer vision
        This is used when the ML model is not available
        """
        try:
            # Read image
            img = cv2.imread(image_path)
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            
            # Convert to HSV for better color analysis
            img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            
            # Detect face region (simplified - you can use face detection here)
            height, width = img.shape[:2]
            center_region = img_rgb[
                int(height*0.3):int(height*0.7),
                int(width*0.3):int(width*0.7)
            ]
            
            # Calculate average brightness
            brightness = np.mean(center_region)
            
            # Calculate color variance (indicates oiliness/shine)
            variance = np.var(center_region)
            
            # Calculate saturation (redness/sensitivity indicator)
            saturation = np.mean(img_hsv[:, :, 1])
            
            return {
                'brightness': float(brightness),
                'variance': float(variance),
                'saturation': float(saturation)
            }
        except Exception as e:
            raise Exception(f"Feature extraction failed: {str(e)}")
    
    def classify_by_features(self, features):
        """
        Classify skin type based on extracted features
        This is a rule-based fallback when ML model is unavailable
        """
        brightness = features['brightness']
        variance = features['variance']
        saturation = features['saturation']
        
        # Simple rule-based classification
        if variance > 1500:
            skin_type = 'Oily'
            confidence = min(75 + (variance - 1500) / 50, 95)
        elif brightness < 100:
            skin_type = 'Dry'
            confidence = min(70 + (100 - brightness) / 2, 93)
        elif saturation > 100:
            skin_type = 'Sensitive'
            confidence = min(72 + (saturation - 100) / 3, 92)
        elif variance > 800 and brightness > 120:
            skin_type = 'Combination'
            confidence = min(78 + variance / 100, 94)
        else:
            skin_type = 'Normal'
            confidence = min(80 + brightness / 10, 96)
        
        return skin_type, round(confidence, 2)
    
    def get_recommendations(self, skin_type):
        """Get personalized recommendations based on skin type"""
        recommendations_map = {
            'Normal': [
                'Maintain your routine with a gentle cleanser twice daily',
                'Use a lightweight moisturizer with SPF 30+ during the day',
                'Incorporate antioxidant serums like Vitamin C for protection'
            ],
            'Oily': [
                'Use oil-free, non-comedogenic products to prevent clogged pores',
                'Try salicylic acid cleansers to control excess sebum production',
                'Apply a mattifying moisturizer and use blotting papers throughout the day',
                'Consider niacinamide serums to regulate oil production'
            ],
            'Dry': [
                'Use a rich, hydrating moisturizer with hyaluronic acid or ceramides',
                'Avoid harsh soaps and hot water that strip natural oils',
                'Apply a nourishing night cream before bed',
                'Use a gentle, creamy cleanser instead of foaming formulas'
            ],
            'Combination': [
                'Use different products for T-zone and cheek areas if needed',
                'Balance with a pH-balanced cleanser suitable for all areas',
                'Try lightweight gel moisturizers that won\'t clog pores',
                'Use targeted treatments: mattifying for oily areas, hydrating for dry patches'
            ],
            'Sensitive': [
                'Choose fragrance-free, hypoallergenic products designed for sensitive skin',
                'Patch test all new products before full application',
                'Avoid harsh exfoliants and use gentle, soothing ingredients like aloe vera',
                'Look for products with centella asiatica or colloidal oatmeal to calm irritation'
            ]
        }
        
        return recommendations_map.get(skin_type, recommendations_map['Normal'])[:2]
    
    def analyze(self, image_path):
        """
        Main analysis function
        Returns skin type, confidence, and recommendations
        """
        try:
            if self.model is not None:
                # Use ML model for prediction
                img_array = self.preprocess_image(image_path)
                predictions = self.model.predict(img_array, verbose=0)
                
                # Get predicted class and confidence
                predicted_class = np.argmax(predictions[0])
                confidence = float(predictions[0][predicted_class] * 100)
                skin_type = self.skin_types[predicted_class]
                
                print(f"ML Model prediction: {skin_type} ({confidence:.2f}%)")
            else:
                # Fallback to feature-based analysis
                features = self.extract_skin_features(image_path)
                skin_type, confidence = self.classify_by_features(features)
                
                print(f"Feature-based prediction: {skin_type} ({confidence:.2f}%)")
            
            # Get recommendations
            recommendations = self.get_recommendations(skin_type)
            
            return {
                'skin_type': skin_type,
                'confidence': round(confidence, 2),
                'recommendations': recommendations
            }
        
        except Exception as e:
            raise Exception(f"Analysis failed: {str(e)}")


# Global analyzer instance
_analyzer = None

def get_analyzer():
    """Get or create the global analyzer instance"""
    global _analyzer
    if _analyzer is None:
        _analyzer = SkinAnalyzer()
    return _analyzer

def analyze_skin(image_path):
    """
    Main function called by the API
    """
    analyzer = get_analyzer()
    return analyzer.analyze(image_path)