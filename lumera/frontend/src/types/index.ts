export interface User {
    id: number;
    email: string;
    username: string;
    created_at: string;
  }
  
  export interface Analysis {
    id: number;
    user_id: number;
    image_path: string;
    skin_type: string;
    confidence: number;
    recommendations: string;
    created_at: string;
  }
  
  export interface AuthResponse {
    message: string;
    access_token: string;
    user: User;
  }
  
  export interface AnalysisResponse {
    message: string;
    analysis: Analysis;
  }