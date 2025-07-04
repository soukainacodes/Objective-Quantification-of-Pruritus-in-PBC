
import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import QuestionnaireForm from '@/components/QuestionnaireForm';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect doctors to their dedicated results page
  if (user?.role === 'doctor') {
    return <Navigate to="/doctor-results" />;
  }

  const handleSearch = (searchTerm: string) => {
    navigate(`/resultados?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <motion.section 
          className="text-center space-y-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="inline-block px-3 py-1 rounded-full bg-softGreen-100 text-softGreen-700 text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Cuestionario Médico
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Cuestionario de Evaluación de Picor</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Por favor complete el siguiente cuestionario para ayudarnos a evaluar su condición.
            Sus respuestas serán revisadas por un profesional médico.
          </p>
        </motion.section>

        <QuestionnaireForm />
      </div>
    </Layout>
  );
};

export default Index;
