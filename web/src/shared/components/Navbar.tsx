'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
  useClerk,
} from '@clerk/nextjs';

const NavSkeleton = () => (
  <div className='flex items-center space-x-5'>
    <div className='h-6 w-16 animate-pulse rounded-md bg-white/15'></div>
    <div className='h-6 w-20 animate-pulse rounded-md bg-white/15'></div>
  </div>
);

const Navbar = () => {
  const pathname = usePathname();
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle logout with loading state
  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Common navigation items
  const navItems = [
    ...(isLoaded && userId
      ? [
          {
            label: 'Log out',
            isButton: true,
            onClick: handleLogout,
          },
        ]
      : [
          { href: '/login', label: 'Login' },
          { href: '/signup', label: 'Sign Up', isSpecial: false },
        ]),
  ];

  // Common link styles with active state
  const getLinkStyles = (href: string) => {
    const isActive = pathname === href;
    return `transition-colors duration-500 ${
      isActive ? 'text-white/90' : 'text-white/90 hover:text-white/90'
    }`;
  };

  const mobileItemStyles = 'block px-3 py-2';

  const NavLink = ({ item, isMobile = false }: any) => {
    if (item.isButton) {
      return (
        <button
          onClick={() => {
            item.onClick();
            isMobile && setIsOpen(false);
          }}
          className={`${getLinkStyles('')} ${isMobile ? `${mobileItemStyles} w-full text-left` : ''}`}
        >
          {item.label}
        </button>
      );
    }

    return (
      <Link
        href={item.href}
        onClick={() => isMobile && setIsOpen(false)}
        className={` ${getLinkStyles(item.href)} ${item.isSpecial ? 'mainButton px-6 py-2' : ''} ${isMobile ? mobileItemStyles : ''} `}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <nav className='fixed left-0 top-0 z-50 w-full bg-white/0 px-16 py-2.5 font-inter font-medium shadow-md backdrop-blur-md transition-all duration-500'>
      <div className='mx-auto'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='flex items-center'>
            <img
              src='/images/fubuu-icon.svg'
              alt='fubuu Logo'
              className='h-8 w-auto'
            />
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden items-center space-x-6 rounded-full bg-white/15 px-4 py-2 md:flex'>
            {!isLoaded || loading ? (
              <NavSkeleton />
            ) : (
              navItems.map((item) => <NavLink key={item.label} item={item} />)
            )}
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='text-gray-700 transition-colors duration-500 focus:outline-none'
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out md:hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className='space-y-1 px-2 pb-3 pt-2'>
          {(!isLoaded || loading) ? (
              <div className="py-2">
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200 mb-2"></div>
                <div className="h-6 w-20 animate-pulse rounded bg-gray-200"></div>
              </div>
            ) : (
              navItems.map((item) => (
                <NavLink key={item.label} item={item} isMobile={true} />
              ))
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
