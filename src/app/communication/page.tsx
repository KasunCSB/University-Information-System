'use client';

import React, { useState, useEffect } from 'react';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatWindow } from './components/ChatWindow';
import { UserRoleSelector } from './components/UserRoleSelector';
import { CreateGroupModal } from './components/CreateGroupModal';
import { useWebSocket } from './hooks/useWebSocket';
import { UserRole, ChatRoom } from './types';

export default function CommunicationPage() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [currentUser] = useState({
    id: '1',
    name: 'John Doe',
    avatar: '/images/login-avatar.png',
    role: userRole
  });

  const { 
    messages, 
    rooms, 
    onlineUsers, 
    sendMessage, 
    createRoom, 
    joinRoom, 
    isConnected 
  } = useWebSocket(currentUser);

  useEffect(() => {
    // Auto-join general room on load
    if (rooms.length > 0 && !selectedRoom) {
      const generalRoom = rooms.find(room => room.name === 'General');
      if (generalRoom) {
        setSelectedRoom(generalRoom);
        joinRoom(generalRoom.id);
      }
    }
  }, [rooms, selectedRoom, joinRoom]);

  const handleRoomSelect = (room: ChatRoom) => {
    setSelectedRoom(room);
    joinRoom(room.id);
  };

  const handleCreateGroup = (name: string, description: string, isPrivate: boolean) => {
    createRoom({
      name,
      description,
      type: 'group',
      isPrivate,
      allowedRoles: isPrivate ? [userRole] : ['student', 'teacher', 'admin']
    });
    setShowCreateGroup(false);
  };

  const handleSendMessage = (content: string, type: 'text' | 'file' = 'text') => {
    if (selectedRoom) {
      sendMessage({
        roomId: selectedRoom.id,
        content,
        type,
        timestamp: new Date(),
        user: currentUser
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Connection Status */}
      <div className={`fixed top-4 right-4 z-50 px-3 py-1 rounded-full text-sm font-medium ${
        isConnected 
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      }`}>
        {isConnected ? '● Connected' : '● Disconnected'}
      </div>

      {/* User Role Selector */}
      <UserRoleSelector 
        currentRole={userRole} 
        onRoleChange={setUserRole}
        className="absolute top-4 left-4 z-40"
      />

      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <ChatSidebar
          rooms={rooms}
          selectedRoom={selectedRoom}
          onRoomSelect={handleRoomSelect}
          onCreateGroup={() => setShowCreateGroup(true)}
          onlineUsers={onlineUsers}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <ChatWindow
            room={selectedRoom}
            messages={messages.filter(msg => msg.roomId === selectedRoom.id)}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onlineUsers={onlineUsers}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Welcome to University Communication
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Select a chat room to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onCreate={handleCreateGroup}
          userRole={userRole}
        />
      )}
    </div>
  );
}
