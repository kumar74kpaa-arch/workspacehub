'use client';
import React, { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

export default function JyotiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {isOpen && (
        <div className="mb-4 w-80 h-[450px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-[#C8A24D] p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <span className="font-bold">Jyoti AI</span>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={18}/></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 text-black">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-2 rounded-lg text-sm ${m.role === 'user' ? 'bg-[#C8A24D] text-white' : 'bg-white border text-gray-800 shadow-sm'}`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t bg-white flex gap-2">
            <input 
              value={input} 
              onChange={handleInputChange} 
              placeholder="Ask Jyoti..." 
              className="flex-1 text-sm outline-none text-black" 
            />
            <button type="submit" disabled={!input || isLoading} className="text-[#C8A24D]">
              <Send size={20}/>
            </button>
          </form>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#C8A24D] text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        <MessageSquare size={24} />
      </button>
    </div>
  );
}
