import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, User, Clock } from 'lucide-react';
import axios from 'axios';

export default function ChatModal({ isOpen, onClose, contextId, contextTitle, senderId, senderName }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!contextId) return;
    try {
      const res = await axios.get(`/api/chat/${contextId}/messages`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Fetch chat error:', err);
    }
  };

  useEffect(() => {
    if (isOpen && contextId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000); // Polling fallback for live chat
      return () => clearInterval(interval);
    }
  }, [isOpen, contextId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const messageText = inputMessage;
    setInputMessage('');

    try {
      const res = await axios.post('/api/chat/send', {
        contextId,
        senderId: senderId || 'user-1',
        senderName: senderName || 'Farmer',
        message: messageText
      });

      if (res.data.success) {
        setMessages(prev => [...prev, res.data.message]);
      }
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col h-[520px]">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold truncate max-w-xs">{contextTitle || 'Direct Negotiation'}</h3>
              <p className="text-[11px] text-emerald-400">Direct Escrow Protected Negotiation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.length === 0 ? (
            <div className="text-center p-8 text-xs text-slate-400 italic">
              No messages yet. Send a direct offer or inquiry to start negotiation.
            </div>
          ) : (
            messages.map((m, idx) => {
              const isMe = m.senderId === senderId;
              return (
                <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-slate-400 mb-0.5 px-1">{m.senderName}</span>
                  <div className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                    isMe
                      ? 'bg-emerald-700 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-2xs'
                  }`}>
                    {m.message}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 px-1 flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type counter-offer or question..."
            className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
