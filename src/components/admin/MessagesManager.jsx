import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvelopeSimple, EnvelopeOpen, Trash, CheckCircle } from '@phosphor-icons/react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate ? d.data().createdAt.toDate() : new Date(d.data().createdAt),
      }));
      setMessages(data);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return unsub;
  }, []);

  const markAsRead = async (id, currentStatus) => {
    if (currentStatus === 'read') return;
    try {
      await updateDoc(doc(db, 'messages', id), { status: 'read' });
    } catch (e) {
      console.error("Error updating message", e);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (e) {
      console.error("Error deleting message", e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-8 border border-glassBorder">
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-textMain">Inquiries & Messages</h2>
        <p className="text-textMuted text-sm mt-1">Manage contact entries from website visitors.</p>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 text-textMuted">
          <EnvelopeSimple size={48} className="mx-auto mb-4 opacity-30" />
          <h3 className="text-xl font-display font-semibold text-textMain mb-2">Inbox is Empty</h3>
          <p>No new messages from prospects.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-6 rounded-2xl border transition-all ${
                  msg.status === 'unread' 
                    ? 'bg-glassBg border-accent/40 shadow-[0_4px_20px_rgba(var(--accent-rgb),0.1)]' 
                    : 'bg-glassBg/50 border-glassBorder opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="text-lg font-bold text-textMain flex items-center gap-2">
                        {msg.status === 'unread' ? (
                          <span className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse"></span>
                        ) : null}
                        {msg.name}
                      </h4>
                      <span className="text-sm font-mono text-textMuted/70 bg-black/20 px-2 py-0.5 rounded">
                        {msg.email}
                      </span>
                      <span className="text-xs uppercase tracking-wider text-accent/80 font-bold border border-accent/20 px-2 py-0.5 rounded-full">
                        {msg.project}
                      </span>
                    </div>
                    
                    <p className="text-textMain/90 text-sm whitespace-pre-wrap leading-relaxed border-l-2 border-glassBorder pl-4 py-1 mt-3">
                      {msg.message}
                    </p>
                    
                    <p className="text-xs text-textMuted pt-2">
                      Received: {msg.createdAt && msg.createdAt.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 shrink-0">
                    {msg.status === 'unread' && (
                      <button
                        onClick={() => markAsRead(msg.id, msg.status)}
                        className="p-2 rounded-lg bg-glassBg border border-glassBorder text-textMuted hover:text-green-400 hover:border-green-400/50 transition-colors tooltip-trigger"
                        title="Mark as Read"
                      >
                        <EnvelopeOpen size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="p-2 rounded-lg bg-glassBg border border-glassBorder text-textMuted hover:text-red-400 hover:border-red-400/50 transition-colors tooltip-trigger"
                      title="Delete Message"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
