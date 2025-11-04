
import React, { useState, useEffect, useRef } from 'react';
import { SunIcon, MoonIcon, CheckIcon, SettingsIcon } from './Icons';
import { translations, languageOptions } from '../translations';
import { useSettings } from '../context/SettingsContext';

const SettingsController: React.FC = () => {
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    t
  } = useSettings();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLanguageChange = (langId: keyof typeof translations) => {
    setLanguage(langId);
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-1.5 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white shadow-md hover:shadow-lg transition-all transform hover:scale-110"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={t.settingsAria}
      >
        <SettingsIcon size={18} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 z-50 animate-fadeIn"
          role="menu"
        >
          <div className="p-3 space-y-4">
            {/* Appearance Section */}
            <div className="space-y-3">
              <h3 className="px-1 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">{t.appearanceSettingsAria}</h3>
              
              {/* Light/Dark Toggle */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">{t.themeLabel}</label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <button
                    onClick={() => setTheme('light')}
                    className={`px-3 py-1.5 rounded-md transition-colors flex items-center justify-center gap-2 ${
                      theme === 'light'
                        ? 'bg-[var(--accent-color)] text-white font-semibold'
                        : 'bg-gray-200 dark:bg-gray-700/50 hover:bg-gray-300 dark:hover:bg-gray-600/50'
                    }`}
                  >
                    <SunIcon size={16} /> {t.lightTheme}
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`px-3 py-1.5 rounded-md transition-colors flex items-center justify-center gap-2 ${
                      theme === 'dark'
                        ? 'bg-[var(--accent-color)] text-white font-semibold'
                        : 'bg-gray-200 dark:bg-gray-700/50 hover:bg-gray-300 dark:hover:bg-gray-600/50'
                    }`}
                  >
                    <MoonIcon size={16} /> {t.darkTheme}
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-black/10 dark:border-white/10"></div>

            {/* Language Section */}
            <div className="space-y-1">
               <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-2 px-1">{t.language}</label>
               <div className="space-y-1">
                  {languageOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleLanguageChange(option.id as keyof typeof translations)}
                      className="w-full text-left flex justify-between items-center px-3 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-colors"
                      role="menuitem"
                    >
                      <span>{option.name}</span>
                      {language === option.id && <CheckIcon size={16} className="text-[var(--accent-color)]" />}
                    </button>
                  ))}
                </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
export default SettingsController;