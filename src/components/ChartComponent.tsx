import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement
} from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  dates: string[];
  itchLevels: number[];
  selectedAreas: { [key: string]: number };
  physiologicalData: {
    heartRate: number[];
    skinTemperature: number[];
  };
}

interface ChartComponentProps {
  data: ChartData;
  type: 'itch-timeline' | 'areas-distribution' | 'physiological-data';
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data, type }) => {
  const getChartTitle = (type: string) => {
    switch (type) {
      case 'itch-timeline':
        return 'Evolución del Nivel de Picor';
      case 'areas-distribution':
        return 'Distribución de Áreas Afectadas';
      case 'physiological-data':
        return 'Datos Fisiológicos';
      default:
        return '';
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: getChartTitle(type),
      },
    },
  };

  const renderChart = () => {
    switch (type) {
      case 'itch-timeline':
        return (
          <Line
            options={chartOptions}
            data={{
              labels: data.dates,
              datasets: [
                {
                  label: 'Nivel de Picor',
                  data: data.itchLevels,
                  borderColor: 'rgb(75, 192, 192)',
                  backgroundColor: 'rgba(75, 192, 192, 0.5)',
                  tension: 0.3,
                },
              ],
            }}
          />
        );

      case 'areas-distribution':
        return (
          <Bar
            options={chartOptions}
            data={{
              labels: Object.keys(data.selectedAreas),
              datasets: [
                {
                  label: 'Frecuencia de Áreas Afectadas',
                  data: Object.values(data.selectedAreas),
                  backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
              ],
            }}
          />
        );

      case 'physiological-data':
        return (
          <Line
            options={{
              ...chartOptions,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
            data={{
              labels: data.dates,
              datasets: [
                {
                  label: 'Ritmo Cardíaco',
                  data: data.physiologicalData.heartRate,
                  borderColor: 'rgb(255, 99, 132)',
                  backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  yAxisID: 'y',
                },
                {
                  label: 'Temperatura de la Piel',
                  data: data.physiologicalData.skinTemperature,
                  borderColor: 'rgb(53, 162, 235)',
                  backgroundColor: 'rgba(53, 162, 235, 0.5)',
                  yAxisID: 'y',
                },
              ],
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full min-h-[300px] p-4">
      {renderChart()}
    </div>
  );
};

export default ChartComponent;
