import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CareerForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    skills: [],
    interests: [],
    workStyle: "",
    experience: "",
    goals: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const questions = [
    {
      id: 1,
      title: "Your Technical Skills",
      type: "multi-select",
      options: [
        "JavaScript", "Python", "React", "Node.js", 
        "Machine Learning", "Data Analysis", "SQL",
        "HTML/CSS", "Java", "C++"
      ],
      field: "skills"
    },
    {
      id: 2,
      title: "Your Professional Interests",
      type: "multi-select",
      options: [
        "Web Development", "Mobile Development", "Data Science",
        "Artificial Intelligence", "Cloud Computing", "Cybersecurity",
        "UI/UX Design", "Project Management", "DevOps"
      ],
      field: "interests"
    },
    {
      id: 3,
      title: "Preferred Work Environment",
      type: "single-select",
      options: ["Fully Remote", "Office-Based", "Hybrid Flexible", "Freelance"],
      field: "workStyle"
    },
    {
      id: 4,
      title: "Years of Professional Experience",
      type: "single-select",
      options: [
        "0-1 years (Entry-level)",
        "2-5 years (Mid-level)",
        "5-10 years (Experienced)",
        "10+ years (Senior)"
      ],
      field: "experience"
    },
    {
      id: 5,
      title: "Your Career Aspirations",
      type: "text",
      placeholder: "Describe your long-term career goals and what you hope to achieve...",
      field: "goals"
    }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: Array.isArray(prev[field]) 
        ? prev[field].includes(value)
          ? prev[field].filter(item => item !== value)
          : [...prev[field], value]
        : value
    }));
  };

  // Function to convert experience string to a number
  const convertExperienceToNumber = (experienceString) => {
    if (!experienceString) return 0;
    
    // Extract numbers from the string
    const matches = experienceString.match(/\d+/g);
    if (!matches) return 0;
    
    // For ranges like "0-1", take the average
    if (matches.length >= 2) {
      const min = parseInt(matches[0]);
      const max = parseInt(matches[1]);
      return Math.round((min + max) / 2);
    }
    
    // For single numbers or "10+"
    if (experienceString.includes('+')) {
      return parseInt(matches[0]) + 2; // Add some buffer for "10+"
    }
    
    return parseInt(matches[0]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert experience to a proper number
      const experienceNumber = convertExperienceToNumber(formData.experience);
      
      console.log("Sending data:", {
        skills: formData.skills,
        experience: experienceNumber,
        education: "Bachelor"
      });

      const response = await fetch('http://localhost:3001/api/predict', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          skills: formData.skills,
          experience: experienceNumber, // Send as number, not string
          education: "Bachelor"
        })
      });

      // Check if response is OK
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);
      
      if (!result.prediction) {
        throw new Error("No prediction returned from server");
      }

      navigate("/result", { state: result });
    } catch (err) {
      setError(err.message);
      console.error("Submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestion = questions[step - 1];
  const isNextDisabled = 
    (!formData[currentQuestion.field] || 
     (Array.isArray(formData[currentQuestion.field]) && 
      formData[currentQuestion.field].length === 0));

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-2">
          Career Path Finder
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Answer a few questions to discover your ideal career path
        </p>
        
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-500">
            Step {step} of {questions.length}
          </span>
          <span className="text-sm font-medium text-indigo-600">
            {Math.round((step / questions.length) * 100)}% Complete
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${(step / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {currentQuestion.title}
        </h3>
        
        {currentQuestion.type === "multi-select" && (
          <div className="grid gap-2">
            {currentQuestion.options.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => handleChange(currentQuestion.field, option)}
                className={`p-3 rounded-lg border transition-all ${
                  formData[currentQuestion.field].includes(option)
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'border-gray-200 hover:border-indigo-300 bg-white'
                }`}
              >
                <div className="flex items-center">
                  <span className={`inline-block w-5 h-5 mr-3 rounded border ${
                    formData[currentQuestion.field].includes(option)
                      ? 'bg-indigo-500 border-indigo-500'
                      : 'bg-white border-gray-300'
                  }`}>
                    {formData[currentQuestion.field].includes(option) && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === "single-select" && (
          <div className="grid gap-2">
            {currentQuestion.options.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => handleChange(currentQuestion.field, option)}
                className={`p-3 rounded-lg border transition-all text-left ${
                  formData[currentQuestion.field] === option
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'border-gray-200 hover:border-indigo-300 bg-white'
                }`}
              >
                <div className="flex items-center">
                  <span className={`inline-block w-5 h-5 mr-3 rounded-full border ${
                    formData[currentQuestion.field] === option
                      ? 'bg-indigo-500 border-indigo-500'
                      : 'bg-white border-gray-300'
                  }`}></span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === "text" && (
          <textarea
            value={formData[currentQuestion.field]}
            onChange={(e) => handleChange(currentQuestion.field, e.target.value)}
            placeholder={currentQuestion.placeholder}
            rows={5}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        )}
      </div>

      <div className="flex justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-6 py-2 text-indigo-600 font-medium rounded-lg border border-indigo-600 hover:bg-indigo-50 transition"
          >
            Previous
          </button>
        ) : (
          <div></div> // Empty div to maintain space
        )}
        
        {step < questions.length ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={isNextDisabled}
            className={`px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition ${
              isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || isNextDisabled}
            className={`px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition ${
              isLoading || isNextDisabled ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              'Get Career Recommendation'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CareerForm;