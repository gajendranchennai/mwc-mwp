import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { chatWithAssistant } from '../services/geminiService';
import { Send, Sparkles, Bot, User } from 'lucide-react';

interface AIAssistantProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ messages, setMessages }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const stream = await chatWithAssistant(history, userMessage.text);
      
      const botMessageId = (Date.now() + 1).toString();
      let fullResponse = "";
      
      setMessages(prev => [...prev, {
        id: botMessageId,
        role: 'model',
        text: '',
        timestamp: Date.now()
      }]);

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          fullResponse += text;
          setMessages(prev => prev.map(m => 
            m.id === botMessageId ? { ...m, text: fullResponse } : m
          ));
        }
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I'm having a little trouble connecting to the wedding planning cloud right now. Please try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
      <div className="bg-white p-5 border-b border-gray-100 flex items-center space-x-4 shadow-sm z-10">
        <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-3 rounded-2xl text-white shadow-lg shadow-brand-200">
            <Bot size={24} />
        </div>
        <div>
          <h2 className="font-serif font-bold text-gray-800 text-lg">Bella</h2>
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
             <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">AI Wedding Planner</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-6">
            <div className="bg-white p-6 rounded-full shadow-soft">
               <Sparkles size={48} className="text-brand-300" />
            </div>
            <div className="text-center max-w-md">
              <h3 className="text-gray-800 font-bold text-lg mb-2">How can I help you today?</h3>
              <p className="text-gray-500 mb-6">Ask for venue ideas, vow drafts, or etiquette advice.</p>
              <div className="flex flex-wrap justify-center gap-2">
                 <button onClick={() => setInput("Write romantic vows")} className="text-xs bg-white border border-gray-200 hover:border-brand-300 hover:text-brand-600 px-4 py-2 rounded-full transition-colors">"Write romantic vows"</button>
                 <button onClick={() => setInput("Suggest first dance songs")} className="text-xs bg-white border border-gray-200 hover:border-brand-300 hover:text-brand-600 px-4 py-2 rounded-full transition-colors">"Suggest first dance songs"</button>
              </div>
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end space-x-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0">
                <Bot size={16} />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl p-5 shadow-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-br-none'
                  : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
            </div>
             {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0">
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-center space-x-2">
             <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0">
                <Bot size={16} />
              </div>
             <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 flex space-x-2 items-center shadow-sm">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-5 border-t border-gray-100 bg-white">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            className="flex-1 bg-gray-50 border-gray-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 border p-4 shadow-inner focus:bg-white transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-brand-600 hover:bg-brand-700 text-white p-4 rounded-xl disabled:opacity-50 transition-colors shadow-lg shadow-brand-200"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;