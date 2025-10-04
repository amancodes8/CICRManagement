/**
 * Sidebar Component
 * 
 * Main navigation sidebar with responsive design.
 * Includes navigation links, user profile, and logout functionality.
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  Zap,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { UserAvatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { ROUTES, USER_ROLES } from '../../lib/types';

/**
 * Navigation links configuration
 */
const navigationLinks = [
  {
    name: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    name: 'Projects',
    href: ROUTES.PROJECTS,
    icon: FolderKanban,
  },
  {
    name: 'Meetings',
    href: ROUTES.MEETINGS,
    icon: Calendar,
  },
  {
    name: 'Profile',
    href: ROUTES.PROFILE,
    icon: User,
  },
];

/**
 * Sidebar component
 */
export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAdmin = user?.role === USER_ROLES.ADMIN;

  // Add admin link if user is admin
  const links = isAdmin
    ? [
        ...navigationLinks,
        {
          name: 'Admin',
          href: ROUTES.ADMIN,
          icon: Shield,
        },
      ]
    : navigationLinks;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-background border shadow-sm"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isMobileOpen || window.innerWidth >= 1024 ? 0 : -280 }}
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 bg-card border-r transition-transform duration-300',
          'lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="flex h-16 items-center border-b px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">CICR Connect</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent transition-colors">
              <UserAvatar src={user?.avatar} name={user?.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-2 justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main content spacer for desktop */}
      <div className="hidden lg:block w-64 shrink-0" />
    </>
  );
}