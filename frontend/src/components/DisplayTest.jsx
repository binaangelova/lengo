import React, { useState } from 'react';
import PropTypes from 'prop-types';

const DisplayTest = ({ test }) => {
  const [selectedAnswers, setSelectedAnswers] = useState(
    test.questions.map(() => '') // Инициализиране на празен избор за всеки въпрос
  );

  const handleAnswerChange = (questionIndex, selectedOption) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = selectedOption;
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    // Логика за изпращане на теста
    console.log('Test submitted with answers:', selectedAnswers);
  };

  if (!test || !test.questions || test.questions.length === 0) {
    return <div className="text-red-500">Няма въпроси в теста.</div>;
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto mt-4">
      <h2 className="text-2xl font-semibold text-blue-900 mb-4">Тест: {test.name || 'Няма име на теста'}</h2>
      {test.questions.map((q, index) => (
        <div key={index} className="mb-6">
          <label className="block text-xl font-semibold text-blue-900">Въпрос {index + 1}</label>
          <p className="mb-4">{q.question}</p>
          <label className="block text-xl font-semibold text-blue-900">Опции</label>
          {q.options.map((option, i) => (
            <div key={i} className="flex items-center mb-2">
              <input
                type="radio"
                name={`question-${index}`}
                value={option}
                checked={selectedAnswers[index] === option}
                onChange={() => handleAnswerChange(index, option)} // Обновява избора
                className="mr-2"
              />
              <p className="flex-1">{option}</p>
            </div>
          ))}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Изпрати теста
      </button>
    </div>
  );
};

DisplayTest.propTypes = {
  test: PropTypes.shape({
    name: PropTypes.string,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        question: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.string).isRequired,
        correctAnswer: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

// Примерни данни за теста
const exampleTest = {
  name: 'Примерен тест',
  questions: [
    {
      question: 'Какво е столицата на България?',
      options: ['София', 'Пловдив', 'Варна'],
      correctAnswer: 'София',
    },
    {
      question: 'Кой е президент на България?',
      options: ['Румен Радев', 'Бойко Борисов', 'Цецка Цачева'],
      correctAnswer: 'Румен Радев',
    },
  ],
};

DisplayTest.defaultProps = {
  test: exampleTest,
};

export default DisplayTest;
