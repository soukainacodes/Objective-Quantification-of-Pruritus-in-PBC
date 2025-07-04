
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { CheckCircle, Award, BarChart, Calendar, Clock, Info, ChevronRight, Activity, Heart, Thermometer, Zap, Pill, FileText } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the interfaces for our data types
interface QuestionnaireData {
  id: string;
  date: string;
  itchLevel: number;
  selectedAreas: string[];
  imageCount: number;
  userId: string;
}

interface PatientData {
  id: string;
  date: string;
  userId: string;
  behavioralData: {
    itchDuration: string;
    scratchSpeed: number;
    itchIntensity: number;
    itchFrequency: number;
    skinToNailVibrations: string;
  };
  sleepData: {
    posturalChanges: number;
    interruptions: number;
    qualityScore: number;
  };
  physiologicalData: {
    heartRate: number;
    heartRateVariability: number;
    skinConductance: number;
    skinTemperature: number;
  };
  clinicalData: {
    skinDiseaseHistory: string[];
    previousTreatments: string[];
    currentMedication: string[];
    treatmentResponse: string;
  };
}

// Mock patient data
const mockPatientData: PatientData[] = [
  {
    id: "pd-1",
    date: "15 de mayo, 2023",
    userId: "user-1",
    behavioralData: {
      itchDuration: "4 horas diarias",
      scratchSpeed: 85,
      itchIntensity: 7,
      itchFrequency: 12,
      skinToNailVibrations: "Moderadas",
    },
    sleepData: {
      posturalChanges: 28,
      interruptions: 6,
      qualityScore: 65,
    },
    physiologicalData: {
      heartRate: 76,
      heartRateVariability: 42,
      skinConductance: 8.3,
      skinTemperature: 36.7,
    },
    clinicalData: {
      skinDiseaseHistory: ["Dermatitis atópica", "Eccema"],
      previousTreatments: ["Corticosteroides tópicos", "Antihistamínicos"],
      currentMedication: ["Cetirizina 10mg", "Loratadina 10mg"],
      treatmentResponse: "Respuesta parcial a antihistamínicos, mejor control nocturno",
    },
  },
  {
    id: "pd-2",
    date: "10 de mayo, 2023",
    userId: "user-1",
    behavioralData: {
      itchDuration: "5 horas diarias",
      scratchSpeed: 92,
      itchIntensity: 8,
      itchFrequency: 15,
      skinToNailVibrations: "Altas",
    },
    sleepData: {
      posturalChanges: 32,
      interruptions: 8,
      qualityScore: 55,
    },
    physiologicalData: {
      heartRate: 82,
      heartRateVariability: 38,
      skinConductance: 9.1,
      skinTemperature: 37.2,
    },
    clinicalData: {
      skinDiseaseHistory: ["Dermatitis atópica", "Eccema"],
      previousTreatments: ["Corticosteroides tópicos", "Antihistamínicos"],
      currentMedication: ["Cetirizina 10mg"],
      treatmentResponse: "Respuesta limitada a tratamientos actuales",
    },
  },
  {
    id: "pd-3",
    date: "1 de mayo, 2023",
    userId: "user-1",
    behavioralData: {
      itchDuration: "3 horas diarias",
      scratchSpeed: 76,
      itchIntensity: 6,
      itchFrequency: 10,
      skinToNailVibrations: "Bajas",
    },
    sleepData: {
      posturalChanges: 25,
      interruptions: 4,
      qualityScore: 72,
    },
    physiologicalData: {
      heartRate: 74,
      heartRateVariability: 45,
      skinConductance: 7.8,
      skinTemperature: 36.5,
    },
    clinicalData: {
      skinDiseaseHistory: ["Dermatitis atópica", "Eccema"],
      previousTreatments: ["Corticosteroides tópicos", "Antihistamínicos"],
      currentMedication: ["Cetirizina 10mg", "Loratadina 10mg", "Crema hidratante"],
      treatmentResponse: "Mejoría con la combinación de tratamientos",
    },
  },
];

const Resultados = () => {
  const { user } = useAuth();
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  
  // Redirect if not a patient
  if (!user || user.role !== 'patient') {
    return <Navigate to="/" />;
  }
  
  // Get questionnaires from localStorage
  const storedQuestionnaires = localStorage.getItem('vitalytics-questionnaires');
  const allQuestionnaires: QuestionnaireData[] = storedQuestionnaires 
    ? JSON.parse(storedQuestionnaires) 
    : [];
  
  // Filter questionnaires for the current user
  const userQuestionnaires = allQuestionnaires.filter(q => q.userId === user.uid);
  
  // Get patient data (in a real app, this would come from an API)
  const userPatientData = mockPatientData.filter(data => data.userId === user.uid);
  
  // Find the selected result
  const selectedResult = userPatientData.find(r => r.id === selectedResultId);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
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

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
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
            Análisis de Resultados
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Mis Resultados</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Revisa los datos capturados sobre tu condición y el historial de cuestionarios completados.
          </p>
        </motion.section>

        {/* Summary Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="glass-card rounded-xl p-5 flex items-center"
            variants={itemVariants}
          >
            <div className="h-12 w-12 rounded-full bg-softGreen-100 flex items-center justify-center text-softGreen-700 mr-4">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cuestionarios Completados</p>
              <p className="text-2xl font-bold">{userQuestionnaires.length}</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-card rounded-xl p-5 flex items-center"
            variants={itemVariants}
          >
            <div className="h-12 w-12 rounded-full bg-softGreen-100 flex items-center justify-center text-softGreen-700 mr-4">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Nivel de Picor Promedio</p>
              <p className="text-2xl font-bold">
                {userQuestionnaires.length > 0 
                  ? Math.round(userQuestionnaires.reduce((acc, q) => acc + q.itchLevel, 0) / userQuestionnaires.length) 
                  : "N/A"}
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-card rounded-xl p-5 flex items-center"
            variants={itemVariants}
          >
            <div className="h-12 w-12 rounded-full bg-softGreen-100 flex items-center justify-center text-softGreen-700 mr-4">
              <BarChart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Mediciones Registradas</p>
              <p className="text-2xl font-bold">{userPatientData.length}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Patient Data and Questionnaires */}
        <div>
          <Tabs defaultValue="patientData" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="patientData" className="text-sm">Datos Clínicos</TabsTrigger>
              <TabsTrigger value="questionnaires" className="text-sm">Cuestionarios</TabsTrigger>
            </TabsList>
            
            {/* Patient Data Tab */}
            <TabsContent value="patientData" className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Historial de Mediciones</h2>
              
              {selectedResult ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Datos del {selectedResult.date}</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedResultId(null)}
                    >
                      Volver al listado
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Behavioral Data */}
                    <div className="glass-card rounded-xl p-5 space-y-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Activity className="h-5 w-5 text-softGreen-700" />
                        <h4 className="font-medium">Datos de Comportamiento</h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Duración del picor</span>
                            <span className="font-medium">{selectedResult.behavioralData.itchDuration}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Velocidad del rascado</span>
                            <span className="font-medium">{selectedResult.behavioralData.scratchSpeed}%</span>
                          </div>
                          <Progress value={selectedResult.behavioralData.scratchSpeed} className="h-2 w-full bg-softGreen-100" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Intensidad del picor</span>
                            <span className="font-medium">{selectedResult.behavioralData.itchIntensity}/10</span>
                          </div>
                          <Progress value={selectedResult.behavioralData.itchIntensity * 10} className="h-2 w-full bg-softGreen-100" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Frecuencia del picor</span>
                            <span className="font-medium">{selectedResult.behavioralData.itchFrequency} veces/día</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Vibraciones piel-uñas</span>
                            <span className="font-medium">{selectedResult.behavioralData.skinToNailVibrations}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Sleep Data */}
                    <div className="glass-card rounded-xl p-5 space-y-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-5 w-5 text-softGreen-700" />
                        <h4 className="font-medium">Datos de Sueño</h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Cambios de postura</span>
                            <span className="font-medium">{selectedResult.sleepData.posturalChanges} veces</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Interrupciones</span>
                            <span className="font-medium">{selectedResult.sleepData.interruptions} veces</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Calidad del sueño</span>
                            <span className="font-medium">{selectedResult.sleepData.qualityScore}%</span>
                          </div>
                          <Progress value={selectedResult.sleepData.qualityScore} className="h-2 w-full bg-softGreen-100" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Physiological Data */}
                    <div className="glass-card rounded-xl p-5 space-y-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Heart className="h-5 w-5 text-softGreen-700" />
                        <h4 className="font-medium">Datos Fisiológicos</h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Frecuencia cardíaca</span>
                            <span className="font-medium">{selectedResult.physiologicalData.heartRate} bpm</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Variabilidad de la frecuencia cardíaca</span>
                            <span className="font-medium">{selectedResult.physiologicalData.heartRateVariability} ms</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Conductancia de la piel</span>
                            <span className="font-medium">{selectedResult.physiologicalData.skinConductance} μS</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Temperatura cutánea</span>
                            <span className="font-medium">{selectedResult.physiologicalData.skinTemperature}°C</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Clinical Data */}
                    <div className="glass-card rounded-xl p-5 space-y-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="h-5 w-5 text-softGreen-700" />
                        <h4 className="font-medium">Datos Clínicos</h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium mb-1">Historial de enfermedades cutáneas</div>
                          <div className="flex flex-wrap gap-1">
                            {selectedResult.clinicalData.skinDiseaseHistory.map((disease, idx) => (
                              <span key={idx} className="text-xs bg-softGreen-100 text-softGreen-700 px-2 py-1 rounded-full">
                                {disease}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-1">Tratamientos previos</div>
                          <div className="flex flex-wrap gap-1">
                            {selectedResult.clinicalData.previousTreatments.map((treatment, idx) => (
                              <span key={idx} className="text-xs bg-softGreen-100 text-softGreen-700 px-2 py-1 rounded-full">
                                {treatment}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-1">Medicación actual</div>
                          <div className="flex flex-wrap gap-1">
                            {selectedResult.clinicalData.currentMedication.map((med, idx) => (
                              <span key={idx} className="text-xs bg-softGreen-100 text-softGreen-700 px-2 py-1 rounded-full">
                                {med}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-1">Respuesta a tratamientos</div>
                          <p className="text-sm">{selectedResult.clinicalData.treatmentResponse}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div 
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {userPatientData.map((result) => (
                    <motion.div
                      key={result.id}
                      className="glass-card rounded-xl overflow-hidden hover-card"
                      variants={itemVariants}
                      onClick={() => setSelectedResultId(result.id)}
                    >
                      <div className="p-5">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="flex-1">
                            <h3 className="font-medium text-lg">Medición del {result.date}</h3>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Activity className="h-4 w-4 mr-1" />
                                <span>Intensidad: {result.behavioralData.itchIntensity}/10</span>
                              </div>
                              <div className="flex items-center">
                                <Heart className="h-4 w-4 mr-1" />
                                <span>FC: {result.physiologicalData.heartRate} bpm</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-softGreen-700 hover:text-softGreen-800 hover:bg-softGreen-100"
                            >
                              Ver Detalles
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {userPatientData.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No hay mediciones disponibles.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </TabsContent>
            
            {/* Questionnaires Tab */}
            <TabsContent value="questionnaires" className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Historial de Cuestionarios</h2>
              
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {userQuestionnaires.map((questionnaire) => (
                  <motion.div
                    key={questionnaire.id}
                    className="glass-card rounded-xl overflow-hidden"
                    variants={itemVariants}
                  >
                    <div className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">Cuestionario del {questionnaire.date}</h3>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{questionnaire.date}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <div className="text-2xl font-bold text-softGreen-700">
                            {questionnaire.itchLevel}/10
                          </div>
                          <div className="text-sm text-gray-500">
                            Nivel de picor
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Intensidad del picor</span>
                          <span className="font-medium">{questionnaire.itchLevel}/10</span>
                        </div>
                        <Progress value={questionnaire.itchLevel * 10} className="h-2 w-full bg-softGreen-100" />
                      </div>
                      
                      <div className="mt-4">
                        <div className="text-sm font-medium mb-2">Zonas afectadas:</div>
                        <div className="flex flex-wrap gap-1">
                          {questionnaire.selectedAreas.map((area, idx) => (
                            <span key={idx} className="text-xs bg-softGreen-100 text-softGreen-700 px-2 py-1 rounded-full">
                              {area}
                            </span>
                          ))}
                          {questionnaire.selectedAreas.length === 0 && (
                            <span className="text-xs text-gray-500">No se seleccionaron zonas</span>
                          )}
                        </div>
                      </div>
                      
                      {questionnaire.imageCount > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          {questionnaire.imageCount} {questionnaire.imageCount === 1 ? 'imagen adjunta' : 'imágenes adjuntas'}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {userQuestionnaires.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No has completado ningún cuestionario todavía.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => window.location.href = '/'}
                    >
                      Completar cuestionario
                    </Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Resultados;
