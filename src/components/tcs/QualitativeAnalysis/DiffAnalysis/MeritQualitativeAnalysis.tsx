import { NotebookPen, X } from 'lucide-react';
import React from 'react';

interface MeritComparison {
  indicator: string;
  countA: number;
  percentageA: number;
  countB: number;
  percentageB: number;
  difference: number;
  remark: string;
  remarkType: 'success' | 'info' | 'secondary';
}

interface MeritQualitativeAnalysisProps {
  termA: string;
  termB: string;
  comparisons: MeritComparison[];
  onClose: () => void;
}

const getMeritDescription = (indicator: string): string => {
  switch(indicator) {
    case 'إمتياز': return 'أعلى مستوى من التميز الأكاديمي (18-20)';
    case 'تهنئة': return 'أداء متميز جداً (15-17.99)';
    case 'تشجيع': return 'أداء متميز (14-14.99)';
    case 'لوحة شرف': return 'أداء جيد جداً (12-13.99)';
    case 'ملاحظة': return 'أداء يحتاج لتحسين (أقل من 12)';
    default: return '';
  }
};

const getImprovementLevel = (difference: number): string => {
  if (difference >= 15) return 'كبير جدًا';
  if (difference >= 10) return 'كبير';
  if (difference >= 5) return 'ملحوظ';
  return 'طفيف';
};

const getCategorySpecificAnalysis = (
  indicator: string,
  percentageA: number,
  percentageB: number,
  termA: string,
  termB: string
): string => {
  const isImproved = percentageB > percentageA;
  const difference = Math.abs(percentageB - percentageA);
  const improvementLevel = getImprovementLevel(difference);
  const meritDesc = getMeritDescription(indicator);

  const baseAnalysis = `في فئة ${indicator} (${meritDesc})، تحسنت النسبة من ${percentageA.toFixed(2)}% في ${termA} إلى ${percentageB.toFixed(2)}% في ${termB}، مما يشير إلى ${isImproved ? 'تحسن' : 'تراجع'} ${improvementLevel} في هذا المستوى من الأداء.`;

  const categorySpecifics: { [key: string]: string } = {
    'إمتياز': `هذا ${isImproved ? 'التحسن' : 'التراجع'} يعكس ${isImproved ? 'زيادة في' : 'انخفاضًا في'} عدد الطلاب المتميزين أكاديميًا.`,
    'تهنئة': `تشير هذه النتائج إلى ${isImproved ? 'تحسن' : 'تراجع'} في عدد الطلاب ذوي الأداء المتميز جدًا.`,
    'تشجيع': `هذا ${isImproved ? 'التحسن' : 'تراجع'} يدل على ${isImproved ? 'زيادة' : 'انخفاض'} في عدد الطلاب المتميزين.`,
    'لوحة شرف': `تعكس هذه النتائج ${isImproved ? 'تحسن' : 'تراجع'} في عدد الطلاب ذوي الأداء الجيد جدًا.`,
    'ملاحظة': `هذا ${isImproved ? 'التحسن' : 'تراجع'} يشير إلى ${isImproved ? 'انخفاض' : 'زيادة'} في عدد الطلاب الذين يحتاجون لتحسين أدائهم.`,
  };

  return `${baseAnalysis} ${categorySpecifics[indicator] || ''}`;
};

const MeritQualitativeAnalysis: React.FC<MeritQualitativeAnalysisProps> = ({ 
  termA,
  termB,
  comparisons,
  onClose 
}) => {
  // Filter out total row and empty categories
  const validComparisons = comparisons.filter(c => 
    c.indicator !== 'المجموع' && (c.countA > 0 || c.countB > 0)
  );
  
  // Find most improved and most declined categories
  const mostImproved = validComparisons.reduce((prev, curr) => 
    (curr.percentageB - curr.percentageA) > (prev.percentageB - prev.percentageA) ? curr : prev, validComparisons[0]);
  
  const mostDeclined = validComparisons.reduce((prev, curr) => 
    (curr.percentageA - curr.percentageB) > (prev.percentageA - prev.percentageB) ? curr : prev, validComparisons[0]);

  // Calculate overall improvement in excellence categories
  const excellenceImprovement = validComparisons
    .filter(c => ['إمتياز', 'تهنئة', 'تشجيع'].includes(c.indicator))
    .reduce((sum, curr) => sum + (curr.percentageB - curr.percentageA), 0);

  const overallTrend = excellenceImprovement > 0 ? 'تحسن' : 'تراجع';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between p-6 border-b" dir="rtl">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <NotebookPen className="w-5 h-5" />
            التحليل النوعي للتوزيع النوعي بين {termA} و {termB}
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
              بناءً على تحليل التوزيع النوعي بين {termA} و {termB}، نلاحظ وجود {overallTrend} عام في فئات التميز بمعدل {Math.abs(excellenceImprovement).toFixed(2)}%.
              وقد سجلت فئة {mostImproved.indicator} أكبر تحسن بمقدار {(mostImproved.percentageB - mostImproved.percentageA).toFixed(2)}%،
              بينما شهدت فئة {mostDeclined.indicator} أكبر تراجع بمقدار {(mostDeclined.percentageA - mostDeclined.percentageB).toFixed(2)}%.
            </p>
          </div>

          {validComparisons.map((comparison) => (
            <div key={comparison.indicator} className="border-b p-4 mb-4">
              <h4 className="font-bold mb-2">{comparison.indicator}</h4>
              <p className="mb-2">
                {getCategorySpecificAnalysis(
                  comparison.indicator,
                  comparison.percentageA,
                  comparison.percentageB,
                  termA,
                  termB
                )}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">
                  عدد الطلاب: {comparison.countA} في {termA} → {comparison.countB} في {termB}
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
              <li>تعزيز برامج التميز الأكاديمي للحفاظ على التحسن في فئة {mostImproved.indicator}</li>
              <li>وضع خطة علاجية لمعالجة التراجع في فئة {mostDeclined.indicator}</li>
              <li>تحليل عوامل النجاح في الفئات التي شهدت تحسنًا ملحوظًا</li>
              <li>مراجعة استراتيجيات التدريس للفئات التي شهدت تراجعًا</li>
              <li>تنظيم ورش عمل لتبادل أفضل الممارسات بين المعلمين</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeritQualitativeAnalysis;