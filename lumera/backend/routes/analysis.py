from flask import Blueprint, request, jsonify, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from models import db, Analysis, User
from services.ml_service import analyze_skin
from utils.helpers import allowed_file
import os
import json

analysis_bp = Blueprint('analysis', __name__)

@analysis_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_image():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only PNG, JPG, JPEG allowed'}), 400
        
        filename = secure_filename(f"{user_id}_{int(os.path.getmtime('.'))}_{file.filename}")
        upload_folder = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        
        result = analyze_skin(filepath)
        
        analysis = Analysis(
            user_id=user_id,
            image_path=filename,
            skin_type=result['skin_type'],
            confidence=result['confidence'],
            recommendations=json.dumps(result['recommendations'])
        )
        
        db.session.add(analysis)
        db.session.commit()
        
        return jsonify({
            'message': 'Analysis completed successfully',
            'analysis': analysis.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@analysis_bp.route('/history', methods=['GET'])
@jwt_required()
def get_analysis_history():
    try:
        user_id = get_jwt_identity()
        analyses = Analysis.query.filter_by(user_id=user_id).order_by(Analysis.created_at.desc()).all()
        
        return jsonify({
            'analyses': [analysis.to_dict() for analysis in analyses]
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analysis_bp.route('/result/<int:analysis_id>', methods=['GET'])
@jwt_required()
def get_analysis_result(analysis_id):
    try:
        user_id = get_jwt_identity()
        analysis = Analysis.query.filter_by(id=analysis_id, user_id=user_id).first()
        
        if not analysis:
            return jsonify({'error': 'Analysis not found'}), 404
        
        return jsonify({'analysis': analysis.to_dict()}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analysis_bp.route('/uploads/<filename>', methods=['GET'])
@jwt_required()
def get_uploaded_image(filename):
    try:
        upload_folder = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
        return send_from_directory(upload_folder, filename)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 404