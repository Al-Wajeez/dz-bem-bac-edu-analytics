import React from 'react';
import { Bar } from 'react-chartjs-2';
import { X } from 'lucide-react';

type RemarkType = 'success' | 'warning' | 'danger' | 'info' | 'secondary';

interface GradeDistribution {
  subject: string;
  above10: { count: number; percentage: number };
  between8And10: { count: number; percentage: number };
  below8: { count: number; percentage: number };
  remark: string;
  remarkType: RemarkType;
}

const GradeDistributionChart: React.FC<{distribution: GradeDistribution[];title: string;isDarkMode: boolean;onClose: () => void;}> = ({ distribution, title, isDarkMode, onClose }) => {
    const colors = distribution.map(
      (_, index) => `hsl(${(index * 360) / distribution.length}, 70%, 50%)`
    );
  
    const chartData = {
      labels: distribution.map(item => item.subject),
      datasets: [
        {
          label: 'أكبر أو يساوي 10',
          data: distribution.map(item => item.above10.count),
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('70%', '50%')),
          borderWidth: 1,
        },
        {
          label: 'من 8 إلى 9.99',
          data: distribution.map(item => item.between8And10.count),
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('70%', '50%')),
          borderWidth: 1,
        },
        {
          label: 'أقل من 8',
          data: distribution.map(item => item.below8.count),
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

export default GradeDistributionChart;