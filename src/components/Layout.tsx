
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, BarChart, Menu, X, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const navItems = user?.role === 'doctor' ? [
    { path: "/resultados", label: "Resultados de Pacientes", icon: <BarChart className="h-5 w-5" /> },
  ] : [
    { path: "/", label: "Cuestionario", icon: <ClipboardList className="h-5 w-5" /> },
    { path: "/resultados", label: "Mis Resultados", icon: <BarChart className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-softGreen-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-softGreen-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/59bd76d6-1b20-4a4b-9b5c-1ac5940e6f87.png" 
              alt="Vitalytics Logo" 
              className="h-8 w-8"
            />
            <span className="font-medium text-foreground">Vitalytics</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex space-x-2 mr-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-softGreen-100 text-softGreen-700"
                      : "text-muted-foreground hover:bg-softGreen-50 hover:text-softGreen-600"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <User className="h-4 w-4 mr-2" />
                    <span className="truncate max-w-[100px]">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 pt-16 backdrop-blur-sm md:hidden">
          <motion.nav
            className="container mx-auto p-4 flex flex-col space-y-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-softGreen-100 text-softGreen-700"
                    : "text-muted-foreground hover:bg-softGreen-50 hover:text-softGreen-600"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            {user && (
              <div 
                className="mt-4 pt-4 border-t border-softGreen-100"
                onClick={logout}
              >
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Cerrar sesión</span>
                </Button>
              </div>
            )}
          </motion.nav>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-20">
        {mounted && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="h-full"
          >
            <motion.div variants={itemVariants}>
              {children}
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
