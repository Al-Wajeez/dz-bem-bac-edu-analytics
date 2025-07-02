import React from 'react';
import { Bar } from 'react-chartjs-2';
import { X } from 'lucide-react';

interface DetailedGradeDistribution {
  subject: string;
  range0To8: { count: number; percentage: number };
  range9To9: { count: number; percentage: number };
  range10To11: { count: number; percentage: number };
  range12To13: { count: number; percentage: number };
  range14To15: { count: number; percentage: number };
  range16To17: { count: number; percentage: number };
  range18To20: { count: number; percentage: number };
}

interface DetailedGradeDistributionChartProps {
  data: DetailedGradeDistribution[];
  title: string;
  isDarkMode: boolean;
  onClose: () => void;
}

const DetailedGradeDistributionChart: React.FC<DetailedGradeDistributionChartProps> = ({
  data,
  title,
  isDarkMode,
  onClose
}) => {
  const chartData = {
    labels: data.map(item => item.subject),
    datasets: [
      {
        label: '0-8',
        data: data.map(item => item.range0To8.percentage),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: '9',
        data: data.map(item => item.range9To9.percentage),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: '10-11',
        data: data.map(item => item.range10To11.percentage),
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: '12-13',
        data: data.map(item => item.range12To13.percentage),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: '14-15',
        data: data.map(item => item.range14To15.percentage),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
      {
        label: '16-17',
        data: data.map(item => item.range16To17.percentage),
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
      {
        label: '18-20',
        data: data.map(item => item.range18To20.percentage),
        backgroundColor: 'rgba(199, 199, 199, 0.5)',
        borderColor: 'rgba(199, 199, 199, 1)',
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

export default DetailedGradeDistributionChart; 