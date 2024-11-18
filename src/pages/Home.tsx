import { Link } from 'react-router-dom';
import { MessageCircle, Book, BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { isDarkMode } = useTheme();

  return (
    <>
      {/* Full-width gradient background - only shown in light mode */}
      {!isDarkMode && <div className="fixed inset-0 mt-16 -z-10 home-gradient" />}
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className={`heading-primary text-body ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Welcome to Tranquil
          </h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            A supportive platform for individuals to share their experiences and find help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link
            to="/forum"
            className={`backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 ${
              isDarkMode ? 'bg-white/10' : 'bg-white/80'
            }`}
          >
            <MessageCircle className="w-12 h-12 text-blue-500 mb-4" />
            <h2 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Discussion Forum
            </h2>
            <p className={`font-custom ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
              Join conversations, ask questions, and share your thoughts on mental health.
            </p>
          </Link>

          <Link
            to="/journal"
            className={`backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 ${
              isDarkMode ? 'bg-white/10' : 'bg-white/80'
            }`}
          >
            <Book className="w-12 h-12 text-green-500 mb-4" />
            <h2 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Personal Journal
            </h2>
            <p className={`font-custom ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
              Keep track of your feelings and reflections in a safe space.
            </p>
          </Link>

          <Link
            to="/resources"
            className={`backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 ${
              isDarkMode ? 'bg-white/10' : 'bg-white/80'
            }`}
          >
            <BookOpen className="w-12 h-12 text-purple-500 mb-4" />
            <h2 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Resources
            </h2>
            <p className={`font-custom ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
              Access curated materials and helpful links for mental health support.
            </p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;