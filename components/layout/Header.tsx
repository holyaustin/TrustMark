'use client';

import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Sun, Moon, LogOut, User } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container-custom py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-royal-800 dark:text-royal-400">TrustMark</span>
          <span className="text-xs bg-royal-100 dark:bg-royal-900 px-2 py-0.5 rounded">Verified</span>
        </Link>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <User size={20} />
                </button>
              </Link>
              <button onClick={logout} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link href="/">
              <Button variant="primary" size="sm">Get Verified</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}