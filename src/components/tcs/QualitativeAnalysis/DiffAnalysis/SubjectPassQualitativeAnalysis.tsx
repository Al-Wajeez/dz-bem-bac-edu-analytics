import { NotebookPen, X } from 'lucide-react';
import React from 'react';

interface PassRateComparison {
  subject: string;
  passCountA: number;
  totalCountA: number;
  passPercentageA: number;
  passCountB: number;
  totalCountB: number;
  passPercentageB: number;
  difference: number;
  remark: string;
  remarkType: 'success' | 'info' | 'secondary';
}

interface SubjectPassQualitativeAnalysisProps {
  termA: string;
  termB: string;
  comparisons: PassRateComparison[];
  onClose: () => void;
}

const getImprovementLevel = (difference: number): string => {
  if (difference >= 20) return 'كبير جدًا';
  if (difference >= 10) return 'كبير';
  if (difference >= 5) return 'ملحوظ';
  return 'طفيف';
};

const getPassRateLevel = (percentage: number): string => {
  if (percentage >= 80) return 'مرتفعة جدًا';
  if (percentage >= 60) return 'مرتفعة';
  if (percentage >= 40) return 'متوسطة';
  return 'منخفضة';
};

const getSubjectSpecificAnalysis = (
  subject: string,
  passPercentageA: number,
  passPercentageB: number,
  termA: string,
  termB: string
): string => {
  const isImproved = passPercentageB > passPercentageA;
  const difference = Math.abs(passPercentageB - passPercentageA);
  const improvementLevel = getImprovementLevel(difference);
  const passRateA = getPassRateLevel(passPercentageA);
  const passRateB = getPassRateLevel(passPercentageB);

  const baseAnalysis = `في مادة ${subject}، تحسنت نسبة النجاح من ${passPercentageA.toFixed(2)}% (${passRateA}) في ${termA} إلى ${passPercentageB.toFixed(2)}% (${passRateB}) في ${termB}، مما يشير إلى ${isImproved ? 'تحسن' : 'تراجع'} ${improvementLevel} في أداء الطلاب.`;

  const subjectSpecifics: { [key: string]: string } = {
    'اللغة العربية': `هذا ${isImproved ? 'التحسن' : 'التراجع'} يعكس ${isImproved ? 'زيادة في' : 'انخفاضًا في'} إتقان المهارات اللغوية الأساسية من قراءة وكتابة.`,
    'الرياضيات': `تشير هذه النتائج إلى ${isImproved ? 'تحسن' : 'تراجع'} في القدرة على حل المسائل الرياضية والتفكير المنطقي.`,
    'العلوم': `هذا ${isImproved ? 'التحسن' : 'تراجع'} يدل على ${isImproved ? 'زيادة' : 'انخفاض'} في الفهم العلمي والتطبيق العملي للمفاهيم.`,
    'اللغة الفرنسية': `تعكس هذه النتائج ${isImproved ? 'تحسن' : 'تراجع'} في ${isImproved ? 'اكتساب' : 'فقدان'} المهارات اللغوية الفرنسية.`,
    'اللغة الإنجليزية': `هذا ${isImproved ? 'التحسن' : 'تراجع'} يشير إلى ${isImproved ? 'زيادة' : 'انخفاض'} في إتقان اللغة الإنجليزية.`,
  };

  const subjectKey = Object.keys(subjectSpecifics).find(key => subject.includes(key)) || '';

  return `${baseAnalysis} ${subjectSpecifics[subjectKey] || ''}`;
};

const SubjectPassQualitativeAnalysis: React.FC<SubjectPassQualitativeAnalysisProps> = ({ 
  termA,
  termB,
  comparisons,
  onClose 
}) => {
  // Filter out subjects with no data
  const validComparisons = comparisons.filter(c => c.totalCountA > 0 || c.totalCountB > 0);
  
  // Find most improved and most declined subjects
  const mostImproved = validComparisons.reduce((prev, curr) => 
    (curr.passPercentageB - curr.passPercentageA) > (prev.passPercentageB - prev.passPercentageA) ? curr : prev, validComparisons[0]);
  
  const mostDeclined = validComparisons.reduce((prev, curr) => 
    (curr.passPercentageA - curr.passPercentageB) > (prev.passPercentageA - prev.passPercentageB) ? curr : prev, validComparisons[0]);

  // Calculate overall improvement
  const totalImprovement = validComparisons.reduce((sum, curr) => 
    sum + (curr.passPercentageB - curr.passPercentageA), 0);
  const avgImprovement = totalImprovement / validComparisons.length;
  const overallTrend = avgImprovement > 0 ? 'تحسن' : 'تراجع';

  // Calculate average pass rates
  const avgPassRateA = validComparisons.reduce((sum, curr) => sum + curr.passPercentageA, 0) / validComparisons.length;
  const avgPassRateB = validComparisons.reduce((sum, curr) => sum + curr.passPercentageB, 0) / validComparisons.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between p-6 border-b" dir="rtl">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <NotebookPen className="w-5 h-5" />
            التحليل النوعي لنسب النجاح بين {termA} و {termB}
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
              بناءً على تحليل نسب النجاح بين {termA} و {termB}، نلاحظ وجود {overallTrend} عام في الأداء بمعدل {Math.abs(avgImprovement).toFixed(2)}%.
              حيث ارتفع متوسط النجاح من {avgPassRateA.toFixed(2)}% في {termA} إلى {avgPassRateB.toFixed(2)}% في {termB}.
            </p>
            <p className="mt-2">
              وقد سجلت المادة {mostImproved.subject} أكبر تحسن في النجاح بمقدار {(mostImproved.passPercentageB - mostImproved.passPercentageA).toFixed(2)}%،
              بينما شهدت المادة {mostDeclined.subject} أكبر تراجع بمقدار {(mostDeclined.passPercentageA - mostDeclined.passPercentageB).toFixed(2)}%.
            </p>
          </div>

          {validComparisons.map((comparison) => (
            <div key={comparison.subject} className="border-b p-4 mb-4">
              <h4 className="font-bold mb-2">{comparison.subject}</h4>
              <p className="mb-2">
                {getSubjectSpecificAnalysis(
                  comparison.subject,
                  comparison.passPercentageA,
                  comparison.passPercentageB,
                  termA,
                  termB
                )}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">
                  عدد الناجحين: {comparison.passCountA} في {termA} → {comparison.passCountB} في {termB}
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
              <li>تعزيز استراتيجيات التدريس في مادة {mostDeclined.subject} لتحسين نتائج الطلاب</li>
              <li>دراسة العوامل التي ساهمت في تحسن مادة {mostImproved.subject} وتعميم الدروس المستفادة</li>
              <li>توفير دعم إضافي للطلاب في المواد ذات نسب النجاح المنخفضة</li>
              <li>تنظيم ورش عمل للمعلمين لتبادل أفضل الممارسات التدريسية</li>
              <li>مراجعة المناهج والطرق التعليمية للمواد التي شهدت تراجعًا</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectPassQualitativeAnalysis;