import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Pin, Trash2, MessageCircle, FolderOpen } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function SavedConversationsPage() {
  const { conversations, setCurrentConversation, setCurrentPage, pinConversation, deleteConversation } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pinned'>('all');

  const filteredConversations = conversations
    .filter(conv => filter === 'pinned' ? conv.pinned : true)
    .filter(conv => conv.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

  const handleSelect = (conv: typeof conversations[0]) => {
    setCurrentConversation(conv);
    setCurrentPage('chat');
  };

  return (
    <div className="min-h-screen bg-dark-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Saved Conversations</h1>
          <p className="text-dark-400">Access your chat history</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-accent-green/50"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'secondary' : 'ghost'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'pinned' ? 'secondary' : 'ghost'}
              onClick={() => setFilter('pinned')}
              icon={<Pin className="w-4 h-4" />}
            >
              Pinned
            </Button>
          </div>
        </motion.div>

        {filteredConversations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <GlassCard className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-green/20 to-accent-blue/20 flex items-center justify-center">
                <FolderOpen className="w-8 h-8 text-dark-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No conversations found</h3>
              <p className="text-dark-400 text-sm mb-6">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Start chatting to save conversations'}
              </p>
              <Button
                variant="primary"
                onClick={() => setCurrentPage('chat')}
                icon={<MessageCircle className="w-4 h-4" />}
              >
                Start Chat
              </Button>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {filteredConversations.map((conv) => (
              <motion.div
                key={conv.id}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                className="cursor-pointer"
                onClick={() => handleSelect(conv)}
              >
                <GlassCard variant="default" className="group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-dark-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {conv.pinned && (
                          <Pin className="w-3 h-3 text-accent-green" />
                        )}
                        <h3 className="font-medium text-white truncate">{conv.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-dark-500">
                        <span>{conv.messages.length} messages</span>
                        <span className="w-1 h-1 rounded-full bg-dark-600" />
                        <span>{conv.updatedAt.toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          pinConversation(conv.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          conv.pinned
                            ? 'bg-accent-green/20 text-accent-green'
                            : 'hover:bg-dark-800 text-dark-400 hover:text-white'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Pin className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                        className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-red-400 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
