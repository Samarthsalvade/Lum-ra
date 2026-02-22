import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome to Luméra
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover your skin type with AI-powered analysis. Get personalized
          skincare recommendations tailored just for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-purple-700 transition shadow-lg"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-white text-purple-600 px-8 py-3 rounded-lg text-lg hover:bg-gray-50 transition border-2 border-purple-600"
          >
            Login
          </Link>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">📸</div>
            <h3 className="text-xl font-semibold mb-2">Upload Photo</h3>
            <p className="text-gray-600">
              Take or upload a clear photo of your face
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
            <p className="text-gray-600">
              Our AI analyzes your skin type and condition
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="text-xl font-semibold mb-2">Get Recommendations</h3>
            <p className="text-gray-600">
              Receive personalized skincare advice
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;