
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const itchingAreas = [
  "Cabeza", "Cara", "Cuello", "Brazos", "Manos", 
  "Pecho", "Espalda", "Abdomen", "Piernas", "Pies"
];

interface QuestionnaireData {
  id: string;
  date: string;
  itchLevel: number;
  selectedAreas: string[];
  imageCount: number;
  userId: string;
}

const QuestionnaireForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [itchLevel, setItchLevel] = useState(0);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false);

  // Check if user has already submitted today when component mounts
  useEffect(() => {
    if (user) {
      const storedQuestionnaires = localStorage.getItem('vitalytics-questionnaires');
      const questionnaires: QuestionnaireData[] = storedQuestionnaires 
        ? JSON.parse(storedQuestionnaires) 
        : [];

      const today = new Date().setHours(0, 0, 0, 0);
      const submitted = questionnaires.some(q => {
        const submissionDate = new Date(q.date).setHours(0, 0, 0, 0);
        return q.userId === user.uid && submissionDate === today;
      });

      setHasSubmittedToday(submitted);
    }
  }, [user]);

  const handleAreaToggle = (area: string) => {
    setSelectedAreas(
      selectedAreas.includes(area) 
        ? selectedAreas.filter(a => a !== area)
        : [...selectedAreas, area]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      
      // Limit to 3 images
      if (images.length + fileArray.length > 3) {
        toast({
          title: "Máximo 3 imágenes",
          description: "Por favor, selecciona un máximo de 3 imágenes.",
          variant: "destructive",
        });
        return;
      }
      
      setImages([...images, ...fileArray]);
      
      // Create preview URLs
      const newPreviews = fileArray.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    // Release the object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);
    
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error al enviar",
        description: "Debes iniciar sesión para enviar el cuestionario.",
        variant: "destructive",
      });
      return;
    }

    // Get existing questionnaires from localStorage
    const storedQuestionnaires = localStorage.getItem('vitalytics-questionnaires');
    const questionnaires: QuestionnaireData[] = storedQuestionnaires 
      ? JSON.parse(storedQuestionnaires) 
      : [];

    // Check if user has already submitted a questionnaire today
    const today = new Date().setHours(0, 0, 0, 0);
    const hasSubmittedToday = questionnaires.some(q => {
      const submissionDate = new Date(q.date).setHours(0, 0, 0, 0);
      return q.userId === user.uid && submissionDate === today;
    });

    if (hasSubmittedToday) {
      toast({
        title: "Límite diario alcanzado",
        description: "Solo puedes enviar un cuestionario por día. Por favor, vuelve mañana.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new questionnaire data
    const newQuestionnaire: QuestionnaireData = {
      id: `q-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      itchLevel,
      selectedAreas,
      imageCount: images.length,
      userId: user.uid,
    };
    
    // Add new questionnaire and save to localStorage
    questionnaires.push(newQuestionnaire);
    localStorage.setItem('vitalytics-questionnaires', JSON.stringify(questionnaires));
    
    toast({
      title: "Cuestionario enviado",
      description: "Gracias por completar el cuestionario. Un profesional revisará tu información.",
    });
    
    // Reset form
    setItchLevel(0);
    setSelectedAreas([]);
    setImages([]);
    setPreviews([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto glass-card p-6 rounded-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {hasSubmittedToday && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              Ya has enviado un cuestionario hoy. Por favor, vuelve mañana para enviar otro.
            </p>
          </div>
        )}
        {/* Itching Level Question */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">¿Qué nivel de picor sientes?</h3>
          <div className="space-y-6">
            <Slider 
              value={[itchLevel]} 
              onValueChange={([value]) => setItchLevel(value)} 
              max={10} 
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Leve (1)</span>
              <span>Moderado (5)</span>
              <span>Intenso (10)</span>
            </div>
            <div className="text-center font-medium text-softGreen-700">
              {itchLevel === 0 ? "Sin picor" : `Nivel ${itchLevel}/10`}
            </div>
          </div>
        </div>

        {/* Itching Areas Question */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">¿Qué zonas te pican?</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {itchingAreas.map((area) => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox 
                  id={`area-${area}`} 
                  checked={selectedAreas.includes(area)}
                  onCheckedChange={() => handleAreaToggle(area)}
                  className="border-softGreen-400 data-[state=checked]:bg-softGreen-500 data-[state=checked]:border-softGreen-500"
                />
                <Label 
                  htmlFor={`area-${area}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {area}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Adjunta fotos de las zonas afectadas (opcional)</h3>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative">
                  <img 
                    src={preview} 
                    alt={`Imagen ${index + 1}`} 
                    className="h-24 w-24 object-cover rounded-lg border border-softGreen-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              {previews.length < 3 && (
                <label className={cn(
                  "h-24 w-24 flex flex-col items-center justify-center rounded-lg",
                  "border-2 border-dashed border-softGreen-300 bg-softGreen-50",
                  "cursor-pointer hover:bg-softGreen-100 transition-colors"
                )}>
                  <Paperclip className="h-6 w-6 text-softGreen-500 mb-1" />
                  <span className="text-xs text-softGreen-700">Añadir foto</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">Puedes subir hasta 3 imágenes. Formatos: JPG, PNG</p>
          </div>
        </div>

          <Button 
            type="submit" 
            className={cn(
              "w-full bg-gradient-to-r text-white py-6 shadow-lg transition-all duration-200 hover:shadow-xl",
              hasSubmittedToday
                ? "from-gray-400 to-gray-500 cursor-not-allowed"
                : "from-softGreen-500 to-softGreen-600 hover:from-softGreen-600 hover:to-softGreen-700 shadow-softGreen-500/25 hover:shadow-softGreen-500/30"
            )}
            disabled={hasSubmittedToday}
          >
            <Send className="h-5 w-5 mr-2" />
            {hasSubmittedToday ? "Ya enviado hoy" : "Enviar cuestionario"}
          </Button>
      </form>
    </motion.div>
  );
};

export default QuestionnaireForm;
