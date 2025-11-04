// E-commerce Types
// These types are not used in the timesheet application but are kept for potential future reference.
// Consider removing them in a future cleanup if they are definitely not needed.
export interface Product {
    id: number;
    created_at: string;
    name: string;
    description: string;
    long_description?: string;
    price: number;
    image_url: string;
}

export interface CartItem extends Product {
    quantity: number;
}

// Employee & Timesheet Types
export interface Profile {
  id: string; // should match user.id
  updated_at: string;
  full_name: string;
  avatar_url: string;
  role: 'admin' | 'employee';
}

export interface TimeEntry {
  id: number;
  user_id: string;
  start_time: string; // ISO 8601 format date string
  end_time: string | null; // ISO 8601 format date string, null if shift is active
  created_at: string;
}

export interface DailyNote {
  id: number;
  user_id: string;
  date: string; // YYYY-MM-DD format
  note: string | null;
  file_url: string | null;
  created_at: string;
}

export interface PerformanceReview {
    id: number;
    user_id: string;
    score: number;
    comments: string;
    reviewDate: string; // YYYY-MM-DD
}

export interface ChartDayData {
  day: number;
  totalHours: number;
  label?: string;
  entries?: TimeEntry[];
}

// Internationalization Types
export type Translation = {
  // Header
  facebookAria: string;
  phoneAria: string;
  telegramAria: string;
  backToTopAria: string;
  scrollToTopAria: string;
  settingsAria: string;
  openUserGuideAria: string;
  howToUseThisApp: string;
  adminDashboard: string;
  employeeDashboard: string;
  
  // ThemeController
  toggleThemeAria: string;
  appearanceSettingsAria: string;
  themeLabel: string;
  lightTheme: string;
  darkTheme: string;
  accentColorLabel: string;

  // LanguageSwitcher
  language: string;

  // Footer
  copyright: (year: number) => string;
  contactUs: string;

  // TopBar
  yourSession: string;
  ipAddress: string;
  sessionTime: string;
  liveActivity: string;
  activeSubs: string;
  totalHoursTicker: string;
  
  // Auth
  authHeader: string;
  authPrompt: string;
  authPromptLogin: string;
  emailLabel: string;
  passwordLabel: string;
  signIn: string;
  signUp: string;
  signOut: string;
  signingIn: string;
  signingUp: string;
  magicLinkSent: string;
  signInToContinue: string;
  cancel: string;

  // Account Modal
  accountSettings: string;
  profile: string;
  password: string;
  updateProfile: string;
  fullName: string;
  avatar: string;
  uploading: string;
  uploadAvatar: string;
  update: string;
  updating: string;
  profileUpdated: string;
  changePassword: string;
  newPassword: string;
  confirmNewPassword: string;
  passwordUpdated: string;
  passwordsDoNotMatch: string;
  
  // Calendar Timesheet
  dashboardTitle: string;
  startShift: string;
  endShift: string;
  shiftInProgress: string;
  shiftStartedAt: (time: string) => string;
  currentDuration: string;
  totalHours: string;
  signInToTrackTime: string;

  // Calendar
  monthNames: string[]; // Array of 12 month names
  dayNames: string[]; // Array of 7 day names (short)
  today: string;

  // Date Range Selector
  dateRange: string;
  thisWeek: string;
  lastWeek: string;
  thisMonth: string;
  lastMonth: string;
  year: string;
  month: string;

  // Monthly Summary
  monthlySummary: string;
  totalHoursWorked: string;
  totalWorkDays: string;
  totalShifts: string;
  averageHoursPerDay: string;
  dailyHoursOverview: string;
  
  // Admin Dashboard
  allEmployees: string;
  selectEmployeePrompt: string;
  timeEntriesFor: (name: string) => string;
  noEntriesFound: string;
  addEntry: string;
  editEntry: string;
  deleteEntry: string;
  confirmDelete: string;
  deleteConfirmationMessage: (entryInfo: string) => string;
  date: string;
  startTime: string;
  endTime: string;
  actions: string;
  workDays: string;
  avgHours: string;
  overallSummary: string;
  employeeLeaderboard: string;
  
  // Generic Actions
  close: string;
  save: string;

  // Add/Edit Time Entry Modal
  addNewTimeEntry: string;
  
  // Performance Review Modal
  editPerformanceReview: string;
  score: string;
  comments: string;
  
  // Cart & Checkout
  yourCart: string;
  remove: string;
  emptyCart: string;
  emptyCartPrompt: string;
  subtotal: string;
  checkout: string;
  addToCart: string;
  addedToCart: string;
  purchaseSuccessful: string;
  purchaseSuccessfulMessage: string;
  checkoutTitle: string;
  quantity: string;
  total: string;
  confirmPurchase: string;

  // Admin Modals
  employee: string;
  selectEmployee: string;
  editEmployeeProfile: string;
  role: string;
  admin: string;
};