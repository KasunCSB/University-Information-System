'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  showTimestamp: boolean;
}

export function MessageBubble({ message, isOwn, showAvatar, showTimestamp }: MessageBubbleProps) {
  const [showReactions, setShowReactions] = useState(false);

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 dark:text-red-400';
      case 'teacher':
        return 'text-blue-600 dark:text-blue-400';
      case 'student':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'file':
        return (
          <div className="flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span className="text-sm">{message.content}</span>
          </div>
        );
      case 'system':
        return (
          <div className="text-center py-2">
            <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full">
              {message.content}
            </span>
          </div>
        );
      case 'image':
        return (
          <div>
            <Image 
              src={message.content} 
              alt="Shared image" 
              className="max-w-xs rounded-lg"
              width={300}
              height={200}
              style={{ objectFit: 'cover' }}
            />
          </div>
        );
      default:
        return (
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        );
    }
  };

  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-4">
        {renderMessageContent()}
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
        {/* Avatar */}
        {showAvatar && !isOwn && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {message.user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        {/* Message Content */}
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
          {/* User Name and Role */}
          {showAvatar && !isOwn && (
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {message.user.name}
              </span>
              <span className={`text-xs ${getRoleColor(message.user.role)}`}>
                {message.user.role}
              </span>
            </div>
          )}

          {/* Message Bubble */}
          <div 
            className={`relative px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-blue-500 text-white rounded-br-md'
                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-md'
            } ${message.type === 'file' ? 'p-2' : ''}`}
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
          >
            {renderMessageContent()}

            {/* Message Actions */}
            {showReactions && (
              <div className={`absolute top-0 ${
                isOwn ? 'right-full mr-2' : 'left-full ml-2'
              } flex items-center space-x-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                <button 
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                  title="Add reaction"
                >
                  😊
                </button>
                <button 
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                  title="Reply"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </button>
                {isOwn && (
                  <button 
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Edited Indicator */}
            {message.edited && (
              <span className="text-xs opacity-70 mt-1 block">
                (edited)
              </span>
            )}
          </div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {message.reactions.map((reaction, index) => (
                <button
                  key={index}
                  className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {reaction.users.length}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Timestamp */}
          {showTimestamp && (
            <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
              isOwn ? 'text-right' : 'text-left'
            }`}>
              {formatTime(message.timestamp)}
              {message.edited && (
                <span className="ml-1">(edited)</span>
              )}
            </div>
          )}
        </div>

        {/* Own Avatar Space */}
        {showAvatar && isOwn && (
          <div className="w-8 h-8"></div>
        )}
      </div>
    </div>
  );
}
