import React, { useState, useContext } from 'react';
import light from './light.module.css';
import dark from './dark.module.css';
import { colors } from './colors';

// Define ThemeContext
type TThemeContext = {
  theme: any;
  toggleTheme: () => void;
  status: string;
  colors: any;
};

const defaultValue = {
  theme: {},
  toggleTheme: () => {},
  status: 'light',
  colors: {},
};

export const ThemeContext = React.createContext<TThemeContext>(defaultValue);

// Define Theme Provider
type TThemeProvider = {
  children?: any;
};
export const ThemeProvider: React.FC<TThemeProvider> = ({ children }) => {
  const [theme, setTheme] = useState('light');

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  const providerValue = {
    //theme: themes[theme as keyof typeof themes],
    theme: theme === 'light' ? light : dark,
    toggleTheme,
    status: theme === 'light' ? 'light' : 'dark',
    colors: colors,
  };

  //console.log('themeprovider: ', providerValue, light, dark);
  return <ThemeContext.Provider value={providerValue}>{children}</ThemeContext.Provider>;
};

// Define Custom Hook
export const useThemeContext = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return theme;
};
