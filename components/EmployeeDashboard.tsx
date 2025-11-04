import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../lib/supabase';
import type { TimeEntry, DailyNote } from '../types';
import type { Session } from '@supabase/supabase-js';
import { PlayIcon, StopIcon, ClockIcon, BriefcaseIcon, BarChartIcon, ClipboardListIcon, PlusIcon, EditIcon, DocumentTextIcon, PaperclipIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';
import MonthlyChart from './MonthlyChart';
import TimeEntryModal from './TimeEntryModal';
import DailyNoteModal from './DailyNoteModal';
import { SummaryHeader } from './SummaryHeader';


interface EmployeeDashboardProps {
    session: Session | null;
}

const calculateHours = (startISO: string, endISO: string | null) => {
    if (!endISO) return 0;
    const startDate = new Date(startISO);
    const endDate = new Date(endISO);
    const durationMs = endDate.getTime() - startDate.getTime();
    if (durationMs < 0) return 0;
    return durationMs / (1000 * 60 * 60);
};

const formatDuration = (hours: number) => {
    const totalMinutes = Math.floor(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
};

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ session }) => {
    const { t, language } = useSettings();
    const [calendarDate, setCalendarDate] = useState(new Date()); // For calendar grid navigation
    const [summaryRange, setSummaryRange] = useState<{ start: Date, end: Date }>({ start: new Date(), end: new Date() });

    const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
    const [dailyNotes, setDailyNotes] = useState<DailyNote[]>([]);
    const [activeShift, setActiveShift] = useState<TimeEntry | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState(true);
    
    // Time Entry Modal State
    const [isTimeEntryModalOpen, setIsTimeEntryModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<TimeEntry | Partial<TimeEntry> | null>(null);
    
    // Daily Note Modal State
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [selectedDateForNote, setSelectedDateForNote] = useState<Date | null>(null);
    const [activeNote, setActiveNote] = useState<DailyNote | null>(null);
    const [isSavingNote, setIsSavingNote] = useState(false);
    const [noteModalError, setNoteModalError] = useState<string | null>(null);
    
    const timeZone = 'Asia/Ho_Chi_Minh';

    const timeFormatter = useMemo(() => new Intl.DateTimeFormat(language, { hour: '2-digit', minute: '2-digit', timeZone }), [language, timeZone]);
    const dateTimeFormatter = useMemo(() => new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short', timeZone }), [language, timeZone]);
    const ymdFormatter = useMemo(() => new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone }), [timeZone]);

    const fetchData = useCallback(async (user_id: string, start: Date, end: Date) => {
        setLoading(true);

        const startISO = start.toISOString();
        const endISO = end.toISOString();
        
        const startYMD = ymdFormatter.format(start);
        const endYMD = ymdFormatter.format(end);

        const [entriesResult, notesResult] = await Promise.all([
            supabase.from('time_entries').select('*').eq('user_id', user_id).gte('start_time', startISO).lt('start_time', endISO).order('start_time', { ascending: true }),
            supabase.from('daily_notes').select('*').eq('user_id', user_id).gte('date', startYMD).lte('date', endYMD)
        ]);

        const { data: entriesData, error: entriesError } = entriesResult;
        if (entriesError) {
            console.error("Error fetching time entries:", entriesError.message);
            setTimeEntries([]);
        } else {
            setTimeEntries(entriesData);
            const currentActiveShift = entriesData.find(entry => entry.end_time === null);
            setActiveShift(currentActiveShift || null);
        }

        const { data: notesData, error: notesError } = notesResult;
        if (notesError) {
            console.error("Error fetching daily notes:", notesError.message);
            setDailyNotes([]);
        } else {
            setDailyNotes(notesData || []);
        }

        setLoading(false);
    }, [ymdFormatter]);
    
     useEffect(() => {
        const startOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
        const endOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
        if (session) {
            fetchData(session.user.id, startOfMonth, endOfMonth);
        } else {
            setTimeEntries([]);
            setDailyNotes([]);
            setActiveShift(null);
            setLoading(false);
        }
    }, [session, calendarDate, fetchData]);


    useEffect(() => {
        let timerId: number;
        if (activeShift) {
            timerId = window.setInterval(() => setCurrentTime(new Date()), 1000);
        }
        return () => window.clearInterval(timerId);
    }, [activeShift]);
    
    const refreshData = () => {
         if (session) {
            const startOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
            const endOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
            fetchData(session.user.id, startOfMonth, endOfMonth);
        }
    }

    // Shift Handlers
    const handleStartShift = async () => {
        if (!session) return;
        const now = new Date();
        const { error } = await supabase.from('time_entries').insert({ user_id: session.user.id, start_time: now.toISOString() }).select().single();
        if (error) console.error("Error starting shift:", error);
        else refreshData();
    };

    const handleEndShift = async () => {
        if (!session || !activeShift) return;
        const { error } = await supabase.from('time_entries').update({ end_time: new Date().toISOString() }).eq('id', activeShift.id);
        if (error) console.error("Error ending shift:", error);
        else refreshData();
    };

    // Time Entry Modal Handlers
    const handleSaveEntry = async (entry: Partial<TimeEntry>) => {
        if (!session) return;
        const { error } = (entry as TimeEntry).id
            ? await supabase.from('time_entries').update({ ...entry, user_id: session.user.id }).eq('id', (entry as TimeEntry).id)
            : await supabase.from('time_entries').insert({ ...entry, user_id: session.user.id });
        if (error) console.error("Error saving entry:", error);
        else {
            refreshData();
            setIsTimeEntryModalOpen(false);
            setEditingEntry(null);
        }
    };
    const openAddEntryModal = (date?: Date) => {
        const targetDate = date || new Date();
        const start = new Date(targetDate); start.setHours(9, 0, 0, 0);
        const end = new Date(targetDate); end.setHours(17, 0, 0, 0);
        setEditingEntry({ start_time: start.toISOString(), end_time: end.toISOString() });
        setIsTimeEntryModalOpen(true);
    };
    const openEditEntryModal = (entry: TimeEntry) => {
        setEditingEntry(entry);
        setIsTimeEntryModalOpen(true);
    };
    
    // Daily Note Modal Handlers
    const handleOpenNoteModal = (date: Date) => {
        setSelectedDateForNote(date);
        const dateYMD = ymdFormatter.format(date);
        const existingNote = dailyNotes.find(n => n.date === dateYMD);
        setActiveNote(existingNote || null);
        setNoteModalError(null);
        setIsNoteModalOpen(true);
    };
    const handleCloseNoteModal = () => {
        setIsNoteModalOpen(false);
        setSelectedDateForNote(null);
        setActiveNote(null);
        setNoteModalError(null);
    };

    const handleSaveNote = async ({ noteText, file, removeExistingFile }: { noteText: string; file: File | null; removeExistingFile: boolean }) => {
        if (!session || !selectedDateForNote) return;
        setIsSavingNote(true);
        setNoteModalError(null);
        let file_url = activeNote?.file_url || null;

        try {
            if ((removeExistingFile || file) && activeNote?.file_url) {
                const oldFilePath = activeNote.file_url.split('/daily_attachments/')[1];
                await supabase.storage.from('daily_attachments').remove([oldFilePath]);
                file_url = null;
            }
            if (file) {
                const filePath = `${session.user.id}/${ymdFormatter.format(selectedDateForNote)}/${Date.now()}-${file.name}`;
                const { error: uploadError } = await supabase.storage.from('daily_attachments').upload(filePath, file);
                if (uploadError) throw uploadError;
                const { data: urlData } = supabase.storage.from('daily_attachments').getPublicUrl(filePath);
                file_url = urlData.publicUrl;
            }

            const noteToSave = { user_id: session.user.id, date: ymdFormatter.format(selectedDateForNote), note: noteText, file_url: file_url };
            const { error } = await supabase.from('daily_notes').upsert(noteToSave, { onConflict: 'user_id, date' });
            if (error) throw error;
            
            refreshData();
            handleCloseNoteModal();
        } catch(error: any) {
            console.error("Error saving note:", error.message);
            setNoteModalError(error.message);
        } finally {
            setIsSavingNote(false);
        }
    };
    
    const handleDeleteNote = async () => {
        if (!session || !activeNote) return;
        setIsSavingNote(true);
        setNoteModalError(null);
        try {
            if (activeNote.file_url) {
                const filePath = activeNote.file_url.split('/daily_attachments/')[1];
                await supabase.storage.from('daily_attachments').remove([filePath]);
            }
            const { error } = await supabase.from('daily_notes').delete().eq('id', activeNote.id);
            if (error) throw error;

            refreshData();
            handleCloseNoteModal();
        } catch(error: any) {
             console.error("Error deleting note:", error.message);
             setNoteModalError(error.message);
        } finally {
            setIsSavingNote(false);
        }
    };

    const onRangeUpdate = useCallback(({start, end}: {start: Date, end: Date}) => {
        setSummaryRange({start, end});
    }, []);
    
    const onCustomMonthChange = useCallback((newDate: Date) => {
        setCalendarDate(newDate);
    }, []);

    const entriesForSummary = useMemo(() => {
        const startMs = summaryRange.start.getTime();
        const endMs = summaryRange.end.getTime();
        return timeEntries.filter(e => {
            const entryStartMs = new Date(e.start_time).getTime();
            return entryStartMs >= startMs && entryStartMs < endMs;
        });
    }, [timeEntries, summaryRange]);


    const renderActionPanel = () => {
        if (!session) return <div className="text-center p-8 bg-gray-100 dark:bg-gray-800/50 rounded-lg"><p className="font-semibold">{t.signInToTrackTime}</p></div>;
        if (activeShift) {
            const durationMs = currentTime.getTime() - new Date(activeShift.start_time).getTime();
            const hours = String(Math.floor(durationMs / 3600000)).padStart(2, '0');
            const minutes = String(Math.floor((durationMs % 3600000) / 60000)).padStart(2, '0');
            const seconds = String(Math.floor((durationMs % 60000) / 1000)).padStart(2, '0');
            return (
                <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 animate-fadeIn">
                    <div className="text-center sm:text-left">
                        <p className="font-bold text-lg text-amber-800 dark:text-amber-200">{t.shiftInProgress}</p>
                        <p className="text-sm text-amber-700 dark:text-amber-300">{t.shiftStartedAt(timeFormatter.format(new Date(activeShift.start_time)))}</p>
                        <p className="text-sm font-mono mt-1 text-amber-700 dark:text-amber-300"><span className="font-sans font-medium">{t.currentDuration}:</span> {`${hours}:${minutes}:${seconds}`}</p>
                    </div>
                    <button onClick={handleEndShift} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg transform transition-transform hover:scale-105">
                        <StopIcon size={18} /> {t.endShift}
                    </button>
                </div>
            );
        }
        return (
            <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg flex flex-col sm:flex-row justify-center items-center gap-4">
                <button onClick={handleStartShift} disabled={!!activeShift} className="flex items-center gap-3 px-8 py-3 font-bold text-lg text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg transform transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                    <PlayIcon size={20} /> {t.startShift}
                </button>
                 <button onClick={() => openAddEntryModal()} className="flex items-center gap-2 px-6 py-3 font-semibold text-[var(--accent-color)] bg-white dark:bg-gray-700 rounded-full shadow-md transform transition-transform hover:scale-105">
                    <PlusIcon size={18}/> {t.addEntry}
                </button>
            </div>
        );
    };

    return (
        <div className="w-full animate-fadeInUp">
            <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] dark:from-[var(--accent-color-dark)] dark:to-[var(--gradient-to)] pb-2">
                {t.employeeDashboard}
            </h1>
            <div className="mb-6">{renderActionPanel()}</div>
            <SummaryHeader onRangeUpdate={onRangeUpdate} onCustomMonthChange={onCustomMonthChange} customMonthDate={calendarDate} title={t.monthlySummary} />
            <MonthlySummary entries={entriesForSummary} />
            {session && <MonthlyChart entries={entriesForSummary} currentDate={summaryRange.start} timeFormatter={timeFormatter} dateTimeFormatter={dateTimeFormatter} />}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-md p-4 mt-6">
                <CalendarHeader currentDate={calendarDate} onPrevMonth={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))} onNextMonth={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))} onSetToday={() => setCalendarDate(new Date())} />
                <CalendarGrid currentDate={calendarDate} entries={timeEntries} notes={dailyNotes} loading={loading} onEditEntry={openEditEntryModal} onOpenNoteModal={handleOpenNoteModal} dateTimeFormatter={dateTimeFormatter} timeFormatter={timeFormatter} ymdFormatter={ymdFormatter} />
            </div>
            {isTimeEntryModalOpen && <TimeEntryModal isOpen={isTimeEntryModalOpen} onClose={() => setIsTimeEntryModalOpen(false)} onSave={handleSaveEntry} entry={editingEntry as TimeEntry | null} />}
            {isNoteModalOpen && selectedDateForNote && <DailyNoteModal isOpen={isNoteModalOpen} onClose={handleCloseNoteModal} onSave={handleSaveNote} onDelete={handleDeleteNote} note={activeNote} date={selectedDateForNote} isSaving={isSavingNote} error={noteModalError} />}
        </div>
    );
};

const CalendarHeader: React.FC<{ currentDate: Date; onPrevMonth: () => void; onNextMonth: () => void; onSetToday: () => void; }> = ({ currentDate, onPrevMonth, onNextMonth, onSetToday }) => {
    const { t, language } = useSettings();
    const monthYear = new Intl.DateTimeFormat(language, { year: 'numeric', month: 'long', timeZone: 'Asia/Ho_Chi_Minh' }).format(currentDate);

    return (
        <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t.dashboardTitle}</h2>
            <div className="flex items-center gap-4">
                <button onClick={onPrevMonth} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><ChevronLeftIcon/></button>
                <h3 className="text-lg font-bold text-center w-36">{monthYear}</h3>
                <button onClick={onNextMonth} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><ChevronRightIcon/></button>
            </div>
            <button onClick={onSetToday} className="px-3 py-1 text-sm font-semibold rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">{t.today}</button>
        </div>
    );
};

const CalendarGrid: React.FC<{ currentDate: Date; entries: TimeEntry[]; notes: DailyNote[]; loading: boolean; onEditEntry: (entry: TimeEntry) => void; onOpenNoteModal: (date: Date) => void; timeFormatter: Intl.DateTimeFormat; dateTimeFormatter: Intl.DateTimeFormat; ymdFormatter: Intl.DateTimeFormat; }> = ({ currentDate, entries, notes, loading, onEditEntry, onOpenNoteModal, timeFormatter, dateTimeFormatter, ymdFormatter }) => {
    const { t } = useSettings();

    const daysInMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = new Date(Date.UTC(year, month, 1));
        const days = [];
        const firstDayUTC = date.getUTCDay();
        for (let i = 0; i < firstDayUTC; i++) days.push(null);
        while (date.getUTCMonth() === month) {
            days.push(new Date(date));
            date.setUTCDate(date.getUTCDate() + 1);
        }
        return days;
    }, [currentDate]);

    if (loading) return <div className="text-center p-10 text-gray-500">Loading entries...</div>;

    const todayYMD = ymdFormatter.format(new Date());

    return (
        <div>
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                {t.dayNames.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`} className="min-h-[6rem]"></div>;
                    
                    const dayYMD = ymdFormatter.format(day);
                    const dayNumber = day.getUTCDate();
                    
                    const dailyEntries = entries.filter(e => ymdFormatter.format(new Date(e.start_time)) === dayYMD);
                    const totalHoursWorked = dailyEntries.reduce((sum, entry) => sum + calculateHours(entry.start_time, entry.end_time), 0);
                    const dayNote = notes.find(n => n.date === dayYMD);
                    const isToday = dayYMD === todayYMD;

                    const borderClass = isToday ? 'border-[var(--accent-color)]' : 'border-gray-200 dark:border-gray-700';
                    const hoursDisplayClass = 'bg-sky-100/60 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300';

                    return (
                        <div key={dayYMD} className={`group relative min-h-[6rem] rounded-lg text-left flex flex-col transition-all duration-300 ease-in-out border hover:shadow-lg hover:scale-105 hover:shadow-[var(--accent-color)]/20 ${borderClass}`}>
                            <div className="p-2 flex justify-start items-start h-7">
                                <span className={`font-semibold text-xs ${isToday ? 'text-white bg-[var(--accent-color)] rounded-full w-5 h-5 flex items-center justify-center' : 'text-gray-800 dark:text-gray-200'}`}>{dayNumber}</span>
                            </div>
                            <div className="flex-grow flex items-center justify-center">
                                <button onClick={() => onOpenNoteModal(day)} className="p-2 rounded-full transition-colors hover:bg-gray-200/70 dark:hover:bg-gray-700/70" aria-label={dayNote ? `View or edit note for day ${dayNumber}` : `Add note for day ${dayNumber}`}>
                                    {dayNote ? (<div className="relative"><DocumentTextIcon size={24} className="text-[var(--accent-color)]" />{dayNote.file_url && <PaperclipIcon size={10} className="absolute -top-1 -right-1 text-white bg-[var(--accent-color)] dark:bg-[var(--accent-color-dark)] rounded-full p-0.5 ring-2 ring-white dark:ring-gray-800" />}</div>) : (<PlusIcon size={20} className="text-gray-400 transition-opacity opacity-0 group-hover:opacity-100" />)}
                                </button>
                            </div>
                            <div className={`p-1 text-center cursor-pointer group/tooltip h-7`}>
                                {dailyEntries.length > 0 && (
                                    <>
                                        <p className={`text-xs font-bold ${hoursDisplayClass} rounded-md py-0.5`}>{totalHoursWorked.toFixed(2)} {t.totalHours}</p>
                                        <div className="absolute bottom-full mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded-lg shadow-lg p-3 z-10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none">
                                            <div className="flex justify-between items-center font-bold border-b border-gray-600 pb-1 mb-2"><h4>Shifts on {dateTimeFormatter.format(day).split(',')[0]}</h4><button onClick={(e) => { e.stopPropagation(); onEditEntry(dailyEntries[0]); }} className="p-0.5 rounded-full hover:bg-gray-600 pointer-events-auto"><EditIcon size={12}/></button></div>
                                            <ul className="space-y-1">{dailyEntries.map((entry) => <li key={entry.id}><span>{timeFormatter.format(new Date(entry.start_time))} - {entry.end_time ? timeFormatter.format(new Date(entry.end_time)) : 'Now'}</span><span className="font-semibold ml-2">({formatDuration(calculateHours(entry.start_time, entry.end_time))})</span></li>)}</ul>
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800"></div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const MonthlySummary: React.FC<{ entries: TimeEntry[]; }> = ({ entries }) => {
    const { t } = useSettings();
    const stats = useMemo(() => {
        const dailyHoursMap = new Map<string, number>();
        entries.forEach(entry => {
            const dateStr = new Date(entry.start_time).toISOString().split('T')[0];
            dailyHoursMap.set(dateStr, (dailyHoursMap.get(dateStr) || 0) + calculateHours(entry.start_time, entry.end_time));
        });
        const totalHours = Array.from(dailyHoursMap.values()).reduce((sum, h) => sum + h, 0);
        const totalDays = dailyHoursMap.size;
        const totalShifts = entries.filter(e => e.end_time).length;
        return { totalHours, totalDays, totalShifts, averageHours: totalDays > 0 ? totalHours / totalDays : 0 };
    }, [entries]);

    const statCards = [
        { icon: <ClockIcon className="text-blue-500" />, label: t.totalHoursWorked, value: stats.totalHours.toFixed(2) },
        { icon: <BriefcaseIcon className="text-green-500" />, label: t.totalWorkDays, value: stats.totalDays },
        { icon: <ClipboardListIcon className="text-indigo-500"/>, label: t.totalShifts, value: stats.totalShifts },
        { icon: <BarChartIcon className="text-purple-500" />, label: t.averageHoursPerDay, value: stats.averageHours.toFixed(2) },
    ];
    return (
        <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, index) => <div key={index} className="bg-white dark:bg-gray-800/50 rounded-lg shadow-md p-4 flex items-center gap-4"><div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">{card.icon}</div><div><p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p><p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{card.value}</p></div></div>)}
            </div>
        </div>
    );
};

export default EmployeeDashboard;