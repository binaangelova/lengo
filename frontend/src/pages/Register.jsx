import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import registerImage from '../images/loginimage3.jpg';

const Register = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:5003/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        login();
        navigate('/home');
      } else {
        setError(data.error || 'An error occurred during registration.');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Failed to connect to the server.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-xl shadow-2xl flex max-w-3xl w-full border-4 border-sky-200/100">
        
        <div className="w-1/2 flex justify-center items-center">
          <img src={registerImage} alt="Register" className="w-full h-auto rounded-lg" />
        </div>

        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-center text-3xl font-semibold mb-6 text-gray-800">Register</h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col ml-6">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4 p-3 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 p-3 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4 p-3 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full pr-10 shadow-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-4 right-3 text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button 
              type="submit" 
              className="bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 hover:scale-105 transition duration-200 shadow-lg"
            >
              Register
            </button>
          </form>
          <p className="text-center mt-4 text-gray-700">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')} 
              className="text-blue-500 font-semibold underline hover:text-blue-700 hover:scale-105"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
