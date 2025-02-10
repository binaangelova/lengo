import React from 'react';
import Navbar from '../components/Navbar'; // Ensure you have a Navbar component
import yourImage from '../images/logo.jpg'; // Update this path to your image

const About = () => {
  return (
    <div className="bg-blue-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center pt-12">
        {/* Container for image and text */}
        <div className="flex w-full max-w-6xl px-4 items-start space-x-12">
          {/* Image on the left */}
          <div className="flex-shrink-0 mt-24"> {/* Increased margin-top to mt-24 */}
            <img 
              src={yourImage} 
              alt="Description of the image" 
              className="w-80 h-auto rounded-lg shadow-lg" // Removed hover effect
            /> 
          </div>
          {/* Text content on the right */}
          <div className="text-left p-8 flex-grow">
            <h1 className="text-5xl font-bold mb-6 text-blue-900">За нас</h1>
            <p className="text-lg mb-4 leading-relaxed">
              Добре дошли в LenGo! Вашият личен помощник в изучаването на английския език.<br />
              Сайтът е създаден от мен, за да предостави на всички, независимо от възрастта или нивото на познание,<br />
              лесен и достъпен начин за учене на английски.
            </p>
            <p className="text-lg mb-4 leading-relaxed">
              Моята мисия е да направя процеса на учене по-приятен и ефективен. На платформата ще намерите разнообразие от уроци и ресурси,<br />
              които ще ви помогнат да развиете вашите езикови умения.
            </p>
            <p className="text-lg leading-relaxed">
              С LenGo, изучаването на английския език става лесно и забавно! Присъединете се към нас <br />
              и открийте новия си потенциал в езика!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
