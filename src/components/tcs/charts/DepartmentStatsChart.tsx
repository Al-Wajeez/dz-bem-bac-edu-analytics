import React from 'react';
import { Bar } from 'react-chartjs-2';
import { X } from 'lucide-react';

interface DepartmentStats {
  subject: string;
  departments: { [key: string]: number };
  highestDepartment: string;
  lowestDepartment: string;
  highestMean: number;
  lowestMean: number;
}

const DepartmentStatsChart: React.FC<{ stats: DepartmentStats[]; title: string; isDarkMode: boolean; onClose: () => void;}> = ({ stats, title, isDarkMode, onClose }) => {

  const chartData = {
    labels: stats.map(item => item.subject),
    datasets: [
      {
        label: 'القسم المتفوق',
        data: stats.map(item => item.highestMean),
        backgroundColor: `hsl(143, 64%, 49%)`,
        borderColor: `hsl(143, 64%, 49%)`,
        borderWidth: 1,
      },
      {
        label: 'القسم الضعيف',
        data: stats.map(item => item.lowestMean),
        backgroundColor: `hsl(0, 64%, 49%)`,
        borderColor: `hsl(0, 64%, 49%)`,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
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

export default DepartmentStatsChart;