import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

const TestResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { testResultId } = useParams();
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResults = async () => {
    try {
      const response = await fetch(`https://lengo-vz4i.onrender.com/getTestResult/${testResultId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'x-csrf-token': localStorage.getItem('csrfToken')
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch test results');
      }
      
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      console.error(error);
      setError('Грешка при зареждане на резултатите от теста.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [testResultId]);

  if (isLoading) {
    return (
      <div className="bg-blue-100 min-h-screen flex flex-col items-center justify-center">
        <div className="text-2xl text-blue-900">Зареждане...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-blue-100 min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
        <button
          onClick={() => navigate("/lessons")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl shadow-xl text-md font-semibold hover:bg-blue-800 transition duration-200"
        >
          Към уроците
        </button>
      </div>
    );
  }

  if (!testResults) {
    return (
      <div className="bg-blue-100 min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl text-red-600">Не са намерени резултати.</div>
        <button
          onClick={() => navigate("/lessons")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl shadow-xl text-md font-semibold hover:bg-blue-800 transition duration-200"
        >
          Към уроците
        </button>
      </div>
    );
  }

  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col items-center pt-16">
        <h1 className="text-4xl font-bold text-blue-900 drop-shadow-xl">{testResults.lessonName} - Резултати</h1>
        <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-xl mt-12">
          {testResults.questions.map((q, index) => (
            <div key={index} className="mb-6">
              <p className="text-lg font-semibold">{q.question}</p>
              <p
                className={`text-lg ${
                  testResults.selectedAnswers[index] === testResults.correctAnswers[index]
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Вашият отговор: {testResults.selectedAnswers[index] || "Няма отговор"}
              </p>
              <p className="text-lg text-blue-800">
                Правилен отговор: {testResults.correctAnswers[index]}
              </p>
            </div>
          ))}
        </div>
        <div className="flex space-x-4 mt-8">
          <button
            onClick={() => navigate("/lessons")}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl shatow-xl text-md font-semibold hover:bg-blue-800 transition duration-200"
          >
            Излез от теста
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
