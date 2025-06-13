import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from './NotificationContext';
import { useTheme } from './ThemeContext';

const ShortcutContext = createContext();

export const useShortcut = () => useContext(ShortcutContext);

export const ShortcutProvider = ({ children }) => {
  const navigate = useNavigate();
  const { showInfo } = useNotification();
  const { themeMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check if user is typing in an input field
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      // Alt + H: Go to Home
      if (event.altKey && event.key === 'h') {
        event.preventDefault();
        navigate('/home');
        showInfo('Navigated to Home');
      }

      // Alt + P: Go to Profile
      if (event.altKey && event.key === 'p') {
        event.preventDefault();
        navigate('/profile');
        showInfo('Navigated to Profile');
      }

      // Alt + S: Go to Settings
      if (event.altKey && event.key === 's') {
        event.preventDefault();
        navigate('/settings');
        showInfo('Navigated to Settings');
      }

      // Alt + T: Toggle Theme
      if (event.altKey && event.key === 't') {
        event.preventDefault();
        const newTheme = themeMode === 'light' ? 'dark' : 'light';
        toggleTheme(newTheme);
        showInfo(`Theme changed to ${newTheme}`);
      }

      // Alt + ?: Show Shortcuts Help
      if (event.altKey && event.key === '?') {
        event.preventDefault();
        showInfo(
          'Keyboard Shortcuts: Alt+H (Home), Alt+P (Profile), Alt+S (Settings), Alt+T (Theme), Alt+? (Help)'
        );
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate, showInfo, themeMode, toggleTheme]);

  return (
    <ShortcutContext.Provider value={{}}>
      {children}
    </ShortcutContext.Provider>
  );
};

export default ShortcutContext; 