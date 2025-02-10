import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Navbar from '../components/Navbar';

const levels = [
  { id: 'A1', title: 'A1 - Начинаещ' },
  { id: 'A2', title: 'A2 - Основи' },
  { id: 'B1', title: 'B1 - Средно ниво' },
  { id: 'B2', title: 'B2 - Висше средно ниво' },
  { id: 'C1', title: 'C1 - Напреднало' },
  { id: 'C2', title: 'C2 - Висше напреднало' },
];

const Home = () => {
  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col items-center pt-16">
        <div className="text-center p-8">
          <h1 className="text-5xl font-bold mb-2 text-blue-900">Добре дошли в LenGo!</h1>
          <p className="text-xl mb-0 pt-2">Вашият спътник в изучаването на английския език.</p>
        </div>
        {/* Cards Section */}
        <div className="grid grid-cols-3 gap-10 p-20">
          {levels.map((level) => (
            <Link
              key={level.id}
              to={`/lessons#${level.id}`} // Use the hash to navigate to the section in Lessons page
              className="bg-blue-200 rounded-lg shadow-lg p-8 flex flex-col items-center hover:bg-blue-300 hover:scale-105 transition duration-200"
            >
              <h2 className="text-3xl font-semibold text-blue-800">{level.title}</h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
