import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Analysis } from '../types';

const Results = () => {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      const response = await api.get(`/analysis/result/${id}`);
      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error('Failed to fetch analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Analysis not found</h2>
          <Link to="/dashboard" className="text-purple-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const recommendations = JSON.parse(analysis.recommendations);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-purple-600 hover:underline mb-6"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={`http://localhost:3001/api/analysis/uploads/${analysis.image_path}`}
                alt="Analyzed skin"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Analysis Results
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                {formatDate(analysis.created_at)}
              </p>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Skin Type</h3>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-purple-600">
                    {analysis.skin_type}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {analysis.confidence}% confidence
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${analysis.confidence}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Recommendations
                </h3>
                <ul className="space-y-3">
                  {recommendations.map((rec: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 bg-purple-50 p-3 rounded-lg"
                    >
                      <span className="text-purple-600 font-bold flex-shrink-0">
                        {index + 1}.
                      </span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/upload"
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition inline-block"
          >
            Create New Analysis
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Results;