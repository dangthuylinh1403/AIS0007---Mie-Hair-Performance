
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import AuthModal from './components/Auth';
import AccountModal from './components/AccountModal';
import UserGuideModal from './components/UserGuide';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import { useLocalStorage } from './hooks/useLocalStorage';
import { translations } from './translations';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { Profile } from './types';
import { QuestionMarkCircleIcon } from './components/Icons';
import { SettingsContext, SettingsContextType } from './context/SettingsContext';

const SupabaseNotConfigured: React.FC = () => (
  <div className="flex flex-col justify-center items-center text-center flex-grow animate-fadeIn bg-amber-100 dark:bg-amber-900/30 p-8 rounded-lg border border-amber-300 dark:border-amber-700">
    <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-300">Supabase Not Configured</h2>
    <p className="mt-4 text-lg text-amber-800 dark:text-amber-400">
      To enable authentication and timesheet features, you need to configure your Supabase credentials.
    </p>
    <p className="mt-2">Please update the following file with your project's URL and anon key:</p>
    <p className="mt-2 font-mono bg-amber-200 dark:bg-gray-700 p-2 rounded text-sm text-amber-900 dark:text-amber-200">
      lib/supabase.ts
    </p>
     <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
      Note: Remember to run the SQL provided in the response to set up your database tables.
    </p>
  </div>
);

const AppContainer: React.FC<{ session: Session | null }> = ({ session }) => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');
  const [language, setLanguage] = useLocalStorage<keyof typeof translations>('language', 'vi');
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  // Admin state
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
  }, [theme]);

  const getProfile = useCallback(async (user: Session['user'] | null) => {
      if (!user) return;
      setLoadingProfile(true);
      try {
          const { data, error } = await supabase
              .from('profiles')
              .select(`*`)
              .eq('id', user.id)
              .single();
          
          if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
              throw error;
          }
          if (data) {
              setProfile(data);
          } else {
              // If no profile, reset admin view
              setIsAdminView(false);
          }
      } catch (error: any) {
          console.error('Error fetching profile:', error.message);
      } finally {
          setLoadingProfile(false);
      }
  }, []);

  useEffect(() => {
    if (session) {
      getProfile(session.user);
    } else {
      setProfile(null);
      setLoadingProfile(false);
      setIsAdminView(false);
    }
  }, [session, getProfile]);

  const t = translations[language];

  const handleSignOut = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  };

  const settingsContextValue: SettingsContextType = {
    theme,
    setTheme,
    language,
    setLanguage,
    t,
  };
  
  const renderDashboard = () => {
      if (loadingProfile) {
          return <div className="text-center p-8">Loading user data...</div>;
      }
      
      if (profile?.role === 'admin' && isAdminView) {
          return <AdminDashboard />;
      }
      
      return <EmployeeDashboard session={session} />;
  }

  return (
    <SettingsContext.Provider value={settingsContextValue}>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans flex flex-col">
        <Header 
          session={session}
          profile={profile}
          handleSignOut={handleSignOut}
          onSignInClick={() => setIsAuthModalOpen(true)}
          onAccountClick={() => setIsAccountModalOpen(true)}
          isAdminView={isAdminView}
          setIsAdminView={setIsAdminView}
        />

        <main className="container mx-auto px-4 py-8 flex-grow flex flex-col">
          {isSupabaseConfigured ? (
            renderDashboard()
          ) : (
            <SupabaseNotConfigured />
          )}
        </main>
        
        <Footer />
        <ScrollToTopButton />

        <button
          type="button"
          onClick={() => setIsUserGuideOpen(true)}
          aria-label={t.openUserGuideAria}
          title={t.howToUseThisApp}
          className="fixed bottom-8 left-8 z-50 p-3 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white shadow-lg hover:shadow-xl transform-gpu transition-all duration-300 ease-in-out hover:scale-110"
        >
          <QuestionMarkCircleIcon size={24} />
        </button>
        
        <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
        />

        <AccountModal
            isOpen={isAccountModalOpen}
            onClose={() => {
              setIsAccountModalOpen(false);
              if (session) getProfile(session.user); // Re-fetch profile on close in case of updates
            }}
            session={session}
        />

        <UserGuideModal
            isOpen={isUserGuideOpen}
            onClose={() => setIsUserGuideOpen(false)}
        />
      </div>
    </SettingsContext.Provider>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AppContainer session={session} />
  );
}