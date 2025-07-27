'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatRoom, Message, User } from '../types';
import { MessageInput } from './MessageInput';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  room: ChatRoom;
  messages: Message[];
  currentUser: User;
  onSendMessage: (content: string, type?: 'text' | 'file') => void;
  onlineUsers: User[];
}

export function ChatWindow({ 
  room, 
  messages, 
  currentUser, 
  onSendMessage, 
  onlineUsers 
}: ChatWindowProps) {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string, type: 'text' | 'file' = 'text') => {
    onSendMessage(content, type);
  };

  const getRoomIcon = () => {
    switch (room.type) {
      case 'announcement':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        );
      case 'direct':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const dateKey = new Date(message.timestamp).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              room.type === 'announcement' 
                ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400'
                : room.isPrivate
                ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400'
                : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
            }`}>
              {getRoomIcon()}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {room.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {room.description || `${room.participants.length} members`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Room Info Button */}
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* Settings Button */}
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Online Users Indicator */}
        <div className="flex items-center mt-2 space-x-2">
          <div className="flex -space-x-2">
            {onlineUsers.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-white font-medium"
                title={user.name}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {onlineUsers.length} online
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
      >
        {Object.entries(messageGroups).map(([dateKey, dayMessages]) => (
          <div key={dateKey}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-4">
              <div className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                {new Date(dateKey).toLocaleDateString([], { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>

            {/* Messages for this date */}
            {dayMessages.map((message, index) => (
              <MessageBubble
                // @ts-ignore - React key prop issue with strict typing
                key={message.id || `msg-${index}`}
                message={message}
                isOwn={message.user.id === currentUser.id}
                showAvatar={
                  index === 0 || 
                  dayMessages[index - 1].user.id !== message.user.id
                }
                showTimestamp={
                  index === dayMessages.length - 1 ||
                  dayMessages[index + 1].user.id !== message.user.id ||
                  new Date(dayMessages[index + 1].timestamp).getTime() - 
                  new Date(message.timestamp).getTime() > 300000
                }
              />
            ))}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm">Someone is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={room.type === 'announcement' && currentUser.role === 'student'}
          placeholder={
            room.type === 'announcement' && currentUser.role === 'student'
              ? 'Only teachers and admins can post announcements'
              : `Message ${room.name}...`
          }
        />
      </div>
    </div>
  );
}
