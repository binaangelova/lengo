import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

const AdminTestResults = () => {
  const navigate = useNavigate();
  const { testResultId } = useParams();
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`https://lengo-vz4i.onrender.com/getTestResult/${testResultId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch test results");
        }
        const data = await response.json();
        setTestResults(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchResults();
  }, [testResultId]);

  if (!testResults) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex-grow flex flex-col items-center pt-16">
        <h1 className="text-4xl font-bold text-blue-900 drop-shadow-xl">{testResults.lessonName}</h1>
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
                Отговор на потребителя: {testResults.selectedAnswers[index] || "Няма отговор"}
              </p>
              <p className="text-lg text-blue-800">Правилен отговор: {testResults.correctAnswers[index]}</p>
            </div>
          ))}
        </div>
        <div className="flex space-x-4 mt-8">
          <button
            onClick={() => navigate("/admin/users")}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow-xl text-md font-semibold hover:bg-blue-800 transition duration-200"
          >
            Назад към списъка с потребители
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTestResults;
