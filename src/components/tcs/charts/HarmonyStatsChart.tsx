import React from 'react';
import { Bar } from 'react-chartjs-2';
import { X } from 'lucide-react';

interface HarmonyStats {
  subject: string;
  harmonyRatio: number;
  remark: string;
  remarkType: 'success' | 'warning' | 'danger' | 'info' | 'secondary';
}

interface HarmonyStatsChartProps {
  data: HarmonyStats[];
  title: string;
  isDarkMode: boolean;
  onClose: () => void;
}

const HarmonyStatsChart: React.FC<HarmonyStatsChartProps> = ({
  data,
  title,
  isDarkMode,
  onClose
}) => {
  const chartData = {
    labels: data.map(item => item.subject),
    datasets: [
      {
        label: 'نسبة الإنسجام',
        data: data.map(item => item.harmonyRatio),
        backgroundColor: data.map(item => {
          switch (item.remarkType) {
            case 'success':
              return 'rgba(75, 192, 192, 0.5)';
            case 'warning':
              return 'rgba(255, 206, 86, 0.5)';
            case 'danger':
              return 'rgba(255, 99, 132, 0.5)';
            case 'info':
              return 'rgba(54, 162, 235, 0.5)';
            default:
              return 'rgba(199, 199, 199, 0.5)';
          }
        }),
        borderColor: data.map(item => {
          switch (item.remarkType) {
            case 'success':
              return 'rgba(75, 192, 192, 1)';
            case 'warning':
              return 'rgba(255, 206, 86, 1)';
            case 'danger':
              return 'rgba(255, 99, 132, 1)';
            case 'info':
              return 'rgba(54, 162, 235, 1)';
            default:
              return 'rgba(199, 199, 199, 1)';
          }
        }),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'النسبة المئوية',
        },
      },
      x: {
        title: {
          display: true,
          text: 'المادة',
        },
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg p-6 max-w-6xl w-full ${isDarkMode ? 'nav-dark' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="w-full h-[400px]">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default HarmonyStatsChart; 