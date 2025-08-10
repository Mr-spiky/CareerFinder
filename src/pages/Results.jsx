import { useLocation } from 'react-router-dom';
import { FiArrowRight, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Results = () => {
  const { state } = useLocation();
  const careers = state?.careers || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Your Career Matches
          </h1>
          <p className="text-xl text-gray-600">
            Based on your skills, interests and preferences
          </p>
        </div>

        {careers.length > 0 ? (
          <div className="space-y-6">
            {careers.map((career, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <h2 className="text-2xl font-bold mr-3">{career.title}</h2>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {career.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{career.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {career.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2 min-w-[200px]">
                    <div className="flex items-center text-gray-700">
                      <FiDollarSign className="mr-2" />
                      <span>{career.salaryRange}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FiTrendingUp className="mr-2" />
                      <span>Growth: {career.growth}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Link 
                    to="/form" 
                    className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Retake assessment <FiArrowRight className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <h3 className="text-xl font-medium mb-4">No career matches found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your skills and preferences for better results
            </p>
            <Link
              to="/form"
              className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Retake Assessment
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;