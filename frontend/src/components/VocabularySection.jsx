import React from 'react';
import PropTypes from 'prop-types';

const VocabularySection = ({ vocabulary }) => {
  const exampleVocabulary = [
    { bulgarian: 'котка', english: 'cat' },
    { bulgarian: 'куче', english: 'dog' },
    { bulgarian: 'слънце', english: 'sun' },
    { bulgarian: 'река', english: 'river' },
  ];

  const wordsToDisplay = vocabulary && vocabulary.length > 0 ? vocabulary : exampleVocabulary;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-4">
      <h2 className="text-3xl font-semibold text-blue-800 mt-4 mb-2">Лексика</h2>
      <ul className="list-disc list-inside">
        {wordsToDisplay.map((word, index) => (
          <li key={index} className="text-lg mb-2">
            <strong>{word.bulgarian}</strong> - {word.english}
          </li>
        ))}
      </ul>
    </div>
  );
};

VocabularySection.propTypes = {
  vocabulary: PropTypes.arrayOf(
    PropTypes.shape({
      bulgarian: PropTypes.string.isRequired,
      english: PropTypes.string.isRequired,
    })
  ),
};

export default VocabularySection;
