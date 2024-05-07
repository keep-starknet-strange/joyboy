// DarkModeToggle.tsx
import React, { useState } from 'react';
import { Switch } from 'react-native';
import { useColorScheme } from 'react-native';

const DarkModeToggle = ({ onToggle }) => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  const toggleSwitch = () => {
    setIsDarkMode(previousState => !previousState);
    onToggle(!isDarkMode);
  };

  return <Switch value={isDarkMode} onValueChange={toggleSwitch} />;
};

export default DarkModeToggle;
