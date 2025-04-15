import React, { useState, useEffect } from 'react';
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

  // Add change detection to all form changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleFormChange = () => {
    setHasUnsavedChanges(true);
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
      const response = await fetch('https://lengo-vz4i.onrender.com/lessons', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'x-csrf-token': localStorage.getItem('csrfToken')
        },
        body: JSON.stringify(lesson),
      });

      if (response.ok) {
        setHasUnsavedChanges(false);
        setLessonName('');
        setLevel('A1');
        setVocabulary([{ bulgarian: '', english: '' }]);
        setGrammar('');
        setTestId(null);
      } else {
        throw new Error('Failed to save lesson');
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
    handleFormChange();
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[optionIndex] = value;
    setQuestions(updatedQuestions);
    handleFormChange();
  };

  const handleCorrectAnswerChange = (index, correctAnswer) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctAnswer = correctAnswer;
    setQuestions(updatedQuestions);
    handleFormChange();
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', ''], correctAnswer: '' }]);
    handleFormChange();
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

  const validateTest = () => {
    const errors = [];

    if (!questions || questions.length === 0) {
      errors.push('Добавете поне един въпрос.');
      return errors;
    }

    questions.forEach((question, index) => {
      if (!question.question.trim()) {
        errors.push(`Въпрос ${index + 1}: Въпросът е задължителен.`);
      }

      // Check for duplicate options
      const uniqueOptions = new Set(question.options.map(opt => opt.trim()));
      if (uniqueOptions.size !== question.options.length) {
        errors.push(`Въпрос ${index + 1}: Има повтарящи се отговори.`);
      }

      // Check for empty options
      question.options.forEach((option, optIndex) => {
        if (!option.trim()) {
          errors.push(`Въпрос ${index + 1}: Отговор ${optIndex + 1} е празен.`);
        }
      });

      // Validate correct answer
      if (!question.correctAnswer) {
        errors.push(`Въпрос ${index + 1}: Изберете правилен отговор.`);
      } else if (!question.options.includes(question.correctAnswer)) {
        errors.push(`Въпрос ${index + 1}: Правилният отговор трябва да е един от възможните отговори.`);
      }
    });

    return errors;
  };

  const handleSaveTest = async () => {
    setIsLoading(true);
    const validationErrors = validateTest();

    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://lengo-vz4i.onrender.com/tests', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'x-csrf-token': localStorage.getItem('csrfToken')
        },
        body: JSON.stringify({ questions }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Грешка при запазване на теста');
      }

      const { _id } = await response.json();
      handleTestSave(_id);
      handleReset();
      setError(null);
    } catch (err) {
      setError(err.message || 'Грешка при свързване със сървъра');
    } finally {
      setIsLoading(false);
    }
  };

  // Update input handlers to track changes
  const handleLessonNameChange = (e) => {
    setLessonName(e.target.value);
    handleFormChange();
  };

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
    handleFormChange();
  };

  const handleVocabularyChange = (index, field, value) => {
    const updatedVocabulary = [...vocabulary];
    updatedVocabulary[index][field] = value;
    setVocabulary(updatedVocabulary);
    handleFormChange();
  };

  const handleGrammarChange = (e) => {
    setGrammar(e.target.value);
    handleFormChange();
  };

  // Navigation confirmation
  const handleNavigateAway = () => {
    if (hasUnsavedChanges) {
      return window.confirm('Имате незапазени промени. Сигурни ли сте, че искате да напуснете?');
    }
    return true;
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
              onChange={handleLessonNameChange}
              placeholder="Въведете име на урока"
              className="w-full p-2 border border-gray-400 rounded-lg shadow-md"
            />
          </div>
          <div className="mb-8">
            <label className="block text-3xl font-bold mb-4 text-blue-900">Ниво</label>
            <select
              value={level}
              onChange={handleLevelChange}
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
              onChange={handleGrammarChange}
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
