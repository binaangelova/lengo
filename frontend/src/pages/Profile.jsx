import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../AuthContext'; // Import useAuth hook to access authentication context

const Profile = () => {
  const { isAuthenticated, logout } = useAuth(); // Get authentication status and logout function from context
  
  // Replace these with actual user data from your authentication system
  const user = {
    name: "name", 
    profilePicture: null // Add the profile picture URL or path here
  };

  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex-col items-center pt-8"> {/* Reduced padding from pt-16 to pt-8 */}
        <div className="text-center p-6"> {/* Reduced padding from p-8 to p-6 */}
          <h1 className="text-5xl font-bold mb-2 text-blue-900">Профил</h1>
          {isAuthenticated && (
            <div className="flex flex-row w-full max-w-5xl mx-auto p-6 mt-14"> {/* Reduced margin-top and padding */}
              <div className="flex-grow text-left mr-20 mt-4"> {/* Reduced margin-top for name section */}
                <p className="text-xl mb-0 pt-2 text-blue-800 flex items-center">
                  <strong className="mr-2">Име:</strong>
                  <span className="font-semibold">{user.name}</span>
                </p>
                <button
                  onClick={logout} // Call the logout function on button click
                  className="bg-blue-500 text-white font-bold p-3 rounded-lg hover:bg-blue-600 hover:scale-105 transition duration-200 mt-4"
                >
                  Излизане
                </button>
              </div>
              <div className="ml-4 w-4/5">
                <div className="bg-blue-200 rounded-lg shadow-lg p-10">
                  <p className="text-xl text-blue-800 mb-4">
                    <strong>Направени до момента тестове:</strong>
                  </p>
                  <div className="p-5 flex flex-col gap-4">
                    <button className="bg-white text-blue-800 font-bold p-3 rounded-lg hover:bg-gray-200 transition duration-100">Тест 1</button>
                    <button className="bg-white text-blue-800 font-bold p-3 rounded-lg hover:bg-gray-200 transition duration-100">Тест 2</button>
                    <button className="bg-white text-blue-800 font-bold p-3 rounded-lg hover:bg-gray-200 transition duration-100">Тест 3</button>
                </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
