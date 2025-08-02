"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Footer = () => {
  const router = useRouter();

  const APP_LINKS = {
    googlePlay: process.env.NEXT_PUBLIC_ANDROID_APP_URL || '',
    appStore: process.env.NEXT_PUBLIC_IOS_APP_URL || '',
  };

  const handleLogout = async () => {
    try {
      // await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <Link href="/contact" className="block hover:text-blue-400 transition-colors">
              Contact Us
            </Link>
            <button
              onClick={handleLogout}
              className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors"
              aria-label="Log out of your account"
            >
              Log Out
            </button>
          </div>

          {/* View Pages */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">View Pages</h3>
            <div className="flex flex-col space-y-2">
              {["courses", "dashboard", "university-info", "communication"].map((page) => (
                <Link key={page} href={`/${page}`} className="text-gray-300 hover:text-blue-400 transition-colors capitalize">
                  {page.replace("-", " ")}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile App Links */}
          {(APP_LINKS.googlePlay || APP_LINKS.appStore) && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Get the Mobile App</h3>
              <div className="flex flex-col space-y-2">
                {APP_LINKS.googlePlay && (
                  <a
                    href={APP_LINKS.googlePlay}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-black hover:bg-gray-800 px-4 py-2 rounded-md transition-colors"
                    aria-label="Download from Google Play"
                  >
                    <span className="w-5 h-5">📱</span><span>Google Play</span>
                  </a>
                )}
                {APP_LINKS.appStore && (
                  <a
                    href={APP_LINKS.appStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-black hover:bg-gray-800 px-4 py-2 rounded-md transition-colors"
                    aria-label="Download from App Store"
                  >
                    <span className="w-5 h-5">🍎</span><span>App Store</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Need Help?</h3>
            <Link href="/contact" className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
              <span className="w-5 h-5">❓</span><span>Get Support</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-orange-700 py-3">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white text-sm">Developed by UIS 2025 • All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
