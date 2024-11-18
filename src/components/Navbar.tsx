import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Book, BookOpen, LogOut, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <nav className={`bg-white/80 dark:bg-[#1a1625]/90 backdrop-blur-sm shadow-lg transition-colors duration-200 border-b border-purple-100 dark:border-white/10 ${isDarkMode ? '' : 'light-gradient'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-purple-900 dark:text-purple-100 playfield-heading font-custom">
            Tranquil
          </Link>
          
          <div className="flex space-x-4">
            <Link to="/forum" className="flex items-center text-purple-700 dark:text-purple-200 hover:text-purple-900 dark:hover:text-purple-100 font-custom">
              <MessageCircle className="w-5 h-5 mr-1" />
              Forum
            </Link>
            <Link to="/journal" className="flex items-center text-purple-700 dark:text-purple-200 hover:text-purple-900 dark:hover:text-purple-100 font-custom">
              <Book className="w-5 h-5 mr-1" />
              Journal
            </Link>
            <Link to="/resources" className="flex items-center text-purple-700 dark:text-purple-200 hover:text-purple-900 dark:hover:text-purple-100 font-custom">
              <BookOpen className="w-5 h-5 mr-1" />
              Resources
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-purple-700 dark:text-purple-200" />
              ) : (
                <Moon className="w-5 h-5 text-purple-700 dark:text-purple-200" />
              )}
            </button>
            
            {user ? (
              <>
                <span className="flex items-center text-purple-700 dark:text-purple-200 hover:text-purple-900 dark:hover:text-purple-100 font-custom">
                  <User className="w-5 h-5 mr-1" />
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center text-purple-700 dark:text-purple-200 hover:text-purple-900 dark:hover:text-purple-100 font-custom"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-purple-700 dark:text-purple-200 hover:text-purple-900 dark:hover:text-purple-100 font-custom"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;