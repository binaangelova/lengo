import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5003/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleInspect = (id) => {
    navigate(`/user-details/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const updatedUsers = users.filter((user) => user._id !== id);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex-grow flex flex-col items-center pt-8">
        <div className="text-center p-8">
          <h1 className="text-5xl font-bold mb-2 text-blue-900">Потребители</h1>
          <p className="text-xl mb-0 pt-2">Прегледайте и управлявайте акаунти на потребители.</p>
        </div>
        <div className="p-10 w-full max-w-4xl">
          <h2 className="text-3xl font-semibold text-blue-800">Списък с потребители</h2>
          <div className="mt-4">
            <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-200 text-blue-800">
                  <th className="py-2 px-4 text-left">ID</th>
                  <th className="py-2 px-4 text-left">Потребителско име</th>
                  <th className="py-2 px-4 text-left">Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4">Няма налични потребители.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="border-b last:border-b-0">
                      <td className="py-2 px-4 text-left">{user._id}</td>
                      <td className="py-2 px-4 text-left">{user.username}</td>
                      <td className="py-2 px-4 text-left">
                        <button
                          onClick={() => handleInspect(user._id)}
                          className="bg-blue-500 text-white font-semibold hover:bg-blue-700 rounded-lg px-4 py-2 mr-2 transition"
                        >
                          Преглед
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-500 text-white font-semibold hover:bg-red-700 rounded-lg px-4 py-2 transition"
                        >
                          Изтрий
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
