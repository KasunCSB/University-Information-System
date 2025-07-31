'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Message, ChatRoom, User, CreateRoomData } from '../types';

export function useWebSocket(currentUser: User) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize default rooms
  useEffect(() => {
    const defaultRooms: ChatRoom[] = [
      {
        id: 'general',
        name: 'General',
        description: 'General discussion for all university members',
        type: 'group',
        isPrivate: false,
        allowedRoles: ['student', 'teacher', 'admin'],
        participants: [],
        createdBy: 'system',
        createdAt: new Date()
      },
      {
        id: 'announcements',
        name: 'Announcements',
        description: 'Official university announcements',
        type: 'announcement',
        isPrivate: false,
        allowedRoles: ['student', 'teacher', 'admin'],
        participants: [],
        createdBy: 'system',
        createdAt: new Date()
      },
      {
        id: 'teachers-only',
        name: 'Teachers Lounge',
        description: 'Private discussion for teaching staff',
        type: 'group',
        isPrivate: true,
        allowedRoles: ['teacher', 'admin'],
        participants: [],
        createdBy: 'system',
        createdAt: new Date()
      },
      {
        id: 'students-help',
        name: 'Student Help Desk',
        description: 'Get help with academic questions',
        type: 'group',
        isPrivate: false,
        allowedRoles: ['student', 'teacher', 'admin'],
        participants: [],
        createdBy: 'system',
        createdAt: new Date()
      }
    ];

    setRooms(defaultRooms.filter(room => 
      room.allowedRoles.includes(currentUser.role)
    ));

    // Initialize with some sample messages
    const sampleMessages: Message[] = [
      {
        id: '1',
        roomId: 'general',
        content: 'Welcome to the University Communication System!',
        type: 'system',
        timestamp: new Date(Date.now() - 3600000),
        user: {
          id: 'system',
          name: 'System',
          avatar: '',
          role: 'admin'
        }
      },
      {
        id: '2',
        roomId: 'announcements',
        content: 'New semester registration opens next week. Please check your academic portal for details.',
        type: 'text',
        timestamp: new Date(Date.now() - 1800000),
        user: {
          id: 'admin1',
          name: 'Academic Office',
          avatar: '',
          role: 'admin'
        }
      }
    ];

    setMessages(sampleMessages);
  }, [currentUser.role]);

  // Simulate WebSocket connection (replace with actual WebSocket implementation)
  useEffect(() => {
    let isMounted = true;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    // In a real implementation, you would connect to your WebSocket server here
    const connectWebSocket = () => {
      try {
        // Simulate connection
        if (isMounted) {
          setIsConnected(true);
          
          // Simulate some online users
          const mockOnlineUsers: User[] = [
            { id: '1', name: 'Alice Johnson', avatar: '', role: 'student', isOnline: true },
            { id: '2', name: 'Prof. Smith', avatar: '', role: 'teacher', isOnline: true },
            { id: '3', name: 'Admin User', avatar: '', role: 'admin', isOnline: true }
          ];
          setOnlineUsers(mockOnlineUsers);

          // Remove console.log for production
          if (process.env.NODE_ENV === 'development') {
            console.log('WebSocket connected (simulated)');
          }
        }
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        if (isMounted) {
          setIsConnected(false);
          
          // Retry connection after 3 seconds
          reconnectTimeout = setTimeout(() => {
            if (isMounted) {
              connectWebSocket();
            }
          }, 3000);
          reconnectTimeoutRef.current = reconnectTimeout;
        }
      }
    };

    connectWebSocket();

    return () => {
      isMounted = false;
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      setIsConnected(false);
      // Note: In a real implementation, you would close the WebSocket connection here
    };
  }, []);

  const sendMessage = useCallback((message: Omit<Message, 'id'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);

    // In a real implementation, send to WebSocket server
    if (process.env.NODE_ENV === 'development') {
      console.log('Sending message:', newMessage);
    }
  }, []);

  const createRoom = useCallback((roomData: CreateRoomData) => {
    const newRoom: ChatRoom = {
      ...roomData,
      id: Date.now().toString(),
      participants: [currentUser],
      createdBy: currentUser.id,
      createdAt: new Date()
    };

    setRooms(prev => [...prev, newRoom]);

    // Send system message
    const systemMessage: Message = {
      id: Date.now().toString(),
      roomId: newRoom.id,
      content: `${currentUser.name} created this ${roomData.type}`,
      type: 'system',
      timestamp: new Date(),
      user: {
        id: 'system',
        name: 'System',
        avatar: '',
        role: 'admin'
      }
    };

    setMessages(prev => [...prev, systemMessage]);

    if (process.env.NODE_ENV === 'development') {
      console.log('Creating room:', newRoom);
    }
  }, [currentUser]);

  const joinRoom = useCallback((roomId: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        const isAlreadyParticipant = room.participants.some(p => p.id === currentUser.id);
        if (!isAlreadyParticipant) {
          return {
            ...room,
            participants: [...room.participants, currentUser]
          };
        }
      }
      return room;
    }));

    console.log('Joining room:', roomId);
  }, [currentUser]);

  const leaveRoom = useCallback((roomId: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          participants: room.participants.filter(p => p.id !== currentUser.id)
        };
      }
      return room;
    }));

    console.log('Leaving room:', roomId);
  }, [currentUser.id]);

  return {
    messages,
    rooms,
    onlineUsers,
    isConnected,
    sendMessage,
    createRoom,
    joinRoom,
    leaveRoom
  };
}
