import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Activity, Clock, Heart, Thermometer, FileText } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

interface PatientSummary {
  id: string;
  name: string;
  lastUpdate: string;
  condition: string;
  severity: number;
}

const mockPatients: PatientSummary[] = [
  {
    id: "PAT-001",
    name: "Juan Pérez",
    lastUpdate: "2023-05-15",
    condition: "Dermatitis atópica",
    severity: 75
  },
  {
    id: "PAT-002",
    name: "María García",
    lastUpdate: "2023-05-14",
    condition: "Eccema",
    severity: 45
  },
  {
    id: "PAT-003",
    name: "Carlos López",
    lastUpdate: "2023-05-13",
    condition: "Psoriasis",
    severity: 60
  }
];

const DoctorResults = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);

  // Redirect if not a doctor
  if (!user || user.role !== 'doctor') {
    return <Navigate to="/" />;
  }

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8">
        <motion.section 
          className="text-center space-y-4 mb-12"
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
            Panel Médico
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Resultados de Pacientes</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Visualice y analice los resultados de sus pacientes para un mejor seguimiento de su condición.
          </p>
        </motion.section>

        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-6 rounded-xl mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Buscar Pacientes</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre, ID o condición..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {filteredPatients.map((patient) => (
              <motion.div
                key={patient.id}
                className="glass-card p-6 rounded-xl hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{patient.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>ID: {patient.id}</span>
                      <span>•</span>
                      <span>Última actualización: {patient.lastUpdate}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => setSelectedPatient(patient)}
                    className="bg-softGreen-500 hover:bg-softGreen-600"
                  >
                    Ver Detalles
                  </Button>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{patient.condition}</span>
                    <span className="text-sm text-gray-600">
                      Severidad: {patient.severity}%
                    </span>
                  </div>
                  <Progress value={patient.severity} className="h-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorResults;