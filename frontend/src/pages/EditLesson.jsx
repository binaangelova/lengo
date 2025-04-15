import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';

const EditLesson = () => {
  const { lessonId, levelId, lessonName } = useParams(); // Get the levelId, lessonId, and lessonName from the URL
  const [lessonNameInput, setLessonName] = useState('');
  const [level, setLevel] = useState(levelId || 'A1');
  const [vocabulary, setVocabulary] = useState([{ bulgarian: '', english: '' }]);
  const [grammar, setGrammar] = useState('');
  const [testId, setTestId] = useState(null);
  const [questions, setQuestions] = useState([]); // For managing test questions
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch the lesson data to populate the form
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(`https://lengo-vz4i.onrender.com/lessons/${lessonId}`);
        const data = await response.json();
        if (data) {
          setLessonName(data.name);
          setLevel(data.level);
          setVocabulary(data.vocabulary);
          setGrammar(data.grammar);
          if (data.test) {
            setTestId(data.test);
            setQuestions(data.test.questions || [{ question: '', options: ['', '', ''], correctAnswer: '' }]);
          } else {
            setTestId(null);
            setQuestions([{ question: '', options: ['', '', ''], correctAnswer: '' }]);
          }
        }
      } catch (err) {
        alert('Грешка при зареждане на урока.');
      }
    };
    fetchLesson();
  }, [lessonId]);

  const handleSaveLesson = async () => {
    if (
      !lessonNameInput.trim() ||
      vocabulary.some((word) => !word.bulgarian.trim() || !word.english.trim()) ||
      !grammar.trim()
    ) {
      alert('Моля, попълнете всички полета.');
      return;
    }

    setIsLoading(true);

    const lesson = { name: lessonNameInput, level, vocabulary, grammar, test: testId };

    try {
      const response = await fetch(`https://lengo-vz4i.onrender.com/lessons/${lessonId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'x-csrf-token': localStorage.getItem('csrfToken')
        },
        body: JSON.stringify(lesson),
      });

      if (response.ok) {
        navigate(`/admin/lessons/${level}/${lessonNameInput}`); 
      } else {
        alert('Грешка при обновяване на урока.');
      }
    } catch (err) {
      alert('Грешка при свързването със сървъра.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuestions([{ question: '', options: ['', '', ''], correctAnswer: '' }]);
    setError(null);
  };

  const handleVocabularyChange = (index, field, value) => {
    const updatedVocabulary = [...vocabulary];
    updatedVocabulary[index][field] = value;
    setVocabulary(updatedVocabulary);
  };

  const handleAddVocabulary = () => {
    setVocabulary([...vocabulary, { bulgarian: '', english: '' }]);
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctAnswer = value;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], correctAnswer: '' },
    ]);
  };

  const handleSaveTest = async () => {
    setIsLoading(true);

    // Extract test ID properly, handling both string and object cases
    const id = typeof testId === 'object' ? testId._id : testId;

    if (!id || typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
        setError('Invalid Test ID');
        setIsLoading(false);
        return;
    }

    const test = { questions };

    try {
        const response = await fetch(`https://lengo-vz4i.onrender.com/tests/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'x-csrf-token': localStorage.getItem('csrfToken')
            },
            body: JSON.stringify(test),
        });

        if (response.ok) {
            alert('Тестът е обновен успешно!');
        } else {
            const errorData = await response.json();
            setError(errorData.error || 'Грешка при обновяване на теста.');
        }
    } catch (err) {
        setError('Грешка при свързването със сървъра.');
    } finally {
        setIsLoading(false);
    }
};


  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex-grow flex flex-col items-center pt-16">
        <div className="text-center p-4">
          <h1 className="text-5xl font-bold mb-4 text-blue-900 drop-shadow-lg">Редактиране на урок</h1>
          <p className="text-xl text-black">Тук можете да редактирате урока.</p>
        </div>
        <div className="bg-blue-300 rounded-xl shadow-xl p-10 w-full max-w-4xl mx-auto mt-8">
          <div className="mb-8">
            <label className="block text-3xl font-bold mb-4 text-blue-900">Име на урока</label>
            <input
              type="text"
              value={lessonNameInput}
              onChange={(e) => setLessonName(e.target.value)}
              placeholder="Въведете име на урока"
              className="w-full p-2 border border-gray-400 rounded-lg shadow-md"
            />
          </div>
          <div className="mb-8">
            <label className="block text-3xl font-bold mb-4 text-blue-900">Ниво</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded-lg shadow-md"
            >
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-blue-900">Лексика</h2>
            {vocabulary.map((word, index) => (
              <div key={index} className="flex items-center mb-4">
                <input
                  type="text"
                  value={word.bulgarian}
                  onChange={(e) => handleVocabularyChange(index, 'bulgarian', e.target.value)}
                  placeholder="Българска дума"
                  className="flex-1 p-2 border border-gray-400 rounded-lg mr-4 shadow-md"
                />
                <input
                  type="text"
                  value={word.english}
                  onChange={(e) => handleVocabularyChange(index, 'english', e.target.value)}
                  placeholder="Превод на английски"
                  className="flex-1 p-2 border border-gray-400 rounded-lg shadow-md"
                />
              </div>
            ))}
            <button
              onClick={handleAddVocabulary}
              className="mt-4 bg-blue-600 text-white text-md font-semibold py-2 px-4 rounded-xl shadow-lg hover:bg-blue-700"
            >
              Добавяне на нова дума
            </button>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-blue-900">Граматика</h2>
            <textarea
              value={grammar}
              onChange={(e) => setGrammar(e.target.value)}
              placeholder="Добавете текст за граматика"
              className="w-full p-4 border border-gray-400 rounded-lg shadow-md"
              rows="5"
            />
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg border border-gray-400">
            {questions.map((q, index) => (
              <div key={index} className="mb-6">
                <label className="block text-xl font-semibold text-blue-900">Въпрос {index + 1}</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  placeholder="Въведете въпрос"
                  className="w-full p-2 mb-4 border border-gray-400 rounded-lg shadow-md"
                />
                <label className="block text-xl font-semibold text-blue-900">Опции</label>
                {q.options.map((option, i) => (
                  <div key={i} className="flex items-center mb-2">
                    <input
                      type="radio"
                      name={`correctAnswer-${index}`}
                      value={option}
                      checked={q.correctAnswer === option}
                      onChange={() => handleCorrectAnswerChange(index, option)}
                      className="mr-2"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, i, e.target.value)}
                      placeholder={`Опция ${i + 1}`}
                      className="flex-1 p-2 border border-gray-400 rounded-lg shadow-md"
                    />
                  </div>
                ))}
              </div>
            ))}
            <button
              onClick={handleAddQuestion}
              className="bg-blue-400 text-white font-extrabold text-md py-2 px-4 rounded-xl shadow-lg mb-8 hover:bg-blue-600 transition duration-200"
            >
              +
            </button>

            {/* Save Test Button */}
          <div className="flex justify-center mb-4 gap-6">
          <button
          onClick={handleSaveTest}
          className={`bg-blue-600 text-white py-3 px-6 rounded-xl text-md font-semibold shadow-lg hover:bg-blue-800 transition duration-200 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Запазване...' : 'Запазване на теста'}
        </button>
        <button
          onClick={handleReset}
          className="bg-sky-500 text-white py-3 px-5 rounded-xl text-md font-semibold shadow-lg hover:bg-sky-700 transition duration-200"
        >
          Изчистване
        </button>
        </div>
        </div>
          <button
            onClick={handleSaveLesson}
            className="bg-blue-600 text-white py-3 px-6 rounded-xl text-md font-semibold shadow-lg hover:bg-blue-800 w-full mt-8 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Записване...' : 'Записване на урока'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLesson;
