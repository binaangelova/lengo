import React, { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';

const LessonEditor = () => {
  const [lessonName, setLessonName] = useState('');
  const [level, setLevel] = useState('A1');
  const [vocabulary, setVocabulary] = useState([{ bulgarian: '', english: '' }]);
  const [grammar, setGrammar] = useState('');
  const [testId, setTestId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', ''], correctAnswer: '' }]);
  const [error, setError] = useState(null);

  const handleTestSave = (testId) => {
    setTestId(testId); // Save the test ID after saving the test
  };

  const handleAddVocabulary = () => {
    if (vocabulary.every((word) => word.bulgarian && word.english)) {
      setVocabulary([...vocabulary, { bulgarian: '', english: '' }]);
    } else {
      alert('Попълнете всички полета за лексиката преди добавяне на нова дума!');
    }
  };

  const handleVocabularyChange = (index, field, value) => {
    const updatedVocabulary = [...vocabulary];
    updatedVocabulary[index][field] = value;
    setVocabulary(updatedVocabulary);
  };

  const handleSaveLesson = async () => {
    if (
      !lessonName.trim() ||
      vocabulary.some((word) => !word.bulgarian.trim() || !word.english.trim()) ||
      !grammar.trim()
    ) {
      alert('Моля, попълнете всички полета.');
      return;
    }

    setIsLoading(true);

    const lesson = { name: lessonName, level, vocabulary, grammar, test: testId };

    try {
      const response = await fetch('http://localhost:5003/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lesson),
      });

      if (response.ok) {
        setLessonName('');
        setLevel('A1');
        setVocabulary([{ bulgarian: '', english: '' }]);
        setGrammar('');
        setTestId(null);
      } else {
        alert('Грешка при запазване на урока.');
      }
    } catch (err) {
      alert('Грешка при свързването със сървъра.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (index, correctAnswer) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctAnswer = correctAnswer;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', ''], correctAnswer: '' }]);
  };

  const handleReset = () => {
    setQuestions([{ question: '', options: ['', '', ''], correctAnswer: '' }]);
    setError(null);
  };

  const validateForm = () => {
    const isValid = questions.every(
      (q) => q.question.trim() && q.options.every((o) => o.trim()) && q.correctAnswer.trim()
    );
    if (!isValid) setError('Моля попълнете всички въпроси и отговори.');
    return isValid;
  };

  const handleSaveTest = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5003/tests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questions }),
        });

        if (response.ok) {
          const { _id } = await response.json();
          handleTestSave(_id);
          handleReset(); // Reset the form after successful save
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Възникна грешка при запазването на теста.');
        }
      } catch (err) {
        setError('Сървърна грешка.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex-grow flex flex-col items-center pt-16">
        <div className="text-center p-4">
          <h1 className="text-5xl font-bold mb-4 text-blue-900 drop-shadow-lg">Добавяне на урок</h1>
          <p className="text-xl text-black">Тук можете да добавите нов урок към платформата.</p>
        </div>
        <div className="bg-blue-300 rounded-xl shadow-xl p-10 w-full max-w-4xl mx-auto mt-8">
          <div className="mb-8">
            <label className="block text-3xl font-bold mb-4 text-blue-900">Име на урока</label>
            <input
              type="text"
              value={lessonName}
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
                placeholder={`Отговор ${i + 1}`}
                className="flex-1 p-2 border border-gray-400 rounded-lg shadow-md"
              />
            </div>
          ))}
        </div>
      ))}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <button
        onClick={handleAddQuestion}
        className="bg-blue-400 text-white font-extrabold text-md py-2 px-4 rounded-xl shadow-lg mb-8 hover:bg-blue-600 transition duration-200"
      >
        +
      </button>
      <div className="flex justify-center items-center gap-6">
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
            {isLoading ? 'Запазва се...' : 'Запазване на урока'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonEditor;
