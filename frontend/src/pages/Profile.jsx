import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../AuthContext'; // Import useAuth hook to access authentication context
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom

const Profile = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [completedTests, setCompletedTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const getCompletedTests = async () => {
      try {
        const response = await fetch('https://lengo-vz4i.onrender.com/completed-tests', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'x-csrf-token': localStorage.getItem('csrfToken')
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            logout();
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch completed tests');
        }

        const data = await response.json();
        setCompletedTests(data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError('Грешка при зареждане на тестовете');
      } finally {
        setIsLoading(false);
      }
    };

    getCompletedTests();
  }, [isAuthenticated, navigate, logout]);

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex-col items-center pt-8">
        <div className="text-center p-6">
          <h1 className="text-5xl font-bold mb-2 text-blue-900 drop-shadow-lg">Профил</h1>

          <div className="flex flex-row w-full max-w-5xl mx-auto p-6 mt-14">
            <div className="flex-grow text-left mr-20 mt-4">
              <p className="text-xl mb-0 pt-2 text-blue-800 flex items-center">
                <strong className="mr-2">Име:</strong>
                <span className="font-semibold text-black">{user?.username}</span>
              </p>
              <p className="text-xl mb-0 pt-2 text-blue-800 flex items-center">
                <strong className="mr-2">Имейл:</strong>
                <span className="font-semibold text-black">{user?.email}</span>
              </p>
              <button
                onClick={logout}
                className="bg-blue-600 text-white text-md font-semibold p-3 rounded-xl hover:bg-blue-800 transition duration-200 mt-10"
              >
                Излизане
              </button>
            </div>

            <div className="ml-4 w-4/5">
              <div className="bg-blue-300 rounded-xl shadow-xl p-10">
                <p className="text-xl text-blue-900 mb-4">
                  <strong>Направени до момента тестове:</strong>
                </p>

                <div className="p-5 flex flex-col gap-4">
                  {isLoading ? (
                    <div className="text-center text-blue-900">Зареждане...</div>
                  ) : error ? (
                    <div className="text-center text-red-600">{error}</div>
                  ) : completedTests.length === 0 ? (
                    <p className="text-black">Няма намерени тестове.</p>
                  ) : (
                    completedTests.map((test) => (
                      <button
                        key={test._id}
                        className="bg-white text-blue-800 font-bold p-3 rounded-xl shadow-lg hover:bg-gray-200 hover:scale-105 transition duration-200"
                        onClick={() => navigate(`/test-results/${test._id}`)}
                      >
                        {test.lessonId?.name || 'Без име'}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
