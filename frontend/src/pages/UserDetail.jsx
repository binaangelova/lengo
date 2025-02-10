// UserDetail.jsx (Frontend Component)
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import AdminNavbar from '../components/AdminNavbar';

const UserDetail = () => {
  const { userId } = useParams(); // Get user ID from the URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5003/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>; // Handle the loading state
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex-grow flex flex-col items-center pt-8">
        <div className="text-center p-8">
          <h1 className="text-5xl font-bold mb-2 text-blue-900">Потребител: {user.username}</h1>
          <p className="text-xl mb-4">Преглед на информацията за потребителя.</p>
        </div>
        <div className="p-10 w-full max-w-4xl">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-blue-800">Детайли на потребителя</h2>
            <p><strong>ID:</strong> {user._id}</p>
            <p><strong>Потребителско име:</strong> {user.username}</p>
            <p><strong>Направени тестове:</strong></p>
            <button
              onClick={() => navigate(-1)} // Navigate back to the previous page
              className="bg-blue-500 text-white font-semibold hover:bg-blue-700 rounded-lg px-4 py-2 mt-4"
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