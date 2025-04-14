import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';

const UserDetail = () => {
  const { userId } = useParams(); // Get user ID from the URL
  const [user, setUser] = useState(null);
  const [completedTests, setCompletedTests] = useState([]); // State for completed tests
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details
    const fetchUser = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch completed tests for this user
    const getCompletedTests = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/completed-tests/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Send JWT in headers
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch completed tests');
        }

        const data = await response.json();
        setCompletedTests(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
    getCompletedTests();
    setLoading(false);
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex-grow flex flex-col items-center pt-10">
        <div className="text-center p-8">
          <h1 className="text-5xl font-bold mb-2 text-blue-900 drop-shadow-xl">Потребител: {user.username}</h1>
          <p className="text-xl mb-4">Преглед на информацията за потребителя.</p>
        </div>
        <div className="p-8 w-full max-w-5xl">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-blue-800 drop-shadow-lg">Детайли на потребителя</h2>
            <p><strong>ID:</strong> {user._id}</p>
            <p><strong>Потребителско име:</strong> {user.username}</p>
            <p><strong>Имейл:</strong> {user.email}</p> {/* Display email */}

            {/* Display Completed Tests */}
            <div className="flex items-center mt-4"> {/* Changed to flex row */}
              <p className="mr-4"><strong>Направени тестове:</strong></p>
              <div className="flex flex-wrap gap-2"> {/* Adjust gap for spacing between buttons */}
                {completedTests.length === 0 ? (
                  <p className="text-blue-800">Няма намерени тестове.</p>
                ) : (
                  completedTests.map((test) => (
                    <button
                      key={test._id}
                      className="bg-blue-400 text-blue-50 text-md font-semibold py-1 px-3 rounded-xl hover:bg-blue-500 transition duration-200"
                      onClick={() => navigate(`/admin/admin-test-results/${test._id}`)}
                    >
                      {test.lessonId?.name || "Без име"}
                    </button>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 text-white text-md font-semibold hover:bg-blue-800 rounded-xl px-4 py-2 mt-4 transition duration-200"
            >
              Назад към списъка с потребители
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
