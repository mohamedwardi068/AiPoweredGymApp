import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar, MobileSidebar } from './components/sidebar/Sidebar';
import { ChatInterface } from './components/chat/ChatInterface';
import { WorkoutPlansPage } from './components/pages/WorkoutPlansPage';
import { NutritionPage } from './components/pages/NutritionPage';
import { ProgressPage } from './components/pages/ProgressPage';
import { SavedConversationsPage } from './components/pages/SavedConversationsPage';
import { AuthPage } from './components/pages/AuthPage';

function AppContent() {
  const { currentPage, user, appLoading } = useApp();

  if (appLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-950 select-none">
        <div className="relative w-12 h-12 mb-4">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-accent-green to-accent-blue rounded-xl"
            animate={{
              rotate: 360,
              borderRadius: ['20%', '50%', '20%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
        <h2 className="text-white text-sm font-medium tracking-widest animate-pulse uppercase">
          Initializing FitAI
        </h2>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      <Sidebar />
      <MobileSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {currentPage === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <ChatInterface />
              </motion.div>
            )}
            {currentPage === 'workouts' && (
              <motion.div
                key="workouts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto"
              >
                <WorkoutPlansPage />
              </motion.div>
            )}
            {currentPage === 'nutrition' && (
              <motion.div
                key="nutrition"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto"
              >
                <NutritionPage />
              </motion.div>
            )}
            {currentPage === 'progress' && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto"
              >
                <ProgressPage />
              </motion.div>
            )}
            {currentPage === 'saved' && (
              <motion.div
                key="saved"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto"
              >
                <SavedConversationsPage />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
