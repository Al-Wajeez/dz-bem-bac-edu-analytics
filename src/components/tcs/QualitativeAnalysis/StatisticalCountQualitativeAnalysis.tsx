import { NotebookPen, X } from 'lucide-react';
import React from 'react';

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

const genderMap: Record<string, string> = {
  male: 'ذكر',
  female: 'أنثى',
  repeat: 'المعيدين',
  nonRepeat: 'غير المعيدين',
};

const StatisticalCountQualitativeAnalysis: React.FC<{title: string; data: StatisticalCountData | GenderStatisticalCount | RepeatStatisticalCount; onClose: () => void;}> = ({ title, data, onClose }) => {
  const getStatisticalAnalysis = (data: StatisticalCountData | GenderStatisticalCount | RepeatStatisticalCount): string => {
    let analysis = `تحليل ${title}:\n\n`;
    
    const total = Object.values(data).reduce((sum, stat) => sum + stat.count, 0);
    const entries = Object.entries(data);

    analysis += `1. التوزيع العام:\n`;
    entries.forEach(([key, stat]) => {
      const percentage = (stat.count / total) * 100;
      analysis += `   - ${genderMap[key] || key}: ${stat.count} (${percentage.toFixed(1)}%)\n`;
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

    analysis += `   - الفئة الأكثر تمثيلاً: ${genderMap[maxEntry.key] ?? maxEntry.key} (${maxEntry.percentage.toFixed(1)}%)\n`;
    analysis += `   - الفئة الأقل تمثيلاً: ${genderMap[minEntry.key] ?? minEntry.key} (${minEntry.percentage.toFixed(1)}%)\n`;

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
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b" dir="rtl">
            <h3 className="text-lg font-bold flex items-center gap-2">
                <NotebookPen className="w-5 h-5" />
                تحليل نوعي للتوزيع
            </h3>
            <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 p-1"
            >
                <X className="w-6 h-6" />
            </button>
        </div>
        <div className="overflow-y-auto p-6 text-justify flex-1">
          <p className="whitespace-pre-wrap m-6">
            {getStatisticalAnalysis(data)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatisticalCountQualitativeAnalysis;