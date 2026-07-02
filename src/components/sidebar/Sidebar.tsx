import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Dumbbell,
  Apple,
  TrendingUp,
  Bookmark,
  Plus,
  ChevronLeft,
  Pin,
  MoreHorizontal,
  Trash2,
  Edit2,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { Page } from '../../types';
import React from 'react';

const NAV_ITEMS: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'chat', label: 'Chat', icon: <MessageCircle className="w-5 h-5" /> },
  { id: 'workouts', label: 'Workout Plans', icon: <Dumbbell className="w-5 h-5" /> },
  { id: 'nutrition', label: 'Nutrition', icon: <Apple className="w-5 h-5" /> },
  { id: 'progress', label: 'Progress', icon: <TrendingUp className="w-5 h-5" /> },
  { id: 'saved', label: 'Saved', icon: <Bookmark className="w-5 h-5" /> },
];

const sidebarVariants = {
  expanded: { width: 280 },
  collapsed: { width: 80 },
};

const itemVariants = {
  expanded: { opacity: 1, x: 0 },
  collapsed: { opacity: 0, x: -10 },
};

export function Sidebar() {
  const {
    currentPage,
    setCurrentPage,
    conversations,
    currentConversation,
    setCurrentConversation,
    createNewConversation,
    deleteConversation,
    pinConversation,
    renameConversation,
    setSidebarOpen,
    user,
    logout,
  } = useApp();

  const [collapsed, setCollapsed] = useState(false);
  const [contextMenu, setContextMenu] = useState<string | null>(null);

  const sortedConversations = [...conversations].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  return (
    <motion.aside
      variants={sidebarVariants}
      initial={false}
      animate={collapsed ? 'collapsed' : 'expanded'}
      className="hidden md:flex flex-col h-screen bg-dark-900/95 border-r border-dark-800 backdrop-blur-xl overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-dark-800">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Logo />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronLeft className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 min-h-0">
        {NAV_ITEMS.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={() => {
              setCurrentPage(item.id);
              if (item.id === 'chat') setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
              currentPage === item.id
                ? 'bg-dark-800 text-white'
                : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className={`${currentPage === item.id ? 'text-accent-green' : 'group-hover:text-accent-green'} transition-colors`}>
              {item.icon}
            </span>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  variants={itemVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}

        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-4"
            >
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-xs font-semibold text-dark-500 uppercase tracking-wider">
                  Recent Chats
                </span>
              </div>

              <Button
                onClick={createNewConversation}
                variant="secondary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                className="w-full mb-2"
              >
                New Chat
              </Button>

              <div className="space-y-1 max-h-[calc(100vh-480px)] overflow-y-auto">
                {sortedConversations.map((conv, index) => (
                  <motion.div
                    key={conv.id}
                    className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      currentConversation?.id === conv.id
                        ? 'bg-dark-800 text-white'
                        : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.03 }}
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      setCurrentConversation(conv);
                      setCurrentPage('chat');
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setContextMenu(conv.id);
                    }}
                  >
                    {conv.pinned && (
                      <Pin className="w-3 h-3 text-accent-green flex-shrink-0" />
                    )}
                    <span className="truncate text-sm flex-1">{conv.title}</span>

                    <motion.button
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-dark-700 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        setContextMenu(contextMenu === conv.id ? null : conv.id);
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </motion.button>

                    <AnimatePresence>
                      {contextMenu === conv.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute right-2 top-full mt-1 z-50 bg-dark-800 border border-dark-700 rounded-lg shadow-lg p-1 min-w-[120px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              pinConversation(conv.id);
                              setContextMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-dark-300 hover:text-white hover:bg-dark-700 rounded transition-colors"
                          >
                            <Pin className="w-4 h-4" />
                            {conv.pinned ? 'Unpin' : 'Pin'}
                          </button>
                          <button
                            onClick={() => {
                              const newTitle = prompt('Enter new title:', conv.title);
                              if (newTitle) renameConversation(conv.id, newTitle);
                              setContextMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-dark-300 hover:text-white hover:bg-dark-700 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                            Rename
                          </button>
                          <button
                            onClick={() => {
                              deleteConversation(conv.id);
                              setContextMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-dark-700 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="border-t border-dark-800 p-4">
        {collapsed ? (
          <button
            onClick={logout}
            className="w-9 h-9 rounded-xl hover:bg-dark-800 text-dark-400 hover:text-red-400 flex items-center justify-center transition-colors mx-auto"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        ) : (
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ x: 2 }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center text-white font-semibold flex-shrink-0">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0 flex items-center justify-between gap-1">
              <div className="min-w-0">
                <div className="font-medium text-white truncate text-sm">{user?.name}</div>
                <div className="text-xs text-dark-500">
                  <span className="text-accent-green font-medium">{user?.streak}</span> day streak
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-red-400 transition-colors flex-shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}

export function MobileSidebar() {
  const {
    currentPage,
    setCurrentPage,
    conversations,
    currentConversation,
    setCurrentConversation,
    createNewConversation,
    sidebarOpen,
    setSidebarOpen,
    user,
    logout,
  } = useApp();

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 w-72 bg-dark-900 border-r border-dark-800 z-50 md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-dark-800">
              <Logo />
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-dark-800 text-dark-400"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
              <Button
                onClick={() => {
                  createNewConversation();
                  setSidebarOpen(false);
                }}
                variant="primary"
                icon={<Plus className="w-4 h-4" />}
                className="w-full mb-4"
              >
                New Chat
              </Button>

              {NAV_ITEMS.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    if (item.id !== 'chat') setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    currentPage === item.id
                      ? 'bg-dark-800 text-white'
                      : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <span className={currentPage === item.id ? 'text-accent-green' : ''}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}

              <div className="pt-4">
                <span className="px-3 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                  Recent
                </span>
                <div className="mt-2 space-y-1">
                  {conversations.slice(0, 5).map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setCurrentConversation(conv);
                        setCurrentPage('chat');
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate ${
                        currentConversation?.id === conv.id
                          ? 'bg-dark-800 text-white'
                          : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                      }`}
                    >
                      {conv.title}
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            <div className="border-t border-dark-800 p-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {user?.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-white truncate text-sm">{user?.name}</div>
                  <div className="text-xs text-dark-500">
                    <span className="text-accent-green font-medium">{user?.streak}</span> day streak
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setSidebarOpen(false);
                }}
                className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
