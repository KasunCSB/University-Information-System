export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface Message {
  id?: string;
  roomId: string;
  content: string;
  type: 'text' | 'file' | 'image' | 'system';
  timestamp: Date;
  user: User;
  edited?: boolean;
  editedAt?: Date;
  replyTo?: string;
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  emoji: string;
  users: string[];
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: 'direct' | 'group' | 'announcement';
  isPrivate: boolean;
  allowedRoles: UserRole[];
  participants: User[];
  lastMessage?: Message;
  unreadCount?: number;
  createdBy: string;
  createdAt: Date;
  avatar?: string;
}

export interface CreateRoomData {
  name: string;
  description?: string;
  type: 'direct' | 'group' | 'announcement';
  isPrivate: boolean;
  allowedRoles: UserRole[];
}

export interface WebSocketMessage {
  type: 'message' | 'user_joined' | 'user_left' | 'room_created' | 'typing' | 'online_users';
  data: Message | User | ChatRoom | TypingIndicator | User[];
}

export interface TypingIndicator {
  roomId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}
