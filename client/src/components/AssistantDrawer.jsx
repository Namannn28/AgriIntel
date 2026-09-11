import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Bot, 
  User, 
  ExternalLink, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import axios from 'axios';

export default function AssistantDrawer({ isOpen, onClose, user }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! I am your AgriIntel Kisan AI Assistant. You can ask me any question about government subsidies (PM-KISAN, PMFBY), crop diseases, MSP pricing, or farming practices. My answers are strictly grounded in verified government policy documents.',
      citations: []
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const sampleQuestions = [
    'Am I eligible for PM-KISAN with 3 acres in MP?',
    'What is the compensation under PMFBY crop insurance?',
    'How much subsidy do I get for purchasing a tractor under SMAM?',
    'What is the guaranteed MSP price for Wheat for 2025-26?',
    'How to treat early blight in tomatoes?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Voice Recognition (Web Speech API)
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please try Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN'; // or 'hi-IN'
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Voice recognition error:', err);
      setIsListening(false);
    }
  };

  // Text to Speech (TTS)
  const handleReadAloud = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendQuery = async (queryToSend) => {
    const query = queryToSend || inputQuery;
    if (!query.trim()) return;

    const userMessage = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await axios.post('/api/rag/query', {
        query,
        language: 'en',
        user_state: user?.state || 'Madhya Pradesh',
        farmer_category: 'Small'
      });

      const botMessage = {
        sender: 'bot',
        text: res.data.answer,
        citations: res.data.citations || [],
        latencyMs: res.data.latency_ms
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'I am currently unable to reach the knowledge vector store. Please check server status.',
          citations: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-emerald-700 flex items-center justify-center text-emerald-200">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold">Kisan RAG Assistant</h3>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.2 rounded-full font-semibold border border-emerald-400/30">
                Grounded
              </span>
            </div>
            <p className="text-[11px] text-emerald-200">LangChain + Chroma Vector Store</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-emerald-200 hover:text-white p-1.5 rounded-lg hover:bg-emerald-700/50 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Suggested Queries:
        </span>
        <div className="flex gap-1.5 whitespace-nowrap">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(q)}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition-colors shrink-0 shadow-2xs font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m, idx) => {
          const isBot = m.sender === 'bot';
          return (
            <div key={idx} className={`flex gap-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
              <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                isBot ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-800 text-white'
              }`}>
                {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              <div className={`max-w-[82%] space-y-2 ${isBot ? 'text-left' : 'text-right'}`}>
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isBot 
                    ? 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/80 shadow-2xs' 
                    : 'bg-emerald-700 text-white rounded-tr-none shadow-sm'
                }`}>
                  {m.text}
                </div>

                {/* Voice read aloud button for bot replies */}
                {isBot && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReadAloud(m.text)}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
                      title="Read aloud in speech"
                    >
                      <Volume2 className="h-3 w-3" />
                      Listen (आवाज़ में सुनें)
                    </button>
                    {m.latencyMs && (
                      <span className="text-[10px] text-slate-400">
                        • {m.latencyMs}ms
                      </span>
                    )}
                  </div>
                )}

                {/* Grounded Source Citations */}
                {m.citations && m.citations.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-left space-y-1 mt-2">
                    <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      Verified Source Citation:
                    </span>
                    {m.citations.map((c, cIdx) => (
                      <div key={cIdx} className="text-[11px] text-emerald-950">
                        <div className="font-semibold flex items-center justify-between">
                          <span>{c.title}</span>
                          {c.source_url && (
                            <a href={c.source_url} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          )}
                        </div>
                        <p className="text-[10px] text-emerald-800 italic mt-0.5 border-l-2 border-emerald-400 pl-2">
                          "{c.snippet}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Bot className="h-4 w-4 animate-bounce text-emerald-600" />
            <span>Consulting Chroma vector database & government policies...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center gap-2"
        >
          {/* Microphone button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-2.5 rounded-xl transition-colors ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title="Speak query in Hindi or English (Voice STT)"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={isListening ? 'Listening to your voice...' : 'Ask about schemes, subsidies, mandi rates...'}
            className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 px-1">
          <span>Voice STT & TTS Enabled</span>
          <span>Zero Hallucination Grounding</span>
        </div>
      </div>

    </div>
  );
}
