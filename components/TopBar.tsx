
import React from 'react';
import SessionInfo from './SessionInfo';
import ActivityTicker from './ActivityTicker';

const TopBar: React.FC = () => {
    return (
        <div className="bg-slate-100 dark:bg-black/20 text-gray-600 dark:text-gray-400 animate-fadeInDown border-b border-black/5 dark:border-white/5">
            <div className="container mx-auto px-4 h-8 flex justify-center md:justify-between items-center">
                {/* Session info: Hidden on mobile, shown on desktop */}
                <div className="hidden md:block">
                    <SessionInfo />
                </div>
                {/* Live activity ticker is always visible */}
                <div>
                    <ActivityTicker />
                </div>
            </div>
        </div>
    );
};

export default TopBar;
