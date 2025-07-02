import React from 'react';
import { Bar } from 'react-chartjs-2';
import { X } from 'lucide-react';

interface StatisticalCount {
  count: number;
  percentage: number;
  total: number;
}

interface GenderStatisticalCount {
  male: StatisticalCount;
  female: StatisticalCount;
}

interface RepeatStatisticalCount {
  repeat: StatisticalCount;
  nonRepeat: StatisticalCount;
}

interface StatisticalCountData {
  [key: string]: StatisticalCount;
}

const StatisticalCountChart: React.FC<{data: StatisticalCountData | GenderStatisticalCount | RepeatStatisticalCount; title: string; isDarkMode: boolean; onClose: () => void;}> = ({ data, title, isDarkMode, onClose }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'النسبة المئوية',
        data: Object.values(data).map(item => item.percentage),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
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

export default StatisticalCountChart;