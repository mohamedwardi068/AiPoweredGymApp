import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Message } from '../../types';
import { WorkoutCard } from '../cards/WorkoutCard';
import { NutritionCard } from '../cards/NutritionCard';
import { ExerciseCard } from '../cards/ExerciseCard';
import { MealCard } from '../cards/MealCard';
import { ThumbsUp, ThumbsDown, Copy, RotateCcw, Check } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { PlanValidationModal } from '../ui/PlanValidationModal';

interface MessageItemProps {
  message: Message;
  onLike?: () => void;
}

export function MessageItem({ message, onLike }: MessageItemProps) {
  const { validateWorkout, validateNutrition, updateMessageCard, setActiveEditContext } = useApp();
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [showPlanValidation, setShowPlanValidation] = useState(false);
  const [pendingWorkoutCard, setPendingWorkoutCard] = useState<any>(null);
  const [validatedCardIds, setValidatedCardIds] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { autoScheduleWorkout } = useApp();

  const cleanContent = message.content.replace(/```json\s*[\s\S]*?\s*```/g, '').trim();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cleanContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 sm:gap-4 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <motion.div
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex-shrink-0 flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-accent-green to-accent-green-dark'
            : 'bg-dark-800 border border-dark-700'
        }`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isUser ? (
          <span className="text-sm font-bold text-white">A</span>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-accent-green">
            <path
              d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="6" y1="1" x2="6" y2="4" stroke="currentColor" strokeWidth="2" />
            <line x1="10" y1="1" x2="10" y2="4" stroke="currentColor" strokeWidth="2" />
            <line x1="14" y1="1" x2="14" y2="4" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
      </motion.div>

      <div className={`flex-1 max-w-[85%] sm:max-w-[75%] ${isUser ? 'flex flex-col items-end' : ''}`}>
        <motion.div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gradient-to-br from-accent-green to-accent-green-dark text-white'
              : 'bg-dark-800/80 backdrop-blur border border-dark-700'
          }`}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : ''}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-lg font-bold text-white mb-2 mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-bold text-white mb-2 mt-4">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-bold text-white mb-1 mt-3">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className={`text-sm leading-relaxed ${isUser ? 'text-white' : 'text-dark-200'} mb-2 last:mb-0`}>
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-white">{children}</strong>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-1 mb-3 ml-4 list-disc">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="space-y-1 mb-3 ml-4 list-decimal">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className={`text-sm ${isUser ? 'text-white/90' : 'text-dark-300'}`}>{children}</li>
                ),
                code: ({ className, children }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="px-1.5 py-0.5 rounded bg-dark-700 text-accent-green text-xs font-mono">
                      {children}
                    </code>
                  ) : (
                    <code className="block p-3 rounded-lg bg-dark-900 text-xs font-mono overflow-x-auto">
                      {children}
                    </code>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-accent-green pl-3 italic text-dark-300">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3">
                    <table className="min-w-full text-sm">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="px-3 py-2 bg-dark-800 text-left font-semibold text-white border-b border-dark-700">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-3 py-2 text-dark-300 border-b border-dark-700">{children}</td>
                ),
              }}
            >
              {cleanContent}
            </ReactMarkdown>
            {message.isStreaming && (
              <motion.span
                className="inline-block w-2 h-4 bg-accent-green ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </div>
        </motion.div>

        {message.cards && message.cards.length > 0 && (
          <div className="space-y-3 mt-3 w-full">
            {message.cards.map((card) => {
              switch (card.type) {
                case 'workout':
                  const isValidated = validatedCardIds.includes(card.id);
                  return (
                    <div key={card.id} className="space-y-2">
                      <WorkoutCard 
                        data={card.data as any} 
                        onUpdate={(newData) => updateMessageCard(message.id, card.id, newData)}
                        onEditWithAI={() => setActiveEditContext({ messageId: message.id, cardId: card.id, data: card.data })}
                      />
                      <div className="flex justify-end pr-1">
                        {isValidated ? (
                          <div className="flex items-center gap-1.5 text-accent-green bg-accent-green/10 px-3 py-1.5 rounded-lg text-xs font-semibold border border-accent-green/20">
                            <Check className="w-3.5 h-3.5" />
                            Plan Scheduled
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setPendingWorkoutCard(card);
                              setShowPlanValidation(true);
                            }}
                            className="hover:border-accent-green/50 hover:text-accent-green text-xs"
                            icon={<Check className="w-3.5 h-3.5" />}
                          >
                            Validate Workout Plan
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                case 'nutrition':
                  return (
                    <div key={card.id} className="space-y-2">
                      <NutritionCard data={card.data as any} />
                      <div className="flex justify-end pr-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => validateNutrition(card.data)}
                          className="hover:border-accent-green/50 hover:text-accent-green text-xs"
                          icon={<Check className="w-3.5 h-3.5" />}
                        >
                          Validate Nutrition Plan
                        </Button>
                      </div>
                    </div>
                  );
                case 'meal':
                  return (
                    <div key={card.id} className="space-y-2">
                      <MealCard data={card.data as any} />
                      <div className="flex justify-end pr-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => validateNutrition(card.data)}
                          className="hover:border-accent-green/50 hover:text-accent-green text-xs"
                          icon={<Check className="w-3.5 h-3.5" />}
                        >
                          Validate Meal Plan
                        </Button>
                      </div>
                    </div>
                  );
                case 'exercise':
                  return <ExerciseCard key={card.id} data={card.data as any} />;
                default:
                  return null;
              }
            })}
          </div>
        )}

        {!isUser && !message.isStreaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-1 mt-2"
          >
            <motion.button
              onClick={onLike}
              className={`p-1.5 rounded-lg transition-colors ${
                message.liked === true
                  ? 'bg-accent-green/20 text-accent-green'
                  : 'text-dark-500 hover:text-white hover:bg-dark-800'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ThumbsUp className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => onLike?.()}
              className={`p-1.5 rounded-lg transition-colors ${
                message.liked === false
                  ? 'bg-red-500/20 text-red-400'
                  : 'text-dark-500 hover:text-white hover:bg-dark-800'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ThumbsDown className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={copyToClipboard}
              className="p-1.5 rounded-lg text-dark-500 hover:text-white hover:bg-dark-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {copied ? <Check className="w-4 h-4 text-accent-green" /> : <Copy className="w-4 h-4" />}
            </motion.button>
            <motion.button
              className="p-1.5 rounded-lg text-dark-500 hover:text-white hover:bg-dark-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        <div className={`text-[10px] text-dark-500 mt-1 ${isUser ? 'text-right' : ''}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <PlanValidationModal
        isOpen={showPlanValidation}
        onClose={() => {
          setShowPlanValidation(false);
          setPendingWorkoutCard(null);
        }}
        onSelect={async (dateString, durationWeeks, trainDays, restDays) => {
          setShowPlanValidation(false);
          if (pendingWorkoutCard) {
            // First validate to save the plan in user's library
            const validatedPlan = await validateWorkout(pendingWorkoutCard.data, undefined, true);
            
            // Then auto-schedule the plan
            if (validatedPlan && validatedPlan._id) {
              await autoScheduleWorkout(dateString, durationWeeks, trainDays, restDays, validatedPlan._id);
            }
            
            setValidatedCardIds((prev) => [...prev, pendingWorkoutCard.id]);
            setShowSuccessModal(true);
          }
          setPendingWorkoutCard(null);
        }}
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-sm bg-dark-900 border border-accent-green/30 rounded-2xl p-6 text-center shadow-[0_0_40px_rgba(34,197,94,0.15)]"
          >
            <div className="w-16 h-16 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent-green/20">
              <Check className="w-8 h-8 text-accent-green" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Plan Scheduled!</h3>
            <p className="text-dark-300 text-sm mb-6">
              Your workout plan has been successfully validated and added to your calendar. Start chatting to make a new plan!
            </p>
            <Button
              className="w-full"
              onClick={() => {
                setShowSuccessModal(false);
                // Focus the chat input box
                const chatInput = document.querySelector('textarea') || document.querySelector('input[type="text"]');
                if (chatInput) {
                  (chatInput as HTMLElement).focus();
                }
              }}
            >
              Start Chatting
            </Button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 sm:gap-4"
    >
      <motion.div
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-accent-green">
          <path
            d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      <div className="bg-dark-800/80 backdrop-blur border border-dark-700 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-1.5">
          <motion.div
            className="w-2 h-2 bg-accent-green rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-accent-green rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
          />
          <motion.div
            className="w-2 h-2 bg-accent-green rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          />
        </div>
        <motion.p
          className="text-xs text-accent-green mt-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Analyzing your request...
        </motion.p>
      </div>
    </motion.div>
  );
}
