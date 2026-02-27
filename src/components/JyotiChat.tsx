'use client';
import { useChat } from 'ai/react';
import { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

export default function JyotiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-80 h-[450px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-[#C8A24D] p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <span className="font-bold text-sm">Jyoti AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1"><X size={18}/></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <p className="text-gray-400 text-xs text-center mt-20 italic">"How can I help you book your desk at 9to5?"</p>
            )}
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                  m.role === 'user' ? 'bg-[#C8A24D] text-white rounded-br-none' : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-[10px] text-gray-400 animate-pulse">Jyoti is typing...</div>}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t flex gap-2">
            <input 
              value={input} 
              onChange={handleInputChange} 
              placeholder="Type your message..." 
              className="flex-1 text-sm outline-none px-2 py-1" 
            />
            <button type="submit" disabled={!input || isLoading} className="text-[#C8A24D] disabled:opacity-30">
              <Send size={20}/>
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#C8A24D] text-white flex items-center gap-2 px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all active:scale-95 group"
      >
        <span className="font-semibold text-sm">Ask Jyoti</span>
        <MessageSquare size={22} className="group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}
