import React from 'react';
import { Bar } from 'react-chartjs-2';
import { X } from 'lucide-react';

interface GradeRange {
  count: number;
  percentage: number;
}

interface CategoryStats {
  subject: string;
  weakCategory: GradeRange;
  nearAverageCategory: GradeRange;
  averageCategory: GradeRange;
  goodCategory: GradeRange;
  excellentCategory: GradeRange;
}

interface CategoryStatsChartProps {
  data: CategoryStats[];
  title: string;
  isDarkMode: boolean;
  onClose: () => void;
}

const CategoryStatsChart: React.FC<CategoryStatsChartProps> = ({
  data,
  title,
  isDarkMode,
  onClose
}) => {
  const chartData = {
    labels: data.map(item => item.subject),
    datasets: [
      {
        label: 'الفئة الضعيفة',
        data: data.map(item => item.weakCategory.percentage),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'الفئة القريبة من المتوسط',
        data: data.map(item => item.nearAverageCategory.percentage),
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: 'الفئة المتوسطة',
        data: data.map(item => item.averageCategory.percentage),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'الفئة الحسنة',
        data: data.map(item => item.goodCategory.percentage),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'الفئة الجيدة',
        data: data.map(item => item.excellentCategory.percentage),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
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

export default CategoryStatsChart; 