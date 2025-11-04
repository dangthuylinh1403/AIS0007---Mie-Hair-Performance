import React, { useMemo } from 'react';
import { TimeEntry, ChartDayData } from '../types';
import { useSettings } from '../context/SettingsContext';

interface MonthlyChartProps {
  entries?: TimeEntry[];
  data?: ChartDayData[];
  currentDate: Date;
  xAxisLabel?: string;
  timeFormatter?: Intl.DateTimeFormat;
  dateTimeFormatter?: Intl.DateTimeFormat;
}

const calculateHours = (startISO: string, endISO: string | null): number => {
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

const MonthlyChart: React.FC<MonthlyChartProps> = ({ entries, data, currentDate, xAxisLabel, timeFormatter, dateTimeFormatter }) => {
  const { t } = useSettings();

  const chartData = useMemo<ChartDayData[]>(() => {
    if (data) return data;
    if (!entries) return [];
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dailyData: ChartDayData[] = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, totalHours: 0, entries: [] }));

    entries.forEach(entry => {
        const entryDate = new Date(entry.start_time);
        if (entryDate.getFullYear() === year && entryDate.getMonth() === month) {
            const dayOfMonth = entryDate.getDate();
            const index = dayOfMonth - 1;
            if (dailyData[index]) {
                dailyData[index].totalHours += calculateHours(entry.start_time, entry.end_time);
                dailyData[index].entries?.push(entry);
            }
        }
    });

    return dailyData;
  }, [entries, data, currentDate]);

  const maxHours = Math.max(8, ...chartData.map(d => d.totalHours));
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === currentDate.getFullYear() && today.getMonth() === currentDate.getMonth();
  const currentDay = today.getDate();

  return (
    <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">{t.dailyHoursOverview}</h2>
        <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-md p-4 pt-6">
            <div className="flex" style={{ height: '200px' }}>
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 pr-2 relative w-10 text-right">
                    <span>{Math.ceil(maxHours)}h</span>
                    <span>{Math.ceil(maxHours * 0.5)}h</span>
                    <span>0h</span>
                </div>

                {/* Chart Bars */}
                <div className="flex-1 grid gap-1 border-l border-gray-200 dark:border-gray-700 pl-2" style={{ gridTemplateColumns: `repeat(${chartData.length}, minmax(0, 1fr))`}}>
                    {chartData.map((dayData, index) => {
                        const heightPercentage = maxHours > 0 ? (dayData.totalHours / maxHours) * 100 : 0;
                        const isToday = isCurrentMonth && dayData.day === currentDay;

                        const label = dayData.label || dayData.day.toString();
                        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayData.day);

                        return (
                            <div key={label} className="flex flex-col justify-end items-center group relative">
                                <div
                                    className={`w-full rounded-t-md transition-all duration-300 ease-out ${isToday && !dayData.label ? 'bg-amber-400' : 'bg-gradient-to-t from-[var(--gradient-from)] to-[var(--gradient-to)] group-hover:opacity-80'}`}
                                    style={{ height: `${heightPercentage}%`, minHeight: heightPercentage > 0 ? '2px' : '0' }}
                                ></div>
                                {dayData.totalHours > 0 && (
                                    <div className="absolute bottom-full mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded-lg shadow-lg p-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <div className="font-bold border-b border-gray-600 pb-1 mb-2">
                                        {dayData.label ? dayData.label : (dateTimeFormatter ? dateTimeFormatter.format(dayDate).split(',')[0] : `Day ${dayData.day}`)}: {formatDuration(dayData.totalHours)}
                                        </div>

                                        {dayData.entries && dayData.entries.length > 0 && timeFormatter && (
                                            <ul className="space-y-1 text-left">
                                                {dayData.entries.map(entry => (
                                                    <li key={entry.id}>
                                                        {timeFormatter.format(new Date(entry.start_time))} - {entry.end_time ? timeFormatter.format(new Date(entry.end_time)) : 'Now'}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800"></div>
                                    </div>
                                )}
                                <span className={`text-[10px] mt-1 truncate ${isToday && !dayData.label ? 'font-bold text-[var(--accent-color)]' : 'text-gray-400'}`}>{label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
             {xAxisLabel && <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">{xAxisLabel}</p>}
        </div>
    </div>
  );
};

export default MonthlyChart;