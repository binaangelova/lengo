import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import registerImage from '../images/loginimage3.jpg';
import { createRateLimiter } from '../utils/rateLimit';

const Register = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isThrottled, setIsThrottled] = useState(false);
  const rateLimiter = useMemo(() => createRateLimiter(5, 60000), []); // 5 requests per minute
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Потребителското име е задължително';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Потребителското име трябва да е поне 3 символа';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Имейлът е задължителен';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Невалиден имейл адрес';
    }

    if (!formData.password) {
      newErrors.password = 'Паролата е задължителна';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Паролата трябва да е поне 6 символа';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Use the unified form validation
    if (!validateForm()) {
      return;
    }

    if (!rateLimiter.tryRequest()) {
      setIsThrottled(true);
      setErrors({ submit: 'Моля, изчакайте малко преди да опитате отново.' });
      setTimeout(() => setIsThrottled(false), 60000);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://lengo-vz4i.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Automatically log in the user after successful registration
        const loginResponse = await fetch('https://lengo-vz4i.onrender.com/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });

        const loginData = await loginResponse.json();
        if (loginResponse.ok) {
          login(loginData.token);
          navigate('/home');
        } else {
          throw new Error(loginData.error || 'Error during automatic login');
        }
      } else {
        setErrors(prev => ({
          ...prev,
          submit: data.error || 'An error occurred during registration.'
        }));
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to connect to the server. Please try again later.'
      }));
    } finally {
      setIsSubmitting(false);
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
          {errors.submit && <p className="text-red-500 text-center mb-4">{errors.submit}</p>}
          
          <form onSubmit={handleSubmit} className="flex flex-col ml-6">
            <div className="mb-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-100 border ${errors.username ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md`}
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`mb-4 w-full p-3 bg-gray-100 border ${errors.email ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mb-2">{errors.email}</p>
              )}
            </div>

            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-100 border ${errors.password ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-4 right-3 text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <button 
              type="submit" 
              className={`bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 hover:scale-105 transition duration-200 shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting || isThrottled}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
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
