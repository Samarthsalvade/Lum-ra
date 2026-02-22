# Luméra - AI Skincare Analysis Platform

A full-stack web application for AI-powered skin type analysis with personalized skincare recommendations.

## 🚀 Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- React Router
- Axios
- Vite

### Backend
- Python + Flask
- Flask-JWT-Extended (Authentication)
- SQLAlchemy + SQLite
- Pillow (Image Processing)

## 📁 Project Structure
```
lumera/
├── backend/          # Flask API
├── frontend/         # React App
└── README.md
```

## 🔧 Setup Instructions

### Backend Setup

1. Navigate to backend:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
- Windows: `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run server:
```bash
python app.py
```

Backend runs at: `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

## 🎯 Features

- ✅ User Authentication (Register/Login)
- ✅ Image Upload & Analysis
- ✅ Skin Type Detection (Dummy AI)
- ✅ Confidence Score Display
- ✅ Personalized Recommendations
- ✅ Analysis History
- ✅ Responsive Design
- ✅ Protected Routes

## 🔐 Demo Credentials

Email: `test@example.com`  
Password: `password123`

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Analysis
- `POST /api/analysis/upload` - Upload image for analysis
- `GET /api/analysis/history` - Get user's analysis history
- `GET /api/analysis/result/:id` - Get specific analysis
- `GET /api/analysis/uploads/:filename` - Get uploaded image

## 🤖 ML Model

Currently uses a dummy ML model that simulates skin analysis. The architecture supports easy integration of real ML models (TensorFlow/PyTorch).

## 📦 Database

SQLite database stores:
- Users (id, email, username, password_hash)
- Analyses (id, user_id, image_path, skin_type, confidence, recommendations)

## 🎨 UI Features

- Modern gradient design
- Loading states
- Error handling
- Image preview
- Progress bars
- Responsive layout

## 🔮 Future Enhancements

- Real ML model integration
- More skin metrics
- Product recommendations
- Social features
- Mobile app

## 📄 License

MIT License

## 👨‍💻 Developer

Built with ❤️ using Flask & React


conda deactivate
source venv/bin/activate
cd lumera/backend
python app.py

conda deactivate
source venv/bin/activate
cd lumera/frontend
npm run dev