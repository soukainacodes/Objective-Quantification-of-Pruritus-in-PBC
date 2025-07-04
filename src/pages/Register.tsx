import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, UserCircle, Stethoscope } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'doctor' | 'patient'>('patient');
  const { user, register, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // If already logged in, redirect to home
  if (!isLoading && user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Las contraseñas no coinciden",
      });
      return;
    }

    const result = await register(name, surname, email, password, role);
    if (!result.success && result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Registrarse</h1>
          <p className="text-gray-600 mt-2">Crea tu cuenta de Vitalytics</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre"
              className="pl-10"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="surname">Apellido</Label>
            <Input
              id="surname"
              type="text"
              placeholder="Tu apellido"
              className="pl-10"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </div>
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type="password"
                placeholder="******"
                className="pl-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Usuario</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                className={`flex items-center justify-center space-x-2 ${role === 'patient' ? 'bg-softGreen-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setRole('patient')}
              >
                <UserCircle className="h-5 w-5" />
                <span>Paciente</span>
              </Button>
              <Button
                type="button"
                className={`flex items-center justify-center space-x-2 ${role === 'doctor' ? 'bg-softGreen-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setRole('doctor')}
              >
                <Stethoscope className="h-5 w-5" />
                <span>Médico</span>
              </Button>
            </div>
          </div>
          <Button
            type="submit" 
            className="w-full bg-softGreen-500 hover:bg-softGreen-600 text-white py-6"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Registrarse
          </Button>

          <div className="mt-4 text-center text-sm text-gray-500">
            <button 
              onClick={() => navigate('/login')} 
              className="text-blue-500 hover:underline"
            >
              Ya tengo una cuenta. Iniciar sesión
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
