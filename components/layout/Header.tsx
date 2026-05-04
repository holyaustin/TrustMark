'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Sun, Moon, LogOut, User, Menu, X, Shield, Home, Info, Award, LogIn } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Header() {
  const { isDark, toggleTheme, mounted: themeMounted } = useTheme();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/how-it-works', label: 'How It Works', icon: Info },
    { href: '/pricing', label: 'Pricing', icon: Award },
  ];

  // Don't render theme-dependent content until mounted on client
  const renderThemeIcon = () => {
    if (!mounted || !themeMounted) {
      return <Moon size={20} />;
    }
    return isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-lg'
            : 'bg-white dark:bg-black'
        } border-b border-gray-200 dark:border-gray-800`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0" onClick={closeMenu}>
              <Shield className="w-6 h-6 md:w-7 md:h-7 text-royal-600 dark:text-royal-400" />
              <span className="text-xl md:text-2xl font-bold text-royal-800 dark:text-royal-400">
                TrustMark
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-royal-600 dark:hover:text-royal-400 transition font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Toggle theme"
              >
                {renderThemeIcon()}
              </button>

              {/* Desktop Auth Buttons */}
              {mounted && (
                <div className="hidden md:flex items-center space-x-3">
                  {user ? (
                    <>
                      <Link href="/dashboard">
                        <Button variant="secondary" size="sm">
                          <User size={16} className="mr-1" /> Dashboard
                        </Button>
                      </Link>
                      <Button variant="danger" size="sm" onClick={logout}>
                        <LogOut size={16} className="mr-1" /> Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="outline" size="sm">
                          <LogIn size={16} className="mr-1" /> Login
                        </Button>
                      </Link>
                      <Link href="/get-verified">
                        <Button variant="primary" size="sm" className="shadow-md hover:shadow-lg">
                          Get Verified
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeMenu}
      />

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-royal-600" />
              <span className="text-lg font-bold text-royal-800">TrustMark</span>
            </div>
            <button onClick={closeMenu} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <X size={20} />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1 py-6 px-4">
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-royal-600 dark:hover:text-royal-400 transition py-2"
                  >
                    <link.icon size={20} />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                </li>
              ))}
              {mounted && user && (
                <>
                  <li>
                    <Link
                      href="/dashboard"
                      onClick={closeMenu}
                      className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-royal-600 dark:hover:text-royal-400 transition py-2"
                    >
                      <User size={20} />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="w-full flex items-center space-x-3 text-red-600 hover:text-red-700 transition py-2"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Logout</span>
                    </button>
                  </li>
                </>
              )}
              {mounted && !user && (
                <>
                  <li>
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-royal-600 dark:hover:text-royal-400 transition py-2"
                    >
                      <LogIn size={20} />
                      <span className="font-medium">Login</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/get-verified"
                      onClick={closeMenu}
                      className="block w-full"
                    >
                      <Button variant="primary" className="w-full">
                        Get Verified
                      </Button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
            <button
              onClick={() => {
                toggleTheme();
                closeMenu();
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {mounted && themeMounted ? (isDark ? <Sun size={18} /> : <Moon size={18} />) : <Moon size={18} />}
              <span>{mounted && themeMounted ? (isDark ? 'Light Mode' : 'Dark Mode') : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}