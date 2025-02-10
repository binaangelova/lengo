import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

const TestResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { levelId, lessonName, questions, selectedAnswers, correctAnswers } =
    location.state || {};

  useEffect(() => {
    // Save the test results to the database when the test is finished
    if (selectedAnswers) {
      const saveTestResults = async () => {
        try {
          await axios.post('/test-results', {
            lessonId: lessonName, // Make sure to pass the appropriate lessonId
            answers: selectedAnswers,
          });
        } catch (error) {
          console.error('Error saving test results:', error);
        }
      };
      
      saveTestResults();
    }
  }, [selectedAnswers, lessonName]);

  if (!questions) {
    return <div className="text-center text-xl mt-10">Няма налични резултати.</div>;
  }

  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col items-center pt-16">
        <h1 className="text-4xl font-bold text-blue-900">{lessonName} - Резултати</h1>
        <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
          {questions.map((q, index) => (
            <div key={index} className="mb-6">
              <p className="text-lg font-semibold">{q.question}</p>
              <p
                className={`text-lg ${
                  selectedAnswers[index] === correctAnswers[index]
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Вашият отговор: {selectedAnswers[index] || "Няма отговор"}
              </p>
              <p className="text-lg text-blue-800">
                Правилен отговор: {correctAnswers[index]}
              </p>
            </div>
          ))}
        </div>
        <div className="flex space-x-4 mt-6">
          <button
            onClick={() => navigate("/lessons")}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Излез от теста
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
