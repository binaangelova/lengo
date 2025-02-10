import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';

const levels = [
  { id: 'A1', title: 'A1 - Начинаещ' },
  { id: 'A2', title: 'A2 - Основи' },
  { id: 'B1', title: 'B1 - Средно ниво' },
  { id: 'B2', title: 'B2 - Висше средно ниво' },
  { id: 'C1', title: 'C1 - Напреднало' },
  { id: 'C2', title: 'C2 - Висше напреднало' },
];

const AddLesson = () => {
  const [lessons, setLessons] = useState({ A1: [], A2: [], B1: [], B2: [], C1: [], C2: [] });

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch('http://localhost:5003/lessons');
        const data = await response.json();
        const groupedLessons = levels.reduce((acc, level) => {
          acc[level.id] = data.filter((lesson) => lesson.level === level.id);
          return acc;
        }, {});
        setLessons(groupedLessons);
      } catch (err) {
        console.error('Грешка при зареждането на уроците:', err);
      }
    };

    fetchLessons();
  }, []);

  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex-grow flex flex-col items-center pt-16">
        <h1 className="text-5xl font-bold mb-4 text-blue-900">Добави урок</h1>
        <p className="text-xl mb-8">Изберете ниво, за да добавите нов урок.</p>

        <div className="mb-6">
          <Link to="/lesson-editor">
            <button className="bg-blue-500 text-white text-2xl font-bold p-3 w-12 h-12 flex items-center justify-center rounded-lg hover:bg-blue-600 hover:scale-105 transition duration-200">
              +
            </button>
          </Link>
        </div>

        <div className="flex flex-col space-y-10 p-10 w-full max-w-5xl mx-auto">
          {levels.map((level) => (
            <div key={level.id} className="bg-blue-200 rounded-lg shadow-lg p-10 flex flex-col items-center w-full">
              <h2 className="text-3xl font-semibold text-blue-800 mb-10">{level.title}</h2>

              {lessons[level.id]?.length === 0 ? (
                <p className="text-xl text-red-500">Няма уроци за това ниво</p>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {lessons[level.id]?.map((lesson) => (
                    <Link to={`/admin/lessons/${level.id}/${lesson.name}`} key={lesson._id}>
                      <button className="bg-blue-500 text-white text-lg py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
                        {lesson.name}
                      </button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddLesson;
