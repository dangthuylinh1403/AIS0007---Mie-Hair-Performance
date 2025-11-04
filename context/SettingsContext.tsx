import React from 'react';
import { translations } from '../translations';
import { Translation } from '../types';

// Define the shape of the context data
export interface SettingsContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  language: keyof typeof translations;
  setLanguage: (lang: keyof typeof translations) => void;
  t: Translation;
}

// Create the context with an undefined initial value
export const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined);

// Custom hook for consuming the context, which provides better type safety and error handling
export const useSettings = (): SettingsContextType => {
    const context = React.useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};