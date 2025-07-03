import React from 'react';
import { Bar } from 'react-chartjs-2';
import { X } from 'lucide-react';

interface CategoryStatsItem {
  subject: string;
  termAPercentage: string;
  termBPercentage: string;
}

interface CategoryStatsChartProps {
  data: CategoryStatsItem[];
  termA: string;
  termB: string;
  title: string;
  isDarkMode: boolean;
  onClose: () => void;
}

const CategoryStatsChart: React.FC<CategoryStatsChartProps> = ({ data, termA, termB, title, isDarkMode, onClose }) => {
    const colors = data.map(
      (_, index) => `hsl(${(index * 360) / data.length}, 70%, 50%)`
    );
  
    const chartData = {
    labels: data.map(item => item.subject),
      datasets: [
        {
          label: `النسبة - ${termA}`,
          data: data.map(item => parseFloat(item.termAPercentage)),
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('70%', '50%')),
          borderWidth: 1,
        },
        {
          label: `النسبة - ${termB}`,
          data: data.map(item => parseFloat(item.termBPercentage)),
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
          display: false
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 16
          }
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

export default CategoryStatsChart;