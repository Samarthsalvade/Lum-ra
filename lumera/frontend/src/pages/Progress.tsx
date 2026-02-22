import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Analysis } from '../types';

interface ProgressData {
  date: string;
  skinType: string;
  confidence: number;
}

const Progress = () => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await api.get('/analysis/history');
      const data = response.data.analyses;
      setAnalyses(data);
      
      // Transform data for progress tracking
      const progress = data.map((analysis: Analysis) => ({
        date: new Date(analysis.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        skinType: analysis.skin_type,
        confidence: analysis.confidence
      })).reverse(); // Oldest first
      
      setProgressData(progress);
    } catch (error) {
      console.error('Failed to fetch analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSkinTypeColor = (skinType: string) => {
    const colors: { [key: string]: string } = {
      'Normal': 'bg-green-100 text-green-800',
      'Oily': 'bg-blue-100 text-blue-800',
      'Dry': 'bg-orange-100 text-orange-800',
      'Combination': 'bg-purple-100 text-purple-800',
      'Sensitive': 'bg-red-100 text-red-800'
    };
    return colors[skinType] || 'bg-gray-100 text-gray-800';
  };

  const calculateAverage = () => {
    if (analyses.length === 0) return 0;
    const sum = analyses.reduce((acc, curr) => acc + curr.confidence, 0);
    return (sum / analyses.length).toFixed(1);
  };

  const getMostCommonSkinType = () => {
    if (analyses.length === 0) return 'N/A';
    
    const counts: { [key: string]: number } = {};
    analyses.forEach(analysis => {
      counts[analysis.skin_type] = (counts[analysis.skin_type] || 0) + 1;
    });
    
    return Object.keys(counts).reduce((a, b) => 
      counts[a] > counts[b] ? a : b
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-purple-600 hover:underline mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Progress Tracker</h1>
          <p className="text-gray-600">
            Monitor your skin health journey over time
          </p>
        </div>

        {analyses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              No analysis data yet. Start tracking your progress!
            </p>
            <Link
              to="/upload"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Create First Analysis
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Scans</p>
                    <p className="text-3xl font-bold text-purple-600 mt-1">
                      {analyses.length}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Avg Confidence</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">
                      {calculateAverage()}%
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Primary Type</p>
                    <p className="text-2xl font-bold text-indigo-600 mt-1">
                      {getMostCommonSkinType()}
                    </p>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Analysis Timeline</h2>
              
              {/* Visual Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Confidence Trend</span>
                  <span className="text-sm font-medium text-purple-600">
                    Latest: {analyses[0]?.confidence}%
                  </span>
                </div>
                <div className="flex space-x-1 h-20 items-end">
                  {progressData.map((data, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t transition-all hover:from-purple-700 hover:to-purple-500 relative group"
                      style={{ height: `${data.confidence}%` }}
                    >
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        {data.date}: {data.confidence}%
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {progressData[0]?.date}
                  </span>
                  <span className="text-xs text-gray-500">
                    {progressData[progressData.length - 1]?.date}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed History Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Detailed History</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Skin Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Confidence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analyses.map((analysis) => (
                      <tr key={analysis.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(analysis.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSkinTypeColor(analysis.skin_type)}`}>
                            {analysis.skin_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${analysis.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{analysis.confidence}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            to={`/results/${analysis.id}`}
                            className="text-purple-600 hover:text-purple-800 font-medium"
                          >
                            View Details →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Progress;