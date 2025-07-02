import React from 'react';
import { Bar } from 'react-chartjs-2';
import { X } from 'lucide-react';

type RemarkType = 'success' | 'warning' | 'danger' | 'info' | 'secondary';

interface DirectoratePerformanceStats {
  directorate: string;
  presentCount: number;
  mean: number;
  stdDev: number;
  remark: string;
  remarkType: RemarkType;
}

const DirectoratePerformanceStatsChart: React.FC<{stats: DirectoratePerformanceStats[];title: string;isDarkMode: boolean;onClose: () => void;}> = ({ stats, title, isDarkMode, onClose }) => {
  const colors = stats.map(
    (_, index) => `hsl(${(index * 360) / stats.length}, 70%, 50%)`
  );

  const chartData = {
    labels: stats.map(item => item.directorate),
    datasets: [
      {
        label: 'معدل القسم',
        data: stats.map(item => item.mean),
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('70%', '50%')),
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

export default DirectoratePerformanceStatsChart;