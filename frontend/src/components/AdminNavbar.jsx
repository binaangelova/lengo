// src/components/AdminNavbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-3xl font-bold">
          <Link to="/admin">LenGo Администратор</Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/admin" className="text-blue-700 bg-white px-3 py-2 rounded-md text-sm font-bold hover:bg-gray-300">
            Начало
          </Link>
          <Link to="/users" className="text-blue-700 bg-white px-3 py-2 rounded-md text-sm font-bold hover:bg-gray-300">
            Потребители
          </Link>
          <Link to="/admin/add-lesson" className="text-blue-700 bg-white px-3 py-2 rounded-md text-sm font-bold hover:bg-gray-300">
            Добави урок
          </Link>
          <Link to="/" className="text-blue-700 bg-white px-3 py-2 rounded-md text-sm font-bold hover:bg-gray-300">
            Изход
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
