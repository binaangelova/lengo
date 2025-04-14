import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import registerImage from '../images/loginimage3.jpg';
import { Eye, EyeOff } from 'lucide-react'; // Import eye icons

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('https://lengo-vz4i.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        login(data.token);
        navigate('/home');
      } else {
        setError(data.error || 'An error occurred during login.');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Failed to connect to the server.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-xl shadow-2xl flex max-w-3xl w-full border-4 border-sky-200/100">
        
        {/* Image Section */}
        <div className="w-1/2 flex justify-center items-center">
          <img src={registerImage} alt="Login" className="w-full h-auto rounded-lg" />
        </div>

        {/* Form Section */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-center text-3xl font-semibold mb-6 text-gray-800">Login</h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col ml-6">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4 p-3 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
            />
            
            {/* Password Input with Eye Icon */}
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 bg-gray-100 border border-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button 
              type="submit" 
              className="bg-blue-500 font-semibold text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 hover:scale-105 transition duration-200"
            >
              Login
            </button>
          </form>
          <p className="text-center mt-4 text-gray-700">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/')} 
              className="text-blue-500 font-semibold underline hover:text-blue-700 hover:scale-105"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
