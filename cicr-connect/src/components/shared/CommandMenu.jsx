/**
 * Command Menu Component
 * 
 * Quick navigation command palette (Cmd/Ctrl + K).
 * Provides keyboard-driven navigation throughout the app.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  User,
  Shield,
  Search,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ROUTES, USER_ROLES } from '../../lib/types';
import { useAuth } from '../../hooks/useAuth';

/**
 * Command items configuration
 */
const getCommandItems = (isAdmin) => {
  const items = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      route: ROUTES.DASHBOARD,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderKanban,
      route: ROUTES.PROJECTS,
    },
    {
      id: 'meetings',
      label: 'Meetings',
      icon: Calendar,
      route: ROUTES.MEETINGS,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      route: ROUTES.PROFILE,
    },
  ];

  if (isAdmin) {
    items.push({
      id: 'admin',
      label: 'Admin Panel',
      icon: Shield,
      route: ROUTES.ADMIN,
    });
  }

  return items;
};

/**
 * Command Menu component
 */
export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const items = getCommandItems(isAdmin);

  // Filter items based on search
  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Open command menu with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        return;
      }

      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearch('');
        setSelectedIndex(0);
        return;
      }

      if (!isOpen) return;

      // Navigate with arrow keys
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
      }

      // Select with Enter
      if (e.key === 'Enter' && filteredItems.length > 0) {
        e.preventDefault();
        handleSelect(filteredItems[selectedIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleSelect = (item) => {
    navigate(item.route);
    setIsOpen(false);
    setSearch('');
    setSelectedIndex(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Command Dialog */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg rounded-lg border bg-background shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="flex items-center border-b px-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search commands..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex h-12 w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
                  autoFocus
                />
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">ESC</span>
                </kbd>
              </div>

              {/* Command List */}
              <div className="max-h-[300px] overflow-y-auto p-2">
                {filteredItems.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No results found.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                            selectedIndex === index
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-accent/50'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t px-4 py-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Navigate with arrows</span>
                  <div className="flex items-center gap-2">
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                      ⌘K
                    </kbd>
                    <span>to open</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}