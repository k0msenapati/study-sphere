'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, RotateCcw, Square, Sparkles, Plus, Paperclip, Image, FileText, Zap } from 'lucide-react';
import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";

interface Message {
  content: string;
  role: 'User' | 'Assistant';
  createdAt: Date | string;
}

export default function StudySphereChat() {
  const {
    visibleMessages,
    appendMessage,
    setMessages,
    deleteMessage,
    reloadMessages,
    stopGeneration,
    isLoading,
  } = useCopilotChat();

  const [inputValue, setInputValue] = useState('');
  const [showFullChat, setShowFullChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Convert CopilotKit messages to our format
  const messages: Message[] = visibleMessages.map(msg => ({
    content: msg.content,
    role: msg.role === Role.User ? 'User' : 'Assistant',
    createdAt: msg.createdAt || new Date()
  }));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (content: string) => {
    if (content.trim()) {
      appendMessage(new TextMessage({ content: content.trim(), role: Role.User }));
      setInputValue('');
      setShowFullChat(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowFullChat(false);
  };

  const handleReloadMessages = () => {
    reloadMessages();
    setShowFullChat(false);
  };

  const formatTime = (timestamp: string | Date) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // Initial landing view
  if (!showFullChat && messages.length <= 1) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-black mb-4">
              What can I help you study?
            </h1>
            <p className="text-gray-600 text-lg">
              Your AI-powered study companion is ready to help with anything
            </p>
          </div>

          {/* Input Area */}
          <div className="relative mb-8">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your AI study assistant a question..."
                rows={1}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-black placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 min-h-[60px] max-h-32"
                style={{
                  height: 'auto',
                  minHeight: '60px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                }}
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-black transition-colors rounded-lg hover:bg-gray-100"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 bg-black hover:bg-gray-800 disabled:bg-gray-300 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                  title="Send message"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Zap, label: "Study Tips", desc: "Get effective study strategies" },
              { icon: FileText, label: "Essay Help", desc: "Writing and structure guidance" },
              { icon: Plus, label: "Math Problems", desc: "Step-by-step solutions" },
              { icon: Image, label: "Concept Maps", desc: "Visual learning aids" }
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => sendMessage(`Help me with ${action.label.toLowerCase()}`)}
                className="p-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200 text-left group shadow-sm hover:shadow-md"
                type="button"
              >
                <action.icon className="w-6 h-6 text-black mb-2 group-hover:text-gray-700 transition-colors" />
                <div className="text-black font-medium mb-1">{action.label}</div>
                <div className="text-gray-600 text-sm">{action.desc}</div>
              </button>
            ))}
          </div>

          {/* Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Explain quantum physics concepts",
              "Help with essay writing",
              "Solve math problems step by step",
              "Create study schedules"
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => sendMessage(suggestion)}
                className="p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-xl text-left transition-all duration-200 group"
                type="button"
              >
                <div className="text-black font-medium group-hover:text-gray-700 transition-colors">
                  {suggestion}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Full chat interface
  return (
    <div className="flex flex-col h-screen bg-white text-black">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">StudySphere AI</h1>
            <p className="text-sm text-gray-600 font-medium">Your AI Study Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleReloadMessages}
            className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 border border-gray-200 hover:border-gray-300"
            title="Reload messages"
            type="button"
          >
            <RotateCcw className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={clearChat}
            className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 border border-gray-200 hover:border-gray-300"
            title="Clear chat"
            type="button"
          >
            <Trash2 className="w-5 h-5 text-gray-700" />
          </button>
          {isLoading && (
            <button
              onClick={stopGeneration}
              className="p-3 rounded-2xl bg-gray-800 hover:bg-black transition-all duration-200 border border-gray-300"
              title="Stop generation"
              type="button"
            >
              <Square className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'User' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${message.role === 'User' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-4`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                  message.role === 'User' 
                    ? 'bg-black ml-4' 
                    : 'bg-white border-2 border-gray-300 mr-4'
                }`}>
                  {message.role === 'User' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-black" />
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <div className={`rounded-3xl px-6 py-4 shadow-lg ${
                    message.role === 'User' 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black border border-gray-200'
                  }`}>
                    <div className="whitespace-pre-wrap break-words leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  <div className={`text-xs px-2 ${
                    message.role === 'User' ? 'text-right text-gray-500' : 'text-left text-gray-500'
                  }`}>
                    {formatTime(message.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[85%] items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-white border-2 border-gray-300 mr-4 flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-black" />
                </div>
                <div className="bg-white border border-gray-200 rounded-3xl px-6 py-4 shadow-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your studies..."
                rows={1}
                className="w-full px-6 py-4 bg-gray-100 border border-gray-300 rounded-3xl text-black placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 min-h-[56px] max-h-32"
                style={{
                  height: 'auto',
                  minHeight: '56px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                }}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isLoading}
              className="w-14 h-14 bg-black hover:bg-gray-800 disabled:bg-gray-400 rounded-2xl flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex items-center justify-center mt-4">
            <p className="text-sm text-gray-500 font-medium">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}