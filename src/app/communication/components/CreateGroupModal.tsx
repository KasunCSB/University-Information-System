'use client';

import React, { useState } from 'react';
import { UserRole } from '../types';

interface CreateGroupModalProps {
  onClose: () => void;
  onCreate: (name: string, description: string, isPrivate: boolean) => void;
  userRole: UserRole;
}

export function CreateGroupModal({ onClose, onCreate, userRole }: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [groupType, setGroupType] = useState<'study' | 'project' | 'social' | 'other'>('study');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), description.trim(), isPrivate);
    }
  };

  const groupTypeOptions = [
    {
      value: 'study' as const,
      label: 'Study Group',
      description: 'For academic discussions and study sessions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      value: 'project' as const,
      label: 'Project Team',
      description: 'For collaborative projects and assignments',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      value: 'social' as const,
      label: 'Social Group',
      description: 'For casual conversations and social interactions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      value: 'other' as const,
      label: 'Other',
      description: 'Custom group for specific purposes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create New Group
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Group Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Group Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {groupTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setGroupType(option.value)}
                    className={`p-3 rounded-lg border-2 transition-colors text-left ${
                      groupType === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`${groupType === option.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                        {option.icon}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {option.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Group Name */}
            <div>
              <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Group Name *
              </label>
              <input
                id="groupName"
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                maxLength={50}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {name.length}/50 characters
              </p>
            </div>

            {/* Group Description */}
            <div>
              <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="groupDescription"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder="Describe the purpose of this group..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={200}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {description.length}/200 characters
              </p>
            </div>

            {/* Privacy Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Privacy Settings
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Control who can join this group
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    checked={!isPrivate}
                    onChange={() => setIsPrivate(false)}
                    className="mt-1 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      Public Group
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Anyone with your role or higher can join this group
                    </div>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(true)}
                    className="mt-1 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      Private Group
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Only invited members can join this group
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Role Information */}
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    Creating as: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    You will be the group administrator and can manage members and settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                Create Group
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
