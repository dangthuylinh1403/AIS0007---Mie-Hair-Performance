import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useSettings } from '../context/SettingsContext';
import type { Profile, TimeEntry, DailyNote, ChartDayData } from '../types';
import { PlusIcon, EditIcon, TrashIcon, ClockIcon, BriefcaseIcon, BarChartIcon, ClipboardListIcon, ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, DocumentTextIcon, PaperclipIcon } from './Icons';
import TimeEntryModal from './TimeEntryModal';
import MonthlyChart from './MonthlyChart';
import EditEmployeeModal from './EditEmployeeModal';
import DailyNoteModal from './DailyNoteModal';
import { SummaryHeader } from './SummaryHeader';

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

// Local Calendar Components (copied from EmployeeDashboard for reuse)
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
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{t.dayNames.map(day => <div key={day}>{day}</div>)}</div>
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
                            <div className="p-2 flex justify-start items-start h-7"><span className={`font-semibold text-xs ${isToday ? 'text-white bg-[var(--accent-color)] rounded-full w-5 h-5 flex items-center justify-center' : 'text-gray-800 dark:text-gray-200'}`}>{dayNumber}</span></div>
                            <div className="flex-grow flex items-center justify-center">
                                <button onClick={() => onOpenNoteModal(day)} className="p-2 rounded-full transition-colors hover:bg-gray-200/70 dark:hover:bg-gray-700/70" aria-label={dayNote ? `View note for day ${dayNumber}` : `No note for day ${dayNumber}`}>
                                    {dayNote ? (<div className="relative"><DocumentTextIcon size={24} className="text-[var(--accent-color)]" />{dayNote.file_url && <PaperclipIcon size={10} className="absolute -top-1 -right-1 text-white bg-[var(--accent-color)] dark:bg-[var(--accent-color-dark)] rounded-full p-0.5 ring-2 ring-white dark:ring-gray-800" />}</div>) : (<PlusIcon size={20} className="text-gray-400 opacity-0" />)}
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

const AdminDashboard: React.FC = () => {
    const { t } = useSettings();
    const [employees, setEmployees] = useState<Profile[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState<Profile | null>(null);

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from('profiles').select('*').order('full_name', { ascending: true });
        if (error) console.error("Error fetching employees:", error);
        else setEmployees(data || []);
        setLoading(false);
    }, []);

    useEffect(() => { fetchEmployees(); }, [fetchEmployees]);
    
    const openEditModal = (employee: Profile) => {
        setEmployeeToEdit(employee);
        setIsEditModalOpen(true);
    };

    const handleSaveEmployeeProfile = async (updatedProfile: Profile) => {
        const { error } = await supabase.from('profiles').update({ full_name: updatedProfile.full_name, avatar_url: updatedProfile.avatar_url, role: updatedProfile.role }).eq('id', updatedProfile.id);
        if (error) {
            console.error("Error updating employee profile:", error);
        } else {
            setIsEditModalOpen(false);
            setEmployeeToEdit(null);
            fetchEmployees();
            if(selectedEmployee?.id === updatedProfile.id) setSelectedEmployee(updatedProfile);
        }
    };
    
    return (
        <div className="w-full animate-fadeInUp">
            <h1 className="text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] pb-2">{t.adminDashboard}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 bg-white dark:bg-gray-800/50 rounded-lg shadow-md p-4">
                    <h2 className="font-bold text-lg mb-4">{t.allEmployees}</h2>
                     {loading ? <p>Loading...</p> : (
                        <ul className="space-y-1 max-h-96 lg:max-h-[calc(100vh-250px)] overflow-y-auto">
                            <li><button onClick={() => setSelectedEmployee(null)} className={`w-full text-left p-2 rounded-md transition-colors text-sm font-semibold flex items-center gap-3 ${!selectedEmployee ? 'bg-[var(--accent-color)] text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}><BarChartIcon size={20} /><span>{t.overallSummary}</span></button></li>
                            <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>
                            {employees.map(emp => (
                                <li key={emp.id} className="group">
                                    <div className="flex items-center"><button onClick={() => setSelectedEmployee(emp)} className={`flex-grow text-left p-2 rounded-md transition-colors text-sm flex items-center gap-3 ${selectedEmployee?.id === emp.id ? 'bg-[var(--accent-color)] text-white font-semibold' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{emp.avatar_url ? <img src={emp.avatar_url} alt={emp.full_name || 'avatar'} className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">{(emp.full_name || '?').charAt(0).toUpperCase()}</div>}<span className="truncate">{emp.full_name || emp.id}</span></button><button onClick={() => openEditModal(emp)} className="p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-opacity" title={`Edit ${emp.full_name}`}><EditIcon size={14} /></button></div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="lg:col-span-3">
                    {!selectedEmployee ? <OverallView employees={employees} /> : <EmployeeDetailView employee={selectedEmployee} key={selectedEmployee.id} />}
                </div>
            </div>
             {isEditModalOpen && employeeToEdit && <EditEmployeeModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveEmployeeProfile} employee={employeeToEdit} />}
        </div>
    );
};

const EmployeeDetailView: React.FC<{employee: Profile}> = ({ employee }) => {
    const { t, language } = useSettings();
    // State for Summary section
    const [summaryRange, setSummaryRange] = useState<{ start: Date, end: Date }>({ start: new Date(), end: new Date() });
    const [summaryEntries, setSummaryEntries] = useState<TimeEntry[]>([]);
    
    // State for Calendar section
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [calendarEntries, setCalendarEntries] = useState<TimeEntry[]>([]);
    const [dailyNotes, setDailyNotes] = useState<DailyNote[]>([]);

    const [loading, setLoading] = useState(true);
    const [isTimeEntryModalOpen, setIsTimeEntryModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<TimeEntry | Partial<TimeEntry> | null>(null);

    // Note Modal State
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [selectedDateForNote, setSelectedDateForNote] = useState<Date | null>(null);
    const [activeNote, setActiveNote] = useState<DailyNote | null>(null);


    const timeZone = 'Asia/Ho_Chi_Minh';
    const timeFormatter = useMemo(() => new Intl.DateTimeFormat(language, { hour: '2-digit', minute: '2-digit', timeZone }), [language, timeZone]);
    const dateTimeFormatter = useMemo(() => new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short', timeZone }), [language, timeZone]);
    const ymdFormatter = useMemo(() => new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone }), [timeZone]);

    const fetchCalendarData = useCallback(async (userId: string, date: Date) => {
        setLoading(true);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        const [entriesResult, notesResult] = await Promise.all([
             supabase.from('time_entries').select('*').eq('user_id', userId).gte('start_time', startOfMonth.toISOString()).lt('start_time', endOfMonth.toISOString()).order('start_time', { ascending: false }),
             supabase.from('daily_notes').select('*').eq('user_id', userId).gte('date', ymdFormatter.format(startOfMonth)).lte('date', ymdFormatter.format(endOfMonth))
        ]);

        if (entriesResult.error) console.error("Error fetching calendar entries:", entriesResult.error);
        else setCalendarEntries(entriesResult.data || []);
        
        if (notesResult.error) console.error("Error fetching daily notes:", notesResult.error);
        else setDailyNotes(notesResult.data || []);
        
        setLoading(false);
    }, [ymdFormatter]);

     const fetchSummaryData = useCallback(async (userId: string, start: Date, end: Date) => {
        const { data, error } = await supabase.from('time_entries').select('*').eq('user_id', userId).gte('start_time', start.toISOString()).lt('start_time', end.toISOString());
        if (error) console.error("Error fetching summary entries:", error);
        else setSummaryEntries(data || []);
    }, []);

    useEffect(() => { fetchSummaryData(employee.id, summaryRange.start, summaryRange.end); }, [employee.id, summaryRange, fetchSummaryData]);
    useEffect(() => { fetchCalendarData(employee.id, calendarDate); }, [employee.id, calendarDate, fetchCalendarData]);

    const onRangeUpdate = useCallback(({start, end}: {start: Date, end: Date}) => setSummaryRange({start, end}), []);
    const onCustomMonthChange = useCallback((newDate: Date) => {
        setSummaryRange({
            start: new Date(newDate.getFullYear(), newDate.getMonth(), 1),
            end: new Date(newDate.getFullYear(), newDate.getMonth() + 1, 1),
        });
        setCalendarDate(newDate);
    }, []);

    const handleSaveEntry = async (entry: Partial<TimeEntry>) => {
        const entryToSave = { ...entry, user_id: employee.id };
        const { error } = (entry as TimeEntry).id ? await supabase.from('time_entries').update(entryToSave).eq('id', (entry as TimeEntry).id) : await supabase.from('time_entries').insert(entryToSave);
        if (error) console.error("Error saving entry:", error);
        else {
            fetchCalendarData(employee.id, calendarDate);
            fetchSummaryData(employee.id, summaryRange.start, summaryRange.end);
            setIsTimeEntryModalOpen(false);
            setEditingEntry(null);
        }
    };
    
    const handleOpenNoteModal = (date: Date) => {
        setSelectedDateForNote(date);
        const dateYMD = ymdFormatter.format(date);
        setActiveNote(dailyNotes.find(n => n.date === dateYMD) || null);
        setIsNoteModalOpen(true);
    };
    
    return (
        <div className="space-y-6">
            <SummaryHeader onRangeUpdate={onRangeUpdate} onCustomMonthChange={onCustomMonthChange} customMonthDate={calendarDate} title={t.timeEntriesFor(employee.full_name || '...')} />
            <MonthlySummary entries={summaryEntries} />
            <MonthlyChart entries={summaryEntries} currentDate={summaryRange.start} timeFormatter={timeFormatter} dateTimeFormatter={dateTimeFormatter} />
            <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-md p-4 mt-6">
                <div className="flex justify-between items-center">
                    <CalendarHeader currentDate={calendarDate} onPrevMonth={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))} onNextMonth={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))} onSetToday={() => setCalendarDate(new Date())} />
                    <button onClick={() => { setEditingEntry(null); setIsTimeEntryModalOpen(true); }} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-md hover:scale-105 transition-transform"><PlusIcon size={16}/> {t.addEntry}</button>
                </div>
                <CalendarGrid currentDate={calendarDate} entries={calendarEntries} notes={dailyNotes} loading={loading} onEditEntry={(entry) => { setEditingEntry(entry); setIsTimeEntryModalOpen(true); }} onOpenNoteModal={handleOpenNoteModal} dateTimeFormatter={dateTimeFormatter} timeFormatter={timeFormatter} ymdFormatter={ymdFormatter} />
            </div>
            {isTimeEntryModalOpen && <TimeEntryModal isOpen={isTimeEntryModalOpen} onClose={() => setIsTimeEntryModalOpen(false)} onSave={handleSaveEntry} entry={editingEntry as TimeEntry | null} />}
            {isNoteModalOpen && selectedDateForNote && <DailyNoteModal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} onSave={async () => {}} onDelete={async () => {}} note={activeNote} date={selectedDateForNote} isSaving={false} readOnly={true} />}
        </div>
    );
}

const OverallView: React.FC<{employees: Profile[]}> = ({ employees }) => {
    const { t } = useSettings();
    const [allEntries, setAllEntries] = useState<TimeEntry[]>([]);
    const [dateRange, setDateRange] = useState<{ start: Date, end: Date }>({ start: new Date(), end: new Date() });
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState<{ key: keyof EmployeeStat; direction: 'asc' | 'desc' }>({ key: 'hours', direction: 'desc' });

    type EmployeeStat = { profile: Profile; hours: number; shifts: number; days: number; avgHours: number };

    const fetchAllTimeEntries = useCallback(async (start: Date, end: Date) => {
        setLoading(true);
        const { data, error } = await supabase.from('time_entries').select('*').gte('start_time', start.toISOString()).lt('start_time', end.toISOString());
        if (error) console.error("Error fetching all entries:", error);
        else setAllEntries(data || []);
        setLoading(false);
    }, []);

    const onRangeUpdate = useCallback(({start, end}: {start: Date, end: Date}) => setDateRange({start, end}), []);
    
    useEffect(() => {
        const start = new Date(dateRange.start.getFullYear(), dateRange.start.getMonth(), 1);
        const end = new Date(dateRange.start.getFullYear(), dateRange.start.getMonth() + 1, 1);
        fetchAllTimeEntries(start, end);
    }, [dateRange, fetchAllTimeEntries]);
    
    const onCustomMonthChange = useCallback((newDate: Date) => {
        setDateRange({
            start: new Date(newDate.getFullYear(), newDate.getMonth(), 1),
            end: new Date(newDate.getFullYear(), newDate.getMonth() + 1, 1),
        });
    }, []);


    const employeeStats = useMemo<EmployeeStat[]>(() => {
        const statsMap = new Map<string, { profile: Profile; hours: number; shifts: number; workDays: Set<string> }>();
        employees.forEach(emp => { statsMap.set(emp.id, { profile: emp, hours: 0, shifts: 0, workDays: new Set() }); });
        allEntries.forEach(entry => {
            if (entry.end_time) {
                const stat = statsMap.get(entry.user_id);
                if (stat) {
                    const hours = calculateHours(entry.start_time, entry.end_time);
                    if (hours > 0) {
                        stat.hours += hours;
                        stat.shifts += 1;
                        stat.workDays.add(new Date(entry.start_time).toISOString().split('T')[0]);
                    }
                }
            }
        });
        return Array.from(statsMap.values()).map(s => {
            const days = s.workDays.size;
            return { profile: s.profile, hours: s.hours, shifts: s.shifts, days, avgHours: days > 0 ? s.hours / days : 0 };
        });
    }, [employees, allEntries]);

    const sortedEmployeeStats = useMemo(() => {
        return [...employeeStats].sort((a, b) => {
            let aValue, bValue;
            if (sortConfig.key === 'profile') {
                aValue = a.profile.full_name || '';
                bValue = b.profile.full_name || '';
            } else {
                aValue = a[sortConfig.key];
                bValue = b[sortConfig.key];
            }
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [employeeStats, sortConfig]);

    const requestSort = (key: keyof EmployeeStat) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const chartData = useMemo<ChartDayData[]>(() => [...employeeStats].sort((a,b) => b.hours - a.hours).filter(stat => stat.hours > 0).map((stat, index) => ({ day: index + 1, totalHours: stat.hours, label: stat.profile.full_name?.split(' ').pop() || stat.profile.id })), [employeeStats]);
    
    const SortableHeader: React.FC<{ sortKey: keyof EmployeeStat; label: string }> = ({ sortKey, label }) => (
        <th className="p-2 cursor-pointer" onClick={() => requestSort(sortKey)}><div className="flex items-center gap-1">{label}{sortConfig.key === sortKey && (sortConfig.direction === 'asc' ? <ChevronUpIcon size={12}/> : <ChevronDownIcon size={12}/>)}</div></th>
    );

    return (
        <div className="space-y-6">
             <SummaryHeader onRangeUpdate={onRangeUpdate} onCustomMonthChange={onCustomMonthChange} customMonthDate={dateRange.start} title={t.overallSummary}/>
            <MonthlySummary entries={allEntries} />
            <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-md p-4">
                <h3 className="font-bold text-lg mb-4 text-gray-700 dark:text-gray-300">{t.employeeLeaderboard}</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm"><thead className="text-left text-gray-500 dark:text-gray-400"><tr><SortableHeader sortKey="profile" label={t.employee} /><SortableHeader sortKey="hours" label={t.totalHoursWorked} /><SortableHeader sortKey="shifts" label={t.totalShifts} /><SortableHeader sortKey="days" label={t.totalWorkDays} /><SortableHeader sortKey="avgHours" label={t.averageHoursPerDay} /></tr></thead><tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                            {loading ? <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr> : sortedEmployeeStats.map(({profile, hours, shifts, days, avgHours}) => (<tr key={profile.id} className="hover:bg-gray-100 dark:hover:bg-gray-700/50"><td className="p-2 font-semibold flex items-center gap-3">{profile.avatar_url ? <img src={profile.avatar_url} alt={profile.full_name} className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm">{(profile.full_name || '?').charAt(0)}</div>}{profile.full_name || profile.id}</td><td className="p-2">{hours.toFixed(2)}</td><td className="p-2">{shifts}</td><td className="p-2">{days}</td><td className="p-2">{avgHours.toFixed(2)}</td></tr>))}</tbody></table>
                </div>
            </div>
            <MonthlyChart data={chartData} currentDate={dateRange.start} xAxisLabel="Employees" />
        </div>
    );
};


const MonthlySummary: React.FC<{ entries: TimeEntry[]; }> = ({ entries }) => {
    const { t } = useSettings();
    const stats = useMemo(() => {
        const dailyHoursMap = new Map<string, number>();
        entries.forEach(entry => {
            if (entry.end_time) {
                const dateStr = new Date(entry.start_time).toISOString().split('T')[0];
                dailyHoursMap.set(dateStr, (dailyHoursMap.get(dateStr) || 0) + calculateHours(entry.start_time, entry.end_time));
            }
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
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, index) => <div key={index} className="bg-white dark:bg-gray-800/50 rounded-lg shadow-md p-4 flex items-center gap-4"><div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">{card.icon}</div><div><p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p><p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{card.value}</p></div></div>)}
            </div>
        </div>
    );
};

export default AdminDashboard;