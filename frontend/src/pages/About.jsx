import React from 'react';
import Navbar from '../components/Navbar'; // Ensure you have a Navbar component
import { FaInstagram, FaLink, FaEnvelope } from 'react-icons/fa'; // Import icons from react-icons
import yourImage from '../images/loginimage2.jpg'; // Update this path to your image

const About = () => {
  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center pt-8">
        {/* Container for image and text */}
        <div className="flex flex-col items-center space-y-8 px-4 max-w-6xl">
          {/* Header with title */}
          <h1 className="text-5xl font-bold text-blue-900 mb-4 drop-shadow-lg text-center">
            За нас
          </h1>
          {/* Container for image and text side by side */}
          <div className="flex flex-col md:flex-row items-center space-x-12">
            {/* Image on top for smaller screens, side by side for larger screens */}
            <div className="flex-shrink-0 mt-4 md:mt-0">
              <img 
                src={yourImage} 
                alt="Description of the image" 
                className="w-80 h-auto rounded-lg shadow-lg"
              /> 
            </div>
            {/* Text content */}
            <div className="text-left p-8 flex-grow mt-4 md:mt-0">
              <p className="text-lg mb-4 leading-relaxed text-justify">
                Добре дошли в LenGo! Вашият личен помощник в изучаването на английския език.<br />
                Сайтът е създаден от мен, за да предостави на всички, независимо от възрастта или нивото на познание,<br />
                лесен и достъпен начин за учене на английски.
              </p>
              <p className="text-lg mb-4 leading-relaxed text-justify">
                Моята мисия е да направя процеса на учене по-приятен и ефективен. На платформата ще намерите разнообразие от уроци и ресурси,<br />
                които ще ви помогнат да развиете вашите езикови умения.
              </p>
              <p className="text-lg leading-relaxed text-justify">
                С LenGo, изучаването на английския език става лесно и забавно! Присъединете се към нас <br />
                и открийте новия си потенциал в езика!
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default About;
