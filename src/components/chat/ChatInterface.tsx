import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Menu, Search, MoreVertical, BookmarkPlus, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WelcomeScreen } from './WelcomeScreen';
import { MessageItem, TypingIndicator } from './MessageItem';
import { ChatInput } from './ChatInput';

export function ChatInterface() {
  const {
    currentConversation,
    isStreaming,
    sendMessage,
    setSidebarOpen,
    toggleLikeMessage,
    activeEditContext,
    setActiveEditContext,
  } = useApp();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages, isStreaming]);

  const messages = currentConversation?.messages || [];
  const showWelcome = messages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-dark-950">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-dark-900/80 backdrop-blur-xl border-b border-dark-800"
      >
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white md:hidden transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5" />
          </motion.button>

          <div>
            <h1 className="font-semibold text-white truncate max-w-[200px] sm:max-w-none">
              {currentConversation?.title || 'New Chat'}
            </h1>
            <p className="text-xs text-dark-500">
              {messages.length} messages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <motion.button
            className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search className="w-5 h-5" />
          </motion.button>
          <motion.button
            className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookmarkPlus className="w-5 h-5" />
          </motion.button>
          <motion.button
            className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
          <motion.button
            className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MoreVertical className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.header>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {showWelcome ? (
            <WelcomeScreen key="welcome" />
          ) : (
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto px-4 py-6 space-y-6"
            >
              {messages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  onLike={() => toggleLikeMessage(message.id)}
                />
              ))}

              {isStreaming && messages[messages.length - 1]?.role === 'user' && (
                <TypingIndicator />
              )}

              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ChatInput 
        onSend={sendMessage} 
        isLoading={isStreaming} 
        editContext={activeEditContext}
        onCancelEdit={() => setActiveEditContext(null)}
      />
    </div>
  );
}
