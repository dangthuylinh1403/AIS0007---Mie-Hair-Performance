import React, { useState, useEffect } from 'react';
import { XIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';
import { TimeEntry } from '../types';

interface TimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Partial<TimeEntry>) => void;
  entry: TimeEntry | Partial<TimeEntry> | null;
}

const TimeEntryModal: React.FC<TimeEntryModalProps> = ({ isOpen, onClose, onSave, entry }) => {
  const { t } = useSettings();
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Converts an ISO string to a YYYY-MM-DD string for date inputs
  const toYYYYMMDD = (isoString: string | null | undefined) => {
    if (!isoString) return '';
    try {
        const d = new Date(isoString);
        if (isNaN(d.getTime())) return '';
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch { return ''; }
  };

  const toHHMM = (isoString: string | null | undefined) => {
      if (!isoString) return '';
      try {
          const d = new Date(isoString);
          if (isNaN(d.getTime())) return '';
          const hours = String(d.getHours()).padStart(2, '0');
          const minutes = String(d.getMinutes()).padStart(2, '0');
          return `${hours}:${minutes}`;
      } catch { return ''; }
  };

  useEffect(() => {
    if (isOpen) {
        if(entry && entry.start_time) {
            setDate(toYYYYMMDD(entry.start_time));
            setStartTime(toHHMM(entry.start_time));
            setEndTime(toHHMM(entry.end_time));
        } else {
            // Defaults for new entry
            const today = new Date();
            setDate(toYYYYMMDD(today.toISOString()));
            setStartTime('09:00');
            setEndTime('17:00');
        }
    }
  }, [entry, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && startTime) {
      // The `date` state is already in 'YYYY-MM-DD' format from the date input
      const startDateTime = new Date(`${date}T${startTime}`);
      
      if (isNaN(startDateTime.getTime())) {
        console.error("Invalid date created from inputs");
        return;
      }
      
      const start_time_iso = startDateTime.toISOString();
      let end_time_iso = null;
      
      if (endTime) {
          const endDateTime = new Date(`${date}T${endTime}`);
          if (!isNaN(endDateTime.getTime())) {
             end_time_iso = endDateTime.toISOString();
          }
      }
      
      onSave({
        ...entry,
        start_time: start_time_iso,
        end_time: end_time_iso,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="entry-modal-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out animate-fadeInUp"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
            <div className="p-6 relative">
                <button 
                    type="button"
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10"
                    aria-label={t.close}
                >
                    <XIcon size={24} />
                </button>
                <h2 id="entry-modal-title" className="text-2xl font-bold text-gray-800 dark:text-gray-100">{entry && 'id' in entry ? t.editEntry : t.addEntry}</h2>
                
                <div className="mt-6 space-y-4">
                     <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.date}</label>
                        <input 
                            type="date"
                            id="date" 
                            value={date} 
                            onChange={e => setDate(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm" />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.startTime}</label>
                            <input type="time" id="startTime" value={startTime} onChange={e => setStartTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.endTime} (Optional)</label>
                            <input type="time" id="endTime" value={endTime} onChange={e => setEndTime(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 flex justify-end items-center space-x-3 rounded-b-2xl">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 shadow-sm transition-colors">{t.cancel}</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-md shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none">{t.save}</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default TimeEntryModal;
