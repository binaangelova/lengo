import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const AdminNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 via-blue-500 to-sky-400 shadow-lg p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-3xl font-bold tracking-wide">
          <Link to="/admin" className="hover:text-gray-200 transition duration-300">
            LenGo Администратор
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/home" className="text-blue-700 bg-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-gray-200 transition duration-300">
            Клиент-панел
          </Link>
          <Link to="/admin" className="text-blue-700 bg-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-gray-200 transition duration-300">
            Начало
          </Link>
          <Link to="/admin/users" className="text-blue-700 bg-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-gray-200 transition duration-300">
            Потребители
          </Link>
          <Link to="/admin/add-lesson" className="text-blue-700 bg-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-gray-200 transition duration-300">
            Добави урок
          </Link>
          <button
            onClick={handleLogout}
            className="text-blue-700 bg-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-gray-200 transition duration-300"
          >
            Изход
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
