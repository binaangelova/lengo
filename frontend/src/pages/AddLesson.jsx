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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/lessons`);
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
        <h1 className="text-5xl font-bold text-blue-900 mb-4 drop-shadow-lg text-center">Добави урок</h1>
        <p className="text-xl mb-8">Изберете ниво, за да добавите нов урок.</p>

        <div className="mb-6">
          <Link to="/admin/lesson-editor">
            <button className="bg-blue-600 text-white text-xl font-extrabold py-2 px-4 rounded-2xl shadow-xl hover:bg-blue-400 hover:text-blue-900 transition duration-200">
              +
            </button>
          </Link>
        </div>

        <div className="flex flex-col space-y-10 p-10 w-full max-w-5xl mx-auto">
          {levels.map((level) => (
            <div key={level.id} className="bg-blue-300 rounded-2xl shadow-xl p-10 flex flex-col items-center w-full">
              <h2 className="text-3xl font-semibold text-blue-900 mb-10">{level.title}</h2>

              {lessons[level.id]?.length === 0 ? (
                <p className="text-xl text-red-500">Няма уроци за това ниво</p>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {lessons[level.id]?.map((lesson) => (
                    <Link to={`/admin/lessons/${level.id}/${lesson.name}`} key={lesson._id}>
                      <button className="bg-blue-600 text-white text-md font-semibold py-2 px-4 rounded-xl shadow-lg transition duration-200 hover:bg-white hover:text-blue-900 hover:scale-105">
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
