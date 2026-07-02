import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './Button';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (dateString: string) => void;
  title?: string;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function DatePickerModal({ isOpen, onClose, onSelect, title = "Select Starting Date" }: DatePickerModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const todayStr = new Date().toISOString().split('T')[0];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarCells = [];

  for (let i = startDayOffset - 1; i >= 0; i--) {
    const dayNum = totalDaysInPrevMonth - i;
    const prevDate = new Date(year, month - 1, dayNum);
    const dateString = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(prevDate.getDate()).padStart(2, '0')}`;
    calendarCells.push({ dayNum, isCurrentMonth: false, date: prevDate, dateString });
  }

  for (let i = 1; i <= totalDaysInMonth; i++) {
    const currDate = new Date(year, month, i);
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarCells.push({ dayNum: i, isCurrentMonth: true, date: currDate, dateString });
  }

  const remainingCells = 42 - calendarCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    const nextDate = new Date(year, month + 1, i);
    const dateString = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
    calendarCells.push({ dayNum: i, isCurrentMonth: false, date: nextDate, dateString });
  }

  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-sm bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-dark-800 bg-dark-900/60">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-accent-green" />
                <h3 className="text-lg font-bold text-white">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-dark-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between bg-dark-800/50 p-2 rounded-xl">
                <button onClick={handlePrevMonth} className="p-1.5 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h4 className="font-semibold text-white">
                  {MONTHS_NAMES[month]} {year}
                </h4>
                <button onClick={handleNextMonth} className="p-1.5 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div>
                <div className="grid grid-cols-7 mb-2">
                  {WEEKDAYS.map(day => (
                    <div key={day} className="text-center text-[10px] font-semibold text-dark-500 uppercase tracking-wider py-1">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarCells.map((cell, idx) => {
                    const isToday = cell.dateString === todayStr;
                    return (
                      <button
                        key={idx}
                        onClick={() => onSelect(cell.dateString)}
                        className={`
                          aspect-square flex items-center justify-center text-sm rounded-lg transition-colors
                          ${cell.isCurrentMonth ? 'text-dark-200 hover:bg-dark-700 hover:text-white' : 'text-dark-600 hover:bg-dark-800/50'}
                          ${isToday ? 'bg-accent-green/10 text-accent-green font-bold border border-accent-green/30' : ''}
                        `}
                      >
                        {cell.dayNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-dark-800 bg-dark-900/60 flex justify-end">
              <Button variant="secondary" size="sm" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
