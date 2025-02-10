import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AddTestForm = ({ onTestSave }) => {
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', ''], correctAnswer: '' }]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
          onTestSave(_id); // Pass the test ID to the parent
          alert('Тестът е запазен успешно!');
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
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
      {questions.map((q, index) => (
        <div key={index} className="mb-6">
          <label className="block text-xl font-semibold text-blue-900">Въпрос {index + 1}</label>
          <input
            type="text"
            value={q.question}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
            placeholder="Въведете въпрос"
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
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
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              />
            </div>
          ))}
        </div>
      ))}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <button
        onClick={handleAddQuestion}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mb-4"
      >
        Добавяне на нов въпрос
      </button>
      <button
        onClick={handleSaveTest}
        className={`bg-blue-700 text-white py-3 px-6 rounded-lg hover:bg-blue-800 w-full ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isLoading}
      >
        {isLoading ? 'Запазване...' : 'Запазване на теста'}
      </button>
      <button
        onClick={handleReset}
        className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 mt-4 w-full"
      >
        Изчистване
      </button>
    </div>
  );
};

AddTestForm.propTypes = {
  onTestSave: PropTypes.func.isRequired,
};

export default AddTestForm;
