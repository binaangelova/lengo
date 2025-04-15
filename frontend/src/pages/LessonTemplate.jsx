import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/Navbar';
import { useAuth } from '../AuthContext';

const LessonTemplate = () => {
  const { levelId, lessonName } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchLesson = async () => {
      try {
        const response = await fetch(`https://lengo-vz4i.onrender.com/lessons/${levelId}/${lessonName}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'x-csrf-token': localStorage.getItem('csrfToken')
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch lesson');
        }
        
        const data = await response.json();
        setLesson(data);
      } catch (error) {
        console.error('Error fetching lesson:', error);
      }
    };

    fetchLesson();
  }, [levelId, lessonName, isAuthenticated, navigate]);

  const handleAnswerChange = (questionIndex, selectedOption) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = selectedOption;
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    // Validate that all questions are answered
    const unansweredQuestions = selectedAnswers.reduce((acc, answer, index) => {
      if (!answer) acc.push(index + 1);
      return acc;
    }, []);

    if (unansweredQuestions.length > 0) {
      alert(`Моля, отговорете на следните въпроси: ${unansweredQuestions.join(', ')}`);
      return;
    }

    try {
      const response = await fetch('https://lengo-vz4i.onrender.com/submitTestResults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'x-csrf-token': localStorage.getItem('csrfToken')
        },
        body: JSON.stringify({
          lessonId: lesson._id,
          answers: selectedAnswers
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit test');
      }

      const result = await response.json();
      setIsModalOpen(false);
      navigate(`/test-results/${result._id}`, {
        state: {
          lessonName: lesson.name,
          questions: lesson.test.questions,
          selectedAnswers,
          correctAnswers: lesson.test.questions.map(q => q.correctAnswer)
        }
      });
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Възникна грешка при изпращане на теста. Моля, опитайте отново.');
    }
  };

  // Закриване на теста при клик извън него
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  if (!lesson) return <div>Зареждам...</div>;

  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex-grow flex flex-col items-center pt-10">
        <div className="text-center p-8">
          <h1 className="text-5xl font-bold mb-2 text-blue-900">{lesson.name}</h1>
          <p className="text-xl mb-0 pt-2">Ниво: {lesson.level}</p>
        </div>

        {/* Vocabulary Section */}
        <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-xl mt-6">
          <h2 className="text-3xl font-semibold text-blue-800 mt-4 mb-2">Лексика</h2>
          <ul className="list-disc list-inside">
            {lesson.vocabulary && lesson.vocabulary.length > 0 ? (
              lesson.vocabulary.map((word, index) => (
                <li key={index} className="text-lg mb-2">
                  <strong>{word.bulgarian}</strong> - {word.english}
                </li>
              ))
            ) : (
              <p>Няма лексика за този урок.</p>
            )}
          </ul>
        </div>

        {/* Grammar Section */}
        <div className="w-full max-w-3xl mx-auto p-4 bg-white rounded-xl shadow-xl mt-8">
          <h2 className="text-3xl font-semibold text-blue-800 mt-4 mb-2">Граматика</h2>
          <p className="text-lg">{lesson.grammar || 'Няма граматика за този урок.'}</p>
        </div>

        {/* Test Section */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded-xl text-md font-semibold mt-6 hover:bg-blue-800 transition duration-200"
        >
          Направи теста
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div
              ref={modalRef}
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                Тест: {lesson.test.name}
              </h2>
              {lesson.test.questions.map((q, index) => (
                <div key={index} className="mb-6">
                  <label className="block text-xl font-semibold text-blue-900">
                    Въпрос {index + 1}
                  </label>
                  <p className="mb-4">{q.question}</p>
                  <label className="block text-xl font-semibold text-blue-900">
                    Опции
                  </label>
                  {q.options.map((option, i) => (
                    <div key={i} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={selectedAnswers[index] === option}
                        onChange={() => handleAnswerChange(index, option)}
                        className="mr-2"
                      />
                      <p className="flex-1">{option}</p>
                    </div>
                  ))}
                </div>
              ))}
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white py-2 px-4 rounded-xl text-md font-semibold mt-6 hover:bg-blue-800 transition duration-200"
              >
                Изпрати теста
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonTemplate;
