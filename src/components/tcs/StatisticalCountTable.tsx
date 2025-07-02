import React, { useState } from 'react';
import { X, BarChart, FileSpreadsheet, FileText } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import * as XLSX from 'xlsx';

interface StatisticalCount {
  count: number;
  percentage: number;
  total: number;
}

interface StatisticalCountData {
  [key: string]: StatisticalCount;
}

interface GenderStatisticalCount {
  male: StatisticalCount;
  female: StatisticalCount;
}

interface RepeatStatisticalCount {
  repeat: StatisticalCount;
  nonRepeat: StatisticalCount;
}

const exportToExcel = (tableId: string) => {
  const table = document.getElementById(tableId);
  if (!table) return;

  const wb = XLSX.utils.table_to_book(table);
  XLSX.writeFile(wb, `${tableId}.xlsx`);
};

const StatisticalCountTable: React.FC<{title: string; data: StatisticalCountData | GenderStatisticalCount | RepeatStatisticalCount; isDarkMode: boolean; tableId: string;}> = ({ title, data, isDarkMode, tableId }) => {
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  return (
    <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAnalysis(true)}
            className="p-2 text-purple-600 hover:text-purple-800"
            title="عرض التحليل النوعي"
          >
            <FileText className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowChart(true)}
            className="p-2 text-blue-600 hover:text-blue-800"
            title="عرض الرسم البياني"
          >
            <BarChart className="w-5 h-5" />
          </button>
          <button
            onClick={() => exportToExcel(tableId)}
            className="p-2 text-green-600 hover:text-green-800"
            title="تصدير إلى ملف إكسل"
          >
            <FileSpreadsheet className="w-5 h-5" />
          </button>
        </div>
      </div>
      <table id={tableId} className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
          <tr>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>الفئة</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>العدد</th>
            <th className={`px-6 py-6 text-center text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>النسبة المئوية</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{key}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{value.count}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{value.percentage.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} sticky bottom-0 font-bold`}>
            <td className="px-6 py-4 text-center">المجموع</td>
            <td className="px-6 py-4 text-center">
              {Object.values(data).reduce((sum, v) => sum + v.count, 0)}
            </td>
            <td className="px-6 py-4 text-center">100%</td>
          </tr>
        </tfoot>
      </table>
      {showAnalysis && (
        <StatisticalCountQualitativeAnalysis
          title={title}
          data={data}
          onClose={() => setShowAnalysis(false)}
        />
      )}
      {showChart && (
        <StatisticalCountChart
          data={data}
          title={title}
          isDarkMode={isDarkMode}
          onClose={() => setShowChart(false)}
        />
      )}
    </div>
  );
};

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
      <div className={`bg-white rounded-lg p-6 max-w-4xl w-full ${isDarkMode ? 'nav-dark' : ''}`}>
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

const StatisticalCountQualitativeAnalysis: React.FC<{title: string; data: StatisticalCountData | GenderStatisticalCount | RepeatStatisticalCount; onClose: () => void;}> = ({ title, data, onClose }) => {
  const getStatisticalAnalysis = (data: StatisticalCountData | GenderStatisticalCount | RepeatStatisticalCount): string => {
    let analysis = `تحليل ${title}:\n\n`;
    
    const total = Object.values(data).reduce((sum, stat) => sum + stat.count, 0);
    const entries = Object.entries(data);

    analysis += `1. التوزيع العام:\n`;
    entries.forEach(([key, stat]) => {
      const percentage = (stat.count / total) * 100;
      analysis += `   - ${key}: ${stat.count} (${percentage.toFixed(1)}%)\n`;
    });

    analysis += `\n2. تحليل التوزيع:\n`;
    const maxEntry = entries.reduce((max, [key, stat]) => 
      stat.count > max.count ? { key, ...stat } : max, 
      { key: '', count: 0, percentage: 0, total: 0 }
    );
    const minEntry = entries.reduce((min, [key, stat]) => 
      stat.count < min.count ? { key, ...stat } : min, 
      { key: '', count: total, percentage: 100, total: 0 }
    );

    analysis += `   - الفئة الأكثر تمثيلاً: ${maxEntry.key} (${maxEntry.percentage.toFixed(1)}%)\n`;
    analysis += `   - الفئة الأقل تمثيلاً: ${minEntry.key} (${minEntry.percentage.toFixed(1)}%)\n`;

    const variance = entries.reduce((sum, [_, stat]) => {
      const diff = stat.percentage - (100 / entries.length);
      return sum + (diff * diff);
    }, 0) / entries.length;

    analysis += `\n3. تحليل التباين:\n`;
    if (variance < 100) {
      analysis += `   - توزيع متوازن نسبياً (تباين منخفض)\n`;
    } else if (variance < 400) {
      analysis += `   - توزيع متوسط التباين\n`;
    } else {
      analysis += `   - توزيع غير متوازن (تباين مرتفع)\n`;
    }

    return analysis;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">تحليل نوعي للتوزيع</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 border rounded-lg">
          <pre className="whitespace-pre-wrap font-sans text-sm">
            {getStatisticalAnalysis(data)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default StatisticalCountTable; 