import React, { useState, useRef, useEffect } from 'react';
import { generatePCAdvice } from '../services/geminiService';
import { ChatMessage, Product } from '../types';
import { Send, Bot, User, Cpu, Sparkles, Loader2 } from 'lucide-react';
import DealCard from './DealCard';

const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Greetings, Builder. I am Nexus Logic. I can help you find the best deals or plan your next dream rig. What are you looking for today?',
      timestamp: Date.now()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const response = await generatePCAdvice(input);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: response.text,
      recommendedProducts: response.products,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto bg-nexus-800/50 rounded-2xl border border-nexus-700 backdrop-blur-sm overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-nexus-900/80 p-4 border-b border-nexus-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nexus-accent flex items-center justify-center animate-glow">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-white">Nexus Architect</h2>
            <p className="text-xs text-nexus-accent">Automated Build Assistant</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-nexus-800 px-3 py-1 rounded-full border border-nexus-700">
          <Sparkles size={12} className="text-yellow-400" />
          Powered by Nexus Logic Engine
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
              msg.role === 'user' ? 'bg-slate-600' : 'bg-nexus-accent'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Cpu size={16} />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[85%] md:max-w-[70%]`}>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-nexus-700 text-white rounded-tr-none' 
                  : 'bg-nexus-900 border border-nexus-700 text-slate-200 rounded-tl-none'
              }`}>
                {msg.text}
              </div>

              {/* Product Recommendations */}
              {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {msg.recommendedProducts.map(product => (
                    <div key={product.id} className="transform scale-90 origin-top-left">
                      <DealCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-nexus-accent flex-shrink-0 flex items-center justify-center">
              <Cpu size={16} />
            </div>
            <div className="bg-nexus-900 border border-nexus-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-slate-400 text-sm">
              <Loader2 size={16} className="animate-spin" />
              Scanning inventory database...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-nexus-900 border-t border-nexus-700">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search inventory: 'Best GPU', 'Cheap SSD', 'Gaming Mouse'"
            className="w-full bg-nexus-800 text-white placeholder-slate-500 pl-4 pr-12 py-4 rounded-xl border border-nexus-700 focus:outline-none focus:border-nexus-accent focus:ring-1 focus:ring-nexus-accent transition-all shadow-inner"
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 h-10 w-10 bg-nexus-accent hover:bg-nexus-accentHover disabled:bg-nexus-700 disabled:cursor-not-allowed rounded-lg flex items-center justify-center text-white transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-600 mt-2">
          Nexus Logic provides automated recommendations based on current stock.
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;