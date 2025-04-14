import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';  // Импортиране на Link
import AdminNavbar from '../components/AdminNavbar';

const AdminLessonTemplate = () => {
  const { levelId, lessonName } = useParams();
  const [lesson, setLesson] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchLesson = async () => {
      const response = await fetch(`https://lengo-vz4i.onrender.com/lessons/${levelId}/${lessonName}`);
      const data = await response.json();
      setLesson(data); 
    };

    fetchLesson();
  }, [levelId, lessonName]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!lesson) return <div>Зареждам...</div>;

  const handleAnswerChange = (questionIndex, selectedOption) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = selectedOption;
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    console.log('Test submitted with answers:', selectedAnswers);
  };

  const findDuplicates = (vocabulary) => {
    const wordCount = {};
    vocabulary.forEach((word) => {
      wordCount[word.english] = (wordCount[word.english] || 0) + 1;
    });
    return vocabulary.filter((word) => wordCount[word.english] > 1);
  };

  const handleDelete = async () => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете този урок?')) {
      try {
        const response = await fetch(`https://lengo-vz4i.onrender.com/lessons/${lesson._id}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          alert('Урокът беше изтрит успешно!');
          window.location.href = '/admin'; // Redirect after deletion
        } else {
          alert('Грешка при изтриване на урока.');
        }
      } catch (error) {
        console.error('Error deleting lesson:', error);
        alert('Сървърна грешка. Опитайте отново.');
      }
    }
  };
  

  const duplicateWords = findDuplicates(lesson.vocabulary || []);

  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex-grow flex flex-col items-center pt-10">
        <div className="text-center p-8">
          <h1 className="text-5xl font-bold mb-2 text-blue-900 drop-shadow-lg text-center">{lesson.name}</h1>
          <p className="text-xl mb-0 pt-2">Ниво: {lesson.level}</p>
        </div>

        {/* Moved Delete and Edit Buttons to the Right */}
        <div className="absolute right-16 top-36 flex space-x-4"> {/* Positioned to the right under the navbar */}
          <Link to={`/admin/edit-lesson/${lesson._id}`} className="bg-blue-600 text-white px-6 py-2 text-md font-semibold rounded-xl hover:bg-blue-800 transition duration-200">
            Редактирай
          </Link>
          <button
            className="bg-red-600 text-white px-6 py-2 rounded-xl text-md font-semibold hover:bg-red-800 transition duration-200"
            onClick={handleDelete}
          >
            Изтрий
          </button>
        </div>

        {/* Vocabulary Section */}
        <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-xl mt-6">
          <h2 className="text-3xl font-semibold text-blue-800 mt-4 mb-2">Лексика</h2>
          <ul className="list-disc list-inside">
            {lesson.vocabulary && lesson.vocabulary.length > 0 ? (
              lesson.vocabulary.map((word, index) => {
                const isDuplicate = duplicateWords.some((duplicate) => duplicate.english === word.english);
                return (
                  <li key={index} className={`text-lg mb-2 ${isDuplicate ? 'text-red-500' : ''}`}>
                    <strong>{word.bulgarian}</strong> - {word.english}
                    {isDuplicate && <span className="text-sm text-red-600"> (повтаряща се)</span>}
                  </li>
                );
              })
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

export default AdminLessonTemplate;
