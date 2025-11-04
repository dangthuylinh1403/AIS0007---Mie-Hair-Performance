import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { ChevronDownIcon } from './Icons';

type Preset = 'thisMonth' | 'lastMonth' | 'thisWeek' | 'lastWeek' | 'customMonth';

interface SummaryHeaderProps {
  onRangeUpdate: (range: { start: Date; end: Date }) => void;
  onCustomMonthChange: (date: Date) => void;
  customMonthDate: Date;
  title: string;
}

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear + 1; i >= currentYear - 5; i--) {
        years.push(i);
    }
    return years;
};

export const SummaryHeader: React.FC<SummaryHeaderProps> = ({ onRangeUpdate, onCustomMonthChange, customMonthDate, title }) => {
    const { t, language } = useSettings();
    const [preset, setPreset] = useState<Preset>('thisMonth');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const years = useMemo(generateYears, []);

    const { range, label } = useMemo(() => {
        const now = new Date();
        let start, end;
        let label = '';
        
        switch(preset) {
            case 'thisWeek':
                start = getStartOfWeek(now);
                start.setHours(0, 0, 0, 0);
                end = new Date(start);
                end.setDate(end.getDate() + 7);
                label = t.thisWeek;
                break;
            case 'lastWeek':
                const lastWeekStart = getStartOfWeek(now);
                lastWeekStart.setDate(lastWeekStart.getDate() - 7);
                lastWeekStart.setHours(0, 0, 0, 0);
                start = lastWeekStart;
                end = new Date(start);
                end.setDate(end.getDate() + 7);
                label = t.lastWeek;
                break;
            case 'lastMonth':
                start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                end = new Date(now.getFullYear(), now.getMonth(), 1);
                label = t.lastMonth;
                break;
            case 'customMonth':
                start = new Date(customMonthDate.getFullYear(), customMonthDate.getMonth(), 1);
                end = new Date(customMonthDate.getFullYear(), customMonthDate.getMonth() + 1, 1);
                label = new Intl.DateTimeFormat(language, { month: 'long', year: 'numeric' }).format(customMonthDate);
                break;
            case 'thisMonth':
            default:
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                label = t.thisMonth;
        }
        return { range: { start, end }, label };
    }, [preset, customMonthDate, language, t]);

    useEffect(() => {
        onRangeUpdate(range);
    }, [range, onRangeUpdate]);

    const handleMonthChange = (monthIndex: number) => {
        const newDate = new Date(customMonthDate.getFullYear(), monthIndex, 1);
        setPreset('customMonth');
        onCustomMonthChange(newDate);
    };

    const handleYearChange = (year: number) => {
        const newDate = new Date(year, customMonthDate.getMonth(), 1);
        setPreset('customMonth');
        onCustomMonthChange(newDate);
    };

    const handlePresetChange = (newPreset: Preset) => {
        setPreset(newPreset);
        if (newPreset === 'thisMonth') {
            onCustomMonthChange(new Date());
        }
        setIsDropdownOpen(false);
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const presets: {key: Preset, label: string}[] = [
        { key: 'thisMonth', label: t.thisMonth },
        { key: 'lastMonth', label: t.lastMonth },
        { key: 'thisWeek', label: t.thisWeek },
        { key: 'lastWeek', label: t.lastWeek },
    ];
    
    return (
        <div className="mb-4">
            <h2 className="text-xl font-bold mb-3 text-gray-700 dark:text-gray-300">{title}</h2>
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <label htmlFor="year-select" className="sr-only">{t.year}</label>
                        <select
                            id="year-select"
                            value={customMonthDate.getFullYear()}
                            onChange={(e) => handleYearChange(parseInt(e.target.value))}
                            className="text-sm font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-1.5 pl-3 pr-8 appearance-none"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                     <div className="relative">
                        <label htmlFor="month-select" className="sr-only">{t.month}</label>
                        <select
                            id="month-select"
                            value={customMonthDate.getMonth()}
                            onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                            className="text-sm font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-1.5 pl-3 pr-8 appearance-none"
                        >
                            {t.monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
                        </select>
                    </div>
                </div>
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(o => !o)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                        <span>{label}</span>
                        <ChevronDownIcon size={16} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 animate-fadeIn ring-1 ring-black ring-opacity-5">
                           {presets.map(p => (
                                <button key={p.key} onClick={() => handlePresetChange(p.key)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                                    {p.label}
                                </button>
                           ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};