import React, { useEffect } from 'react';
import { XIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <details className="group border-b border-gray-200 dark:border-gray-700 py-4 last:border-b-0" open>
    <summary className="font-semibold text-lg cursor-pointer flex justify-between items-center text-gray-800 dark:text-gray-200 group-hover:text-[var(--accent-color)] dark:group-hover:text-[var(--accent-color-dark)] transition-colors">
      {title}
      <span className="transform transition-transform duration-200 group-open:rotate-180 text-sm">▼</span>
    </summary>
    <div className="mt-4 text-gray-600 dark:text-gray-400 prose prose-sm dark:prose-invert max-w-none">
      {children}
    </div>
  </details>
);

const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
    const { t } = useSettings();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;
  
    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-guide-modal-title"
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ease-out animate-fadeInUp"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 id="user-guide-modal-title" className="text-xl font-bold text-gray-800 dark:text-gray-100">{t.howToUseThisApp}</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        aria-label={t.close}
                    >
                        <XIcon size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6">
                    <GuideSection title="1. Appearance & Settings">
                      <ul>
                        <li><strong>Access Settings:</strong> Click the <strong>settings icon (⚙️)</strong> in the top-right corner of the header.</li>
                        <li><strong>Theme:</strong> Choose between <strong>Light</strong> and <strong>Dark</strong> mode for your preferred viewing experience.</li>
                        <li><strong>Accent Color:</strong> Select one of the color bubbles to change the application's gradient theme.</li>
                        <li><strong>Language:</strong> Switch between English, Tiếng Việt, and ไทย.</li>
                      </ul>
                    </GuideSection>

                    <GuideSection title="2. Tracking Your Time (Employee View)">
                       <ul>
                        <li><strong>Start a Shift:</strong> Click the large, green <strong>"Start Shift"</strong> button in the action panel above the calendar. A timer will appear, showing your shift is in progress.</li>
                        <li><strong>End a Shift:</strong> When you are finished working, click the red <strong>"End Shift"</strong> button.</li>
                        <li><strong>Manual Entry:</strong> If you forgot to clock in/out or need to correct an entry, click the <strong>"Add Entry"</strong> button. You can also hover over a day with existing shifts and click the tooltip's <strong>edit icon (✎)</strong> to modify them.</li>
                        <li><strong>Add Notes/Attachments:</strong> Hover over any day in the calendar and click the <strong>plus icon (+)</strong> to open a modal where you can add text notes or upload a file (e.g., an image of your work) for that day.</li>
                        <li><strong>View Your Hours:</strong> The total hours worked will appear on each day in the calendar. Hover over a day to see shift details.</li>
                      </ul>
                    </GuideSection>

                    <GuideSection title="3. Navigating the Calendar">
                      <ul>
                        <li><strong>Change Month:</strong> Use the <strong>arrow buttons (⟨, ⟩)</strong> next to the month and year display to navigate to the previous or next month.</li>
                        <li><strong>Review Past Entries:</strong> Navigate to any previous month to see your work history. The calendar will automatically display the hours you worked on each day.</li>
                         <li><strong>Data Visualization:</strong> Below the monthly summary, a bar chart provides a visual overview of your work hours for each day of the selected month.</li>
                         <li><strong>Note Indicators:</strong> Days with saved notes or attachments will display small icons (📄 for a note, 📎 for a file) for quick reference.</li>
                      </ul>
                    </GuideSection>
                    
                    <GuideSection title="4. Admin Dashboard (For Admins)">
                         <ul>
                            <li><strong>Access:</strong> If you are an admin, a toggle switch will appear in the header. Click <strong>"Admin Dashboard"</strong> to switch views.</li>
                            <li><strong>View Employees:</strong> The admin dashboard shows a list of all employees. Click on an employee's name to view their timesheet, summary statistics, and daily hours chart for the selected month.</li>
                            <li><strong>Manage Entries:</strong> For a selected employee, you can <strong>Add</strong> a new time entry, <strong>Edit</strong> an existing one, or <strong>Delete</strong> it from the time entry table.</li>
                        </ul>
                    </GuideSection>

                    <GuideSection title="5. Your Account">
                         <ul>
                            <li><strong>Sign In/Up:</strong> You must be signed in to track your time. Click the "Sign In" button in the header to create an account or log in.</li>
                            <li><strong>Account Management:</strong> When logged in, click your email address in the header to open the user menu. From there, you can access your <strong>Account Settings</strong> to update your profile information or change your password.</li>
                            <li><strong>Sign Out:</strong> Log out of your account from the user menu.</li>
                        </ul>
                    </GuideSection>
                </div>
            </div>
        </div>
    );
};

export default UserGuideModal;