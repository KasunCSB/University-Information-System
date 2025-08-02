"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Footer = () => {
  const router = useRouter();
  
  // Mobile app store URLs - replace with actual URLs when available
  const APP_LINKS = {
    googlePlay: process.env.NEXT_PUBLIC_ANDROID_APP_URL || '#',
    appStore: process.env.NEXT_PUBLIC_IOS_APP_URL || '#',
  };

  const handleLogout = async () => {
    try {
      // Add your actual logout API call here
      // For example: await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Section */}
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

          {/* View Pages Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">View Pages</h3>
            <div className="flex flex-col space-y-2">
              <Link 
                href="/courses" 
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Courses
              </Link>
              <Link 
                href="/dashboard" 
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                href="/university-info" 
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                University Info
              </Link>
              <Link 
                href="/communication" 
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Communication
              </Link>
            </div>
          </div>

          {/* Mobile App Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Get the Mobile App</h3>
            <div className="flex flex-col space-y-2">
              {APP_LINKS.googlePlay && APP_LINKS.googlePlay !== '#' && (
                <a
                  href={APP_LINKS.googlePlay}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-black hover:bg-gray-800 px-4 py-2 rounded-md transition-colors"
                  aria-label="Download our Android app from Google Play"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Google Play</span>
                </a>
              )}
              {APP_LINKS.appStore && APP_LINKS.appStore !== '#' && (
                <a
                  href={APP_LINKS.appStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-black hover:bg-gray-800 px-4 py-2 rounded-md transition-colors"
                  aria-label="Download our iOS app from the App Store"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span>App Store</span>
                </a>
              )}
            </div>
          </div>

          {/* Support Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Need Help?</h3>
            <Link
              href="/contact"
              className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Get Support</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Developer Credit Bar */}
      <div className="bg-orange-700 py-3">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white text-sm">
            Developed by UIS 2025 • All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
