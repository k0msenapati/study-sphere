'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, RotateCcw, Square, Sparkles, Plus, Paperclip, Image, FileText, Zap } from 'lucide-react';
import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { FiTrash2 } from 'react-icons/fi';

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
    reloadMessages,
    stopGeneration,
    isLoading,
  } = useCopilotChat();

  const [inputValue, setInputValue] = useState('');
  const [showFullChat, setShowFullChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const savedPairs = useRef<Set<string>>(new Set());
  const [isSending, setIsSending] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ id: string; prompt: string; response: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const messages: Message[] = visibleMessages.map(msg => {
    const textMsg = msg as TextMessage;
    return {
      content: textMsg.content,
      role: textMsg.role === Role.User ? 'User' : 'Assistant',
      createdAt: textMsg.createdAt || new Date()
    };
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (content: string) => {
    if (!content.trim() || isSending) return;
    setIsSending(true);
    appendMessage(new TextMessage({ content: content.trim(), role: Role.User }));
    setInputValue('');
    setShowFullChat(true);
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
    if (messages.length > 0) {
      const lastMessageId = (visibleMessages[visibleMessages.length - 1] as any)?.id;
      if (lastMessageId) {
        reloadMessages(lastMessageId);
      }
    }
    setShowFullChat(false);
  };

  const formatTime = (timestamp: string | Date) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  useEffect(() => {
    if (!isLoading) {
      setIsSending(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (messages.length < 2) return;
    const last = messages[messages.length - 1];
    const secondLast = messages[messages.length - 2];
    const key = `${secondLast.content}__${last.content}`;
    const bothRecent =
      typeof last.createdAt === 'string' && typeof secondLast.createdAt === 'string'
        ? Math.abs(new Date(last.createdAt).getTime() - new Date(secondLast.createdAt).getTime()) < 30_000
        : true;
    if (
      !isLoading &&
      secondLast.role === 'User' &&
      last.role === 'Assistant' &&
      last.content &&
      secondLast.content &&
      bothRecent &&
      !savedPairs.current.has(key)
    ) {
      savedPairs.current.add(key);
      fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: secondLast.content,
          response: last.content,
        }),
      }).catch(console.error);
    }
  }, [messages]);

  useEffect(() => {
    fetch('/api/chats')
      .then(res => res.json())
      .then(data => {
        setChatHistory(data.reverse());
      })
      .catch(console.error);
  }, []);

  if (!showFullChat && messages.length <= 1) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-xl">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              What can I help you study?
            </h1>
            <p className="text-muted-foreground text-lg">
              Your AI-powered study companion is ready to help with anything
            </p>
          </div>

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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Zap, label: "Study Tips", desc: "Get effective study strategies" },
              { icon: FileText, label: "Essay Help", desc: "Writing and structure guidance" },
              { icon: Plus, label: "Create Quiz", desc: "Generate quiz questions" },
              { icon: Image, label: "Concept Maps", desc: "Visual learning aids" }
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => sendMessage(`Help me with ${action.label.toLowerCase()}`)}
                className="p-4 bg-card hover:bg-card/80 border border-border hover:border-border/80 rounded-xl transition-all duration-200 text-left group shadow-sm hover:shadow-md"
                type="button"
              >
                <action.icon className="w-6 h-6 text-foreground mb-2 group-hover:text-muted-foreground transition-colors" />
                <div className="text-foreground font-medium mb-1">{action.label}</div>
                <div className="text-muted-foreground text-sm">{action.desc}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Create a quiz about quantum physics",
              "Help with essay writing",
              "Generate quiz questions from my notes",
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
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="fixed bottom-6 left-6 bg-black text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-all z-50">Previous Chats</button>

        {showHistory && (
          <div className="fixed bottom-20 left-6 bg-card border border-border shadow-lg rounded-lg w-80 max-h-96 overflow-y-auto z-50">
            <div className="p-4 border-b font-semibold text-gray-700 flex justify-between items-center">
              Chat History
              <button
                onClick={() => setShowHistory(false)}
                className="text-sm text-gray-400 hover:text-black"
              >
                ✕
              </button>
            </div>
            <div className="divide-y">
              {chatHistory.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">No previous chats</div>
              ) : (
                chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className="group relative p-3 hover:bg-gray-50"
                  >
                    <div className="text-sm font-medium text-black truncate pr-6">{chat.prompt}</div>
                    <div className="text-xs text-gray-500 line-clamp-2 pr-6">{chat.response}</div>
                    <button
                      onClick={async () => {
                        try {
                          await fetch("/api/chats", {
                            method: "DELETE",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ id: chat.id }),
                          });

                          setChatHistory((prev) => prev.filter((c) => c.id !== chat.id));
                        } catch (err) {
                          console.error("Error deleting chat:", err);
                        }
                      }}
                      title="Delete chat"
                      className="absolute right-2 top-2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div className="flex items-center justify-between p-6 border-b border-border bg-background">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">StudySphere AI</h1>
            <p className="text-sm text-muted-foreground font-medium">Your AI Study Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleReloadMessages}
            className="p-3 rounded-2xl bg-secondary hover:bg-secondary/80 transition-all duration-200 border border-border hover:border-border/80"
            title="Reload messages"
            type="button"
          >
            <RotateCcw className="w-5 h-5 text-secondary-foreground" />
          </button>
          <button
            onClick={clearChat}
            className="p-3 rounded-2xl bg-secondary hover:bg-secondary/80 transition-all duration-200 border border-border hover:border-border/80"
            title="Clear chat"
            type="button"
          >
            <Trash2 className="w-5 h-5 text-secondary-foreground" />
          </button>
          {isLoading && (
            <button
              onClick={stopGeneration}
              className="p-3 rounded-2xl bg-primary hover:bg-primary/90 transition-all duration-200 border border-border"
              title="Stop generation"
              type="button"
            >
              <Square className="w-5 h-5 text-primary-foreground" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'User' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${message.role === 'User' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-4`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${message.role === 'User'
                  ? 'bg-primary ml-4'
                  : 'bg-card border-2 border-border mr-4'
                  }`}>
                  {message.role === 'User' ? (
                    <User className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <Bot className="w-5 h-5 text-foreground" />
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <div className={`rounded-3xl px-6 py-4 shadow-lg ${message.role === 'User'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground border border-border'
                    }`}>
                    <div className="whitespace-pre-wrap break-words leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  <div className={`text-xs px-2 ${message.role === 'User' ? 'text-right text-muted-foreground' : 'text-left text-muted-foreground'
                    }`}>
                    {formatTime(message.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[85%] items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-card border-2 border-border mr-4 flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-foreground" />
                </div>
                <div className="bg-card border border-border rounded-3xl px-6 py-4 shadow-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-6 border-t border-border bg-background">
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
                className="w-full px-6 py-4 bg-input border border-border rounded-3xl text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 min-h-[56px] max-h-32"
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