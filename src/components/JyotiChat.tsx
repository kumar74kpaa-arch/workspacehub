'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { MessageSquare, X, Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function JyotiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-[#C8A24D] p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Jyoti AI</h3>
                <p className="text-[10px] text-white/80">9to5 Workspace Concierge</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              <X size={20}/>
            </button>
          </div>
          
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scrollbar-thin">
            {messages.length === 0 && (
              <div className="text-center py-10 space-y-2">
                <Bot className="mx-auto h-8 w-8 text-[#C8A24D] opacity-20" />
                <p className="text-xs text-muted-foreground">Hello! How can I help you with 9to5 Workspace today?</p>
              </div>
            )}
            {messages.map(m => (
              <div 
                key={m.id} 
                className={cn(
                  "flex items-start gap-2",
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {m.role !== 'user' && (
                  <div className="w-6 h-6 rounded-full bg-[#C8A24D] flex items-center justify-center shrink-0">
                    <Sparkles size={12} className="text-white" />
                  </div>
                )}
                <div 
                  className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm shadow-sm",
                    m.role === 'user' 
                      ? 'bg-[#C8A24D] text-white rounded-tr-none' 
                      : 'bg-white border text-gray-800 rounded-tl-none'
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start gap-2">
                <div className="w-6 h-6 rounded-full bg-[#C8A24D] flex items-center justify-center shrink-0">
                  <Loader2 size={12} className="text-white animate-spin" />
                </div>
                <div className="bg-white border p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form 
            onSubmit={handleSubmit} 
            className="p-4 border-t bg-white flex items-center gap-2"
          >
            <input 
              value={input} 
              onChange={handleInputChange} 
              placeholder="Ask me anything..." 
              className="flex-1 text-sm outline-none bg-gray-100 py-2 px-4 rounded-full border-none focus:ring-1 focus:ring-[#C8A24D] transition-all" 
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!input || isLoading} 
              className="rounded-full bg-[#C8A24D] hover:bg-[#b38f40] shrink-0 h-9 w-9"
            >
              <Send size={16} className="text-white"/>
            </Button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "bg-[#C8A24D] text-white p-4 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all duration-300",
          isOpen && "rotate-90 bg-white border text-[#C8A24D]"
        )}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
}
