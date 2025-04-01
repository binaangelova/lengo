import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import backgroundImage from '../images/image9.jpg';

const levels = [
  { id: 'A1', title: 'A1 - Начинаещ' },
  { id: 'A2', title: 'A2 - Основи' },
  { id: 'B1', title: 'B1 - Средно ниво' },
  { id: 'B2', title: 'B2 - Висше средно ниво' },
  { id: 'C1', title: 'C1 - Напреднало' },
  { id: 'C2', title: 'C2 - Висше напреднало' },
];

const Home = () => {
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/lessons#${id}`);
    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <Navbar />

      {/* Heading Section with Background Image */}
      <div className="relative w-full flex flex-col items-center justify-center h-56">
        <div
          className="absolute inset-0 bg-cover bg-center bg-blue-500 opacity-50"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
        <div className="relative text-center p-8">
          <h1 className="text-5xl font-extrabold text-blue-900 mb-4 
          ">
            Добре дошли в <span className="text-blue-700">LenGo!</span>
          </h1>
          <p className="text-xl">Вашият спътник в изучаването на английския език.</p>
        </div>
      </div>

      {/* Cards Section */}
      <div className="flex-grow flex flex-col items-center">
        <h2 className="text-4xl font-bold text-blue-900 mt-6 mb-2 drop-shadow-lg">Нива:</h2>

        <div className="grid grid-cols-3 gap-10 p-12">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => handleCardClick(level.id)}
              className="bg-blue-300 rounded-2xl shadow-xl p-8 flex flex-col items-center 
              hover:bg-white hover:scale-105 transition duration-300"
            >
              <h3 className="text-3xl font-semibold text-blue-900">{level.title}</h3>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
