import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Book } from 'lucide-react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';


interface JournalEntry {
  _id: string;
  title: string;
  content: string;
  date: string;
  lastModified?: string;
  userId: string;
}

const Journal = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!token || !storedUser) {
      setError('Please login to access your journal');
      return;
    }

    if (user && token) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    const token = localStorage.getItem('token');
    if (!user || !token) {
      console.log('No user or token available');
      return;
    }

    setIsLoading(true);
    try {
      console.log('User ID:', user._id);
      console.log('Fetching entries with token:', token);
      const response = await axios.get('/api/journal', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Entries received:', response.data);
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        setError(error.response?.data?.message || 'Failed to fetch entries');
        if (error.response?.status === 401) {
          console.log('Token expired or invalid');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      return;
    }

    try {
      const response = await axios.post('/api/journal', newEntry, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setEntries([response.data, ...entries]);
      setNewEntry({ title: '', content: '' });
      console.log('Entry created successfully');
    } catch (error) {
      console.error('Error creating entry:', error);
      setError('Failed to create entry');
    }
  };

  const handleUpdate = async (entryId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      return;
    }

    try {
      const response = await axios.put(`/api/journal/${entryId}`, {
        title: editTitle,
        content: editContent
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setEntries(entries.map(entry => 
        entry._id === entryId ? response.data : entry
      ));
      setEditingEntry(null);
      console.log('Entry updated successfully');
    } catch (error) {
      console.error('Error updating entry:', error);
      setError('Failed to update entry');
    }
  };

  const handleDelete = async (entryId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      await axios.delete(`/api/journal/${entryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setEntries(entries.filter(entry => entry._id !== entryId));
      console.log('Entry deleted successfully');
    } catch (error) {
      console.error('Error deleting entry:', error);
      setError('Failed to delete entry');
    }
  };

  const startEditing = (entry: JournalEntry) => {
    setEditingEntry(entry._id);
    setEditContent(entry.content);
    setEditTitle(entry.title);
  };

  const userEntries = entries.filter(entry => entry.userId === user?._id);

  console.log('Current entries:', entries);
  console.log('Current user:', user?._id);
  console.log('Filtered entries:', userEntries);

  // Add axios interceptor to handle token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <Book className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          Please login to access your journal
        </h2>
        <p className="text-gray-600">
          Your personal journal is waiting for your thoughts and reflections
        </p>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto ${isDarkMode ? '' : 'light-gradient'}`}>
      <h1 className={`heading-primary text-body ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        My Journal
      </h1>
      
      {/* Entry Form */}
      <form onSubmit={handleSubmit} className={`mb-8 p-6 rounded-lg ${isDarkMode ? 'dark-theme-card' : 'light-theme-card'}`}>
        <input
          type="text"
          value={newEntry.title}
          onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
          placeholder="Entry Title"
          className={`w-full mb-4 p-3 rounded-md focus:ring-2 focus:ring-purple-400 
            ${isDarkMode ? 'dark-theme-input' : 'light-theme-input'}`}
        />
        <textarea
          value={newEntry.content}
          onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
          placeholder="Write your thoughts..."
          className={`w-full mb-4 p-3 rounded-md focus:ring-2 focus:ring-purple-400 h-32
            ${isDarkMode ? 'dark-theme-input' : 'light-theme-input'}`}
        />
        <button
          type="submit"
          className={`${isDarkMode ? 'bg-blue-500/30 hover:bg-blue-600/30' : 'bg-purple-500 hover:bg-purple-600'} 
            text-white px-4 py-2 rounded-md transition-colors`}
        >
          Add Entry
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-6">
        {entries.map((entry) => (
          <div key={entry._id} className={`p-6 rounded-lg ${isDarkMode ? 'dark-theme-card' : 'light-theme-card'}`}>
            {editingEntry === entry._id ? (
              <div>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`w-full mb-4 p-3 rounded-md focus:ring-2 focus:ring-purple-400 
                    ${isDarkMode ? 'dark-theme-input' : 'light-theme-input'}`}
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className={`w-full mb-4 p-3 rounded-md focus:ring-2 focus:ring-purple-400 
                    ${isDarkMode ? 'dark-theme-input' : 'light-theme-input'}`}
                />
                <button 
                  onClick={() => handleUpdate(entry._id)} 
                  className={`${isDarkMode ? 'bg-blue-500/30 hover:bg-blue-600/30' : 'bg-purple-500 hover:bg-purple-600'} 
                    text-white px-4 py-2 rounded-md transition-colors`}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-start mb-4">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {entry.title}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditing(entry)}
                    className={`transition-colors bg-gray-500 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-700 px-4 py-2 rounded`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry._id)}
                    className={`transition-colors bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700 px-4 py-2 rounded`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
            <p className="text-gray-700 dark:text-gray-300">{entry.content}</p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Created at: {new Date(entry.date).toLocaleString()}</p>
              {entry.lastModified && <p>Last modified at: {new Date(entry.lastModified).toLocaleString()}</p>}
            </div>
          </div>
        ))}

        {/* No Entries Message */}
        {entries.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No journal entries yet. Start writing your thoughts above!
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;