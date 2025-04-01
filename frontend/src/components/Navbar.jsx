import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Assuming you're using a context to store authentication info

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();  // Assuming `user` holds user info, including the role
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && user.role === 'admin') {
      setIsAdmin(true); // Set admin flag based on the user's role
    }
  }, [user]);

  return (
    <nav className="bg-gradient-to-r from-blue-800 via-blue-500 to-sky-400 shadow-lg p-4 sticky top-0 z-50">

      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-3xl font-bold tracking-wide">
          <Link to="/home" className="hover:text-gray-200 transition duration-300">
            LenGo
          </Link>
        </div>

        {/* Navbar Links */}
        <div className="flex items-center space-x-4">
          {isAdmin && (
            <Link 
              to="/admin" 
              className="text-blue-700 bg-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-gray-300 transition duration-300"
            >
              Админ-панел
            </Link>
          )}
          <Link 
            to="/home" 
            className="text-blue-700 bg-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-gray-300 transition duration-300"
          >
            Начало
          </Link>
          <Link 
            to="/about" 
            className="text-blue-700 bg-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-gray-300 transition duration-300"
          >
            За нас
          </Link>
          <Link 
            to="/lessons" 
            className="text-blue-700 bg-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-gray-300 transition duration-300"
          >
            Уроци
          </Link>
          <Link 
            to="/profile" 
            className="text-blue-700 bg-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-gray-300 transition duration-300 ml-4"
          >
            Профил
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
