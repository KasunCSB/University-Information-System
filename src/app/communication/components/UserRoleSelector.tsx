'use client';

import React, { useState } from 'react';
import { UserRole } from '../types';

interface UserRoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  className?: string;
}

export function UserRoleSelector({ currentRole, onRoleChange, className = '' }: UserRoleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const roles: { value: UserRole; label: string; description: string; color: string }[] = [
    {
      value: 'student',
      label: 'Student',
      description: 'Access to general discussions and student resources',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    },
    {
      value: 'teacher',
      label: 'Teacher',
      description: 'Access to teaching resources and staff discussions',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    },
    {
      value: 'admin',
      label: 'Administrator',
      description: 'Full access to all university communications',
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
  ];

  const currentRoleData = roles.find(role => role.value === currentRole);

  const handleRoleSelect = (role: UserRole) => {
    onRoleChange(role);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className={`w-3 h-3 rounded-full ${currentRoleData?.color.split(' ')[0] || 'bg-gray-500'}`}></div>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {currentRoleData?.label}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Menu */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 px-2">
                Select Role
              </div>
              {roles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => handleRoleSelect(role.value)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentRole === role.value
                      ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-4 h-4 rounded-full mt-0.5 ${role.color.split(' ')[0]}`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {role.label}
                        </h3>
                        {currentRole === role.value && (
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Note */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Different roles have access to different communication channels and features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
