import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Journal from './pages/Journal';
import Resources from './pages/Resources';
import Forum from './pages/Forum';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ThemedApp />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

function ThemedApp() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark-gradient' : 'vintage-gradient'}`}>
      <div className={`full-background ${isDarkMode ? '' : 'light-gradient'}`}></div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/forum" element={<Forum />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;