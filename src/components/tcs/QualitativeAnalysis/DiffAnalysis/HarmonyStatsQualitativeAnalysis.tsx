import { NotebookPen, X } from 'lucide-react';
import React from 'react';

interface HarmonyComparison {
  subject: string;
  harmonyRatioA: number;
  harmonyRatioB: number;
  difference: number;
  remark: string;
  remarkType: 'success' | 'info' | 'secondary';
}

interface HarmonyQualitativeAnalysisProps {
  termA: string;
  termB: string;
  comparisons: HarmonyComparison[];
  onClose: () => void;
}

const getHarmonyLevel = (ratio: number): string => {
  if (ratio <= 15) return 'انسجام عالي جدًا';
  if (ratio <= 25) return 'انسجام عالي';
  if (ratio <= 35) return 'انسجام متوسط';
  if (ratio <= 50) return 'انسجام منخفض';
  return 'انسجام ضعيف جدًا';
};

const getImprovementLevel = (difference: number): string => {
  if (difference >= 20) return 'كبير جدًا';
  if (difference >= 10) return 'كبير';
  if (difference >= 5) return 'ملحوظ';
  return 'طفيف';
};

const getSubjectSpecificAnalysis = (
  subject: string,
  harmonyRatioA: number,
  harmonyRatioB: number,
  termA: string,
  termB: string
): string => {
  const isImproved = harmonyRatioB < harmonyRatioA;
  const difference = Math.abs(harmonyRatioB - harmonyRatioA);
  const improvementLevel = getImprovementLevel(difference);
  const harmonyLevelA = getHarmonyLevel(harmonyRatioA);
  const harmonyLevelB = getHarmonyLevel(harmonyRatioB);

  const baseAnalysis = `في مادة ${subject}، تحسنت نسبة الانسجام من ${harmonyRatioA.toFixed(2)}% (${harmonyLevelA}) في ${termA} إلى ${harmonyRatioB.toFixed(2)}% (${harmonyLevelB}) في ${termB}، مما يشير إلى ${isImproved ? 'تحسن' : 'تراجع'} ${improvementLevel} في تجانس نتائج الطلاب.`;

  const subjectSpecifics: { [key: string]: string } = {
    'اللغة العربية': `هذا ${isImproved ? 'التحسن' : 'التراجع'} في الانسجام يعكس ${isImproved ? 'تقارب' : 'تباعد'} في مستوى إتقان المهارات اللغوية بين الطلاب.`,
    'الرياضيات': `تشير هذه النتائج إلى ${isImproved ? 'تقارب' : 'تباعد'} في القدرة على حل المسائل الرياضية بين الطلاب.`,
    'العلوم': `هذا ${isImproved ? 'التحسن' : 'التراجع'} يدل على ${isImproved ? 'تقارب' : 'تباعد'} في الفهم العلمي بين الطلاب.`,
    'اللغة الفرنسية': `تعكس هذه النتائج ${isImproved ? 'تقارب' : 'تباعد'} في مستوى إتقان اللغة الفرنسية بين الطلاب.`,
    'اللغة الإنجليزية': `هذا ${isImproved ? 'التحسن' : 'تراجع'} يشير إلى ${isImproved ? 'تقارب' : 'تباعد'} في مستوى إتقان اللغة الإنجليزية بين الطلاب.`,
  };

  const subjectKey = Object.keys(subjectSpecifics).find(key => subject.includes(key)) || '';

  return `${baseAnalysis} ${subjectSpecifics[subjectKey] || ''}`;
};

const HarmonyStatsQualitativeAnalysis: React.FC<HarmonyQualitativeAnalysisProps> = ({ 
  termA,
  termB,
  comparisons,
  onClose 
}) => {
  // Filter out subjects with no data
  const validComparisons = comparisons.filter(c => c.harmonyRatioA > 0 || c.harmonyRatioB > 0);
  
  // Find most improved and most declined harmony
  const mostImproved = validComparisons.reduce((prev, curr) => 
    (curr.harmonyRatioA - curr.harmonyRatioB) > (prev.harmonyRatioA - prev.harmonyRatioB) ? curr : prev, validComparisons[0]);
  
  const mostDeclined = validComparisons.reduce((prev, curr) => 
    (curr.harmonyRatioB - curr.harmonyRatioA) > (prev.harmonyRatioB - prev.harmonyRatioA) ? curr : prev, validComparisons[0]);

  // Calculate overall improvement
  const totalImprovement = validComparisons.reduce((sum, curr) => 
    sum + (curr.harmonyRatioA - curr.harmonyRatioB), 0);
  const avgImprovement = totalImprovement / validComparisons.length;
  const overallTrend = avgImprovement > 0 ? 'تحسن' : 'تراجع';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between p-6 border-b" dir="rtl">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <NotebookPen className="w-5 h-5" />
            التحليل النوعي لنسب الانسجام بين {termA} و {termB}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 text-justify flex-1" dir="rtl">
          <div className="mb-6 bg-blue-50 p-4 rounded-md">
            <h4 className="font-bold mb-2">النظرة العامة</h4>
            <p>
              بناءً على تحليل نسب الانسجام بين {termA} و {termB}، نلاحظ وجود {overallTrend} عام في تجانس النتائج بمعدل {Math.abs(avgImprovement).toFixed(2)}%.
              وقد سجلت المادة {mostImproved.subject} أكبر تحسن في الانسجام بمقدار {(mostImproved.harmonyRatioA - mostImproved.harmonyRatioB).toFixed(2)}%،
              بينما شهدت المادة {mostDeclined.subject} أكبر تراجع في الانسجام بمقدار {(mostDeclined.harmonyRatioB - mostDeclined.harmonyRatioA).toFixed(2)}%.
            </p>
          </div>

          {validComparisons.map((comparison) => (
            <div key={comparison.subject} className="border-b p-4 mb-4">
              <h4 className="font-bold mb-2">{comparison.subject}</h4>
              <p className="mb-2">
                {getSubjectSpecificAnalysis(
                  comparison.subject,
                  comparison.harmonyRatioA,
                  comparison.harmonyRatioB,
                  termA,
                  termB
                )}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">
                  نسبة الانسجام: {comparison.harmonyRatioA.toFixed(2)}% في {termA} → {comparison.harmonyRatioB.toFixed(2)}% في {termB}
                </span>
                <span className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-md py-2 ${
                  comparison.remarkType === 'success' ? 'bg-green-100 text-green-800' :
                  comparison.remarkType === 'info' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {comparison.remark}
                </span>
              </div>
            </div>
          ))}

          <div className="mt-6 bg-yellow-50 p-4 rounded-md">
            <h4 className="font-bold mb-2">التوصيات</h4>
            <ul className="list-disc pr-5 space-y-2">
              <li>تعزيز استراتيجيات التدريس في مادة {mostDeclined.subject} لتحسين تجانس النتائج</li>
              <li>دراسة العوامل التي ساهمت في تحسن الانسجام في مادة {mostImproved.subject}</li>
              <li>توفير دعم إضافي للطلاب المتأخرين في المواد ذات الانسجام الضعيف</li>
              <li>تنظيم ورش عمل للمعلمين لتبادل أفضل الممارسات لتحسين الانسجام</li>
              <li>مراجعة المناهج والطرق التعليمية للمواد التي شهدت تراجعًا في الانسجام</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HarmonyStatsQualitativeAnalysis;