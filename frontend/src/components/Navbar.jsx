// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-3xl font-bold">
          <Link to="/home">LenGo</Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/home" className="text-blue-700 bg-white px-3 py-2 rounded-md text-sm font-bold hover:bg-gray-300">
            Начало
          </Link>
          <Link to="/about" className="text-blue-700 bg-white px-3 py-2 rounded-md text-sm font-bold hover:bg-gray-300">
            За нас
          </Link>
          <Link to="/lessons" className="text-blue-700 bg-white px-3 py-2 rounded-md text-sm font-bold hover:bg-gray-300">
            Уроци
          </Link>
          <Link 
            to="/profile" 
            className="text-blue-700 bg-white px-3 py-2 rounded-md text-sm font-bold hover:bg-gray-300 ml-4">
            Профил
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
