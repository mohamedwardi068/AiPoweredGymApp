import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Mic, Image, Loader2, X, FileText } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  editContext?: any;
  onCancelEdit?: () => void;
}

export function ChatInput({ onSend, isLoading, editContext, onCancelEdit }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = useCallback(() => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [input, isLoading, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6 bg-gradient-to-t from-dark-900 via-dark-900/95 to-transparent"
    >
      <div className="max-w-3xl mx-auto space-y-2">
        <AnimatePresence>
          {editContext && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              className="flex items-center"
            >
              <div className="flex items-center gap-2 bg-accent-blue/10 border border-accent-blue/20 px-3 py-1.5 rounded-lg">
                <FileText className="w-3.5 h-3.5 text-accent-blue" />
                <span className="text-xs font-medium text-accent-blue">
                  Editing: {editContext.data?.title || 'Workout Plan'}
                </span>
                <button
                  onClick={onCancelEdit}
                  className="ml-1 p-0.5 rounded-full hover:bg-accent-blue/20 text-accent-blue/70 hover:text-accent-blue transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-green/10 to-accent-blue/10 rounded-2xl blur-xl opacity-50" />
          <div className="relative flex items-end gap-2 p-2 sm:p-3 bg-dark-800/90 backdrop-blur-xl rounded-2xl border border-dark-700">
            <motion.button
              className="p-2 sm:p-2.5 rounded-xl text-dark-400 hover:text-white hover:bg-dark-700/50 transition-colors flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image className="w-5 h-5 sm:w-5 sm:h-5" />
            </motion.button>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about fitness..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-white placeholder-dark-500 text-sm sm:text-base resize-none focus:outline-none min-h-[40px] max-h-[120px] py-2 disabled:opacity-50"
              rows={1}
            />

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <span className="text-[10px] sm:text-xs text-dark-500 hidden sm:block">
                {input.length}/2000
              </span>

              <motion.button
                className="p-2 sm:p-2.5 rounded-xl text-dark-400 hover:text-white hover:bg-dark-700/50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>

              <motion.button
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
                className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 ${
                  input.trim() && !isLoading
                    ? 'bg-gradient-to-r from-accent-green to-accent-green-dark text-white shadow-glow-green'
                    : 'bg-dark-700 text-dark-500 cursor-not-allowed'
                }`}
                whileHover={input.trim() && !isLoading ? { scale: 1.05 } : {}}
                whileTap={input.trim() && !isLoading ? { scale: 0.95 } : {}}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-3 text-[10px] sm:text-xs text-dark-500">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-dark-800 rounded text-dark-400">Enter</kbd>
            <span>to send</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-dark-800 rounded text-dark-400">Shift+Enter</kbd>
            <span>new line</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
