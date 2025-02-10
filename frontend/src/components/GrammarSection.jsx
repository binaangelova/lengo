import React from 'react';
import PropTypes from 'prop-types';

const GrammarSection = ({ grammar }) => {
  const exampleGrammar = [
    { rule: 'Настоящо време', description: 'Използва се за действия, които се извършват в момента или редовно.' },
    { rule: 'Минало време', description: 'Използва се за действия, които са се случили в миналото.' },
    { rule: 'Бъдеще време', description: 'Използва се за действия, които ще се случат в бъдеще.' },
  ];

  const grammarToDisplay = grammar && grammar.length > 0 ? grammar : exampleGrammar;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md mt-4">
      <h2 className="text-3xl font-semibold text-blue-800 mt-4 mb-2">Граматика</h2>
      <ul className="list-disc list-inside">
        {grammarToDisplay.map((item, index) => (
          <li key={index} className="text-lg mb-2">
            <strong>{item.rule}</strong>: {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

GrammarSection.propTypes = {
  grammar: PropTypes.arrayOf(
    PropTypes.shape({
      rule: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ),
};

export default GrammarSection;
