import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Assuming you're using a context to store authentication info

const Navbar = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (user?.role === 'admin') {
      setIsAdmin(true);
    }
  }, [user]);

  if (isLoading) {
    return (
      <nav className="bg-gradient-to-r from-blue-800 via-blue-500 to-sky-400 shadow-lg p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-3xl font-bold tracking-wide">
            LenGo
          </div>
        </div>
      </nav>
    );
  }

  const isActive = (path) => {
    return location.pathname === path ? 'bg-white text-blue-700' : 'bg-white text-blue-700 hover:bg-gray-300';
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 via-blue-500 to-sky-400 shadow-lg p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-3xl font-bold tracking-wide">
          <Link to="/home" className="hover:text-gray-200 transition duration-300">
            LenGo
          </Link>
        </div>

        {isAuthenticated && (
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`px-4 py-2 rounded-xl text-sm font-bold shadow-md transition duration-300 ${isActive('/admin')}`}
              >
                Админ-панел
              </Link>
            )}
            <Link 
              to="/home" 
              className={`px-4 py-2 rounded-xl text-sm font-bold shadow-md transition duration-300 ${isActive('/home')}`}
            >
              Начало
            </Link>
            <Link 
              to="/about" 
              className={`px-4 py-2 rounded-xl text-sm font-bold shadow-md transition duration-300 ${isActive('/about')}`}
            >
              За нас
            </Link>
            <Link 
              to="/lessons" 
              className={`px-4 py-2 rounded-xl text-sm font-bold shadow-md transition duration-300 ${isActive('/lessons')}`}
            >
              Уроци
            </Link>
            <Link 
              to="/profile" 
              className={`px-4 py-2 rounded-xl text-sm font-bold shadow-md transition duration-300 ${isActive('/profile')}`}
            >
              Профил
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
