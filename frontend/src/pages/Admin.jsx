import React from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import backgroundImage from '../images/image9.jpg';

const Admin = () => {
  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <AdminNavbar />

      {/* Heading Section with Background Image */}
      <div className="relative w-full flex flex-col items-center justify-center h-56">
        <div
          className="absolute inset-0 bg-cover bg-center bg-blue-500 opacity-50"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
        <div className="relative text-center p-8">
          <h1 className="text-5xl font-extrabold text-blue-900 mb-4 drop-shadow-2xl">
            Добре дошли в <span className="text-blue-700">LenGo Администратор!</span>
          </h1>
          <p className="text-xl">Вашият инструмент за управление на приложението.</p>
        </div>
      </div>

      {/* Cards Section */}
      <div className="flex-grow flex flex-col items-center">
        <h2 className="text-4xl font-bold text-blue-900 mt-12 mb-6 drop-shadow-lg">Функции:</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 p-12">
          <Link 
            to="/admin/users" 
            className="bg-blue-300 rounded-2xl shadow-xl p-8 flex flex-col items-center hover:bg-white hover:scale-105 transition duration-300"
          >
            <h2 className="text-3xl font-semibold text-blue-900">Управление на потребители</h2>
            <p className="mt-4 text-lg text-center">Прегледайте и управлявайте акаунти на потребители.</p>
          </Link>
          
          <Link 
            to="/admin/add-lesson" 
            className="bg-blue-300 rounded-2xl shadow-xl p-8 flex flex-col items-center hover:bg-white hover:scale-105 transition duration-300"
          >
            <h2 className="text-3xl font-semibold text-blue-900">Добавяне на уроци</h2>
            <p className="mt-4 text-lg text-center">Създайте и управлявайте нови уроци.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Admin;
