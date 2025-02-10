import React from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';

const Admin = () => {
  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex-grow flex flex-col items-center pt-16">
        <div className="text-center p-8">
          <h1 className="text-5xl font-bold mb-2 text-blue-900">Добре дошли в LenGo Администратор!</h1>
          <p className="text-xl mb-0 pt-2">Вашият инструмент за управление на приложението.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 p-20">
          <Link to="/users" className="bg-blue-200 rounded-lg shadow-lg p-8 flex flex-col items-center hover:bg-blue-300 hover:scale-105 transition duration-200">
            <h2 className="text-3xl font-semibold text-blue-800">Управление на потребители</h2>
            <p className="mt-4 text-lg">Прегледайте и управлявайте акаунти на потребители.</p>
          </Link>
          
          {/* Link for adding lessons */}
          <Link to="/admin/add-lesson" className="bg-blue-200 rounded-lg shadow-lg p-8 flex flex-col items-center hover:bg-blue-300 hover:scale-105 transition duration-200">
            <h2 className="text-3xl font-semibold text-blue-800">Добавяне на уроци</h2>
            <p className="mt-4 text-lg">Създайте и управлявайте нови уроци.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Admin;
