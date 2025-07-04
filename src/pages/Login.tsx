import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // If already logged in, redirect to home
  if (!isLoading && user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.success && result.error) {
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: result.error
      });
      return;
    }
    
    // Redirect on successful login
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-softGreen-50 to-white px-4">
      <motion.div 
        className="w-full max-w-md glass-card p-8 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/59bd76d6-1b20-4a4b-9b5c-1ac5940e6f87.png" 
              alt="Vitalytics Logo" 
              className="h-12 w-12"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
          <p className="text-gray-600 mt-2">Accede a tu cuenta de Vitalytics</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                type="password"
                placeholder="******"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-softGreen-500 hover:bg-softGreen-600 text-white py-6"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Iniciar Sesión
          </Button>

          <Button
            onClick={() => navigate('/register')} // Add navigation to register page
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 mt-4"
          >
            Registrarse
          </Button>

          <div className="mt-4 text-center text-sm text-gray-500">
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
