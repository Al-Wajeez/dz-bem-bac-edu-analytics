import { NotebookPen, X } from 'lucide-react';
import React from 'react';

interface GradeDistributionComparison {
  subject: string;
  termACount: number;
  termAPercentage: string;
  termBCount: number;
  termBPercentage: string;
  difference: string;
  remark: string;
  remarkType: 'success' | 'danger' | 'secondary';
}

interface DetailedGradeDistributionQualitativeAnalysisProps {
  termA: string;
  termB: string;
  comparisons: GradeDistributionComparison[];
  gradeRange: 'range0To8' | 'range9To9' | 'range10To11' | 
             'range12To13' | 'range14To15' | 'range16To17' | 'range18To20';
  onClose: () => void;
}

const getRangeTitle = (range: string): string => {
  switch(range) {
    case 'range0To8': return 'الدرجات أقل من 8';
    case 'range9To9': return 'الدرجات من 9 إلى 9.99';
    case 'range10To11': return 'الدرجات من 10 إلى 11.99';
    case 'range12To13': return 'الدرجات من 12 إلى 13.99';
    case 'range14To15': return 'الدرجات من 14 إلى 15.99';
    case 'range16To17': return 'الدرجات من 16 إلى 17.99';
    case 'range18To20': return 'الدرجات من 18 إلى 20';
    default: return '';
  }
};

const getRangeDescription = (range: string): string => {
  switch(range) {
    case 'range0To8': return 'أداء ضعيف';
    case 'range9To9': return 'أداء دون المتوسط';
    case 'range10To11': return 'أداء متوسط';
    case 'range12To13': return 'أداء جيد';
    case 'range14To15': return 'أداء جيد جدًا';
    case 'range16To17': return 'أداء ممتاز';
    case 'range18To20': return 'أداء متميز';
    default: return '';
  }
};

const getImprovementLevel = (difference: number): string => {
  const absDiff = Math.abs(difference);
  if (absDiff >= 15) return 'كبير جدًا';
  if (absDiff >= 10) return 'كبير';
  if (absDiff >= 5) return 'ملحوظ';
  return 'طفيف';
};

const getSubjectSpecificAnalysis = (
  subject: string,
  termAPercentage: number,
  termBPercentage: number,
  termA: string,
  termB: string,
  range: string
): string => {
  const isImproved = termBPercentage > termAPercentage;
  const difference = Math.abs(termBPercentage - termAPercentage);
  const improvementLevel = getImprovementLevel(difference);
  const rangeTitle = getRangeDescription(range);

  const baseAnalysis = `في مادة ${subject}، بلغت نسبة الطلاب في نطاق ${rangeTitle} ${termAPercentage.toFixed(2)}% في ${termA} مقارنة بـ ${termBPercentage.toFixed(2)}% في ${termB}، مما يشير إلى ${isImproved ? 'تحسن' : 'تراجع'} ${improvementLevel}.`;

  const subjectSpecifics: { [key: string]: string } = {
    'اللغة العربية': `هذا ${isImproved ? 'التحسن' : 'التراجع'} يعكس ${isImproved ? 'زيادة في' : 'انخفاضًا في'} إتقان المهارات اللغوية الأساسية.`,
    'الرياضيات': `تشير هذه النتائج إلى ${isImproved ? 'تحسن' : 'تراجع'} في القدرة على حل المسائل الرياضية.`,
    'العلوم': `هذا ${isImproved ? 'التحسن' : 'تراجع'} يدل على ${isImproved ? 'زيادة' : 'انخفاض'} في الفهم العلمي.`,
    'اللغة الفرنسية': `تعكس هذه النتائج ${isImproved ? 'تحسن' : 'تراجع'} في المهارات اللغوية الفرنسية.`,
    'اللغة الإنجليزية': `هذا ${isImproved ? 'التحسن' : 'تراجع'} يشير إلى ${isImproved ? 'زيادة' : 'انخفاض'} في إتقان اللغة الإنجليزية.`,
  };

  const subjectKey = Object.keys(subjectSpecifics).find(key => subject.includes(key)) || '';

  return `${baseAnalysis} ${subjectSpecifics[subjectKey] || ''}`;
};

const DetailedGradeDistributionQualitativeAnalysis: React.FC<DetailedGradeDistributionQualitativeAnalysisProps> = ({ 
  termA,
  termB,
  comparisons,
  gradeRange,
  onClose 
}) => {
  // Filter out subjects with no data
  const validComparisons = comparisons.filter(c => parseFloat(c.termAPercentage) > 0 || parseFloat(c.termBPercentage) > 0);
  
  // Find most improved and most declined subjects
  const mostImproved = validComparisons.reduce((prev, curr) => 
    (parseFloat(curr.termBPercentage) - parseFloat(curr.termAPercentage)) > 
    (parseFloat(prev.termBPercentage) - parseFloat(prev.termAPercentage)) ? curr : prev, validComparisons[0]);
  
  const mostDeclined = validComparisons.reduce((prev, curr) => 
    (parseFloat(curr.termAPercentage) - parseFloat(curr.termBPercentage)) > 
    (parseFloat(prev.termAPercentage) - parseFloat(prev.termBPercentage)) ? curr : prev, validComparisons[0]);

  // Calculate overall improvement
  const totalImprovement = validComparisons.reduce((sum, curr) => 
    sum + (parseFloat(curr.termBPercentage) - parseFloat(curr.termAPercentage)), 0);
  const avgImprovement = totalImprovement / validComparisons.length;
  const overallTrend = avgImprovement > 0 ? 'تحسن' : 'تراجع';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between p-6 border-b" dir="rtl">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <NotebookPen className="w-5 h-5" />
            التحليل النوعي لتوزيع الدرجات ({getRangeTitle(gradeRange)}) بين {termA} و {termB}
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
              بناءً على تحليل توزيع الدرجات في نطاق {getRangeTitle(gradeRange)} ({getRangeDescription(gradeRange)}) بين {termA} و {termB}، نلاحظ وجود {overallTrend} عام في الأداء بمعدل {Math.abs(avgImprovement).toFixed(2)}%.
              وقد سجلت المادة {mostImproved.subject} أكبر تحسن بمقدار {(parseFloat(mostImproved.termBPercentage) - parseFloat(mostImproved.termAPercentage)).toFixed(2)}%،
              بينما شهدت المادة {mostDeclined.subject} أكبر تراجع بمقدار {(parseFloat(mostDeclined.termAPercentage) - parseFloat(mostDeclined.termBPercentage)).toFixed(2)}%.
            </p>
          </div>

          {validComparisons.map((comparison) => (
            <div key={comparison.subject} className="border-b p-4 mb-4">
              <h4 className="font-bold mb-2">{comparison.subject}</h4>
              <p className="mb-2">
                {getSubjectSpecificAnalysis(
                  comparison.subject,
                  parseFloat(comparison.termAPercentage),
                  parseFloat(comparison.termBPercentage),
                  termA,
                  termB,
                  gradeRange
                )}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">
                  عدد الطلاب: {comparison.termACount} في {termA} → {comparison.termBCount} في {termB}
                </span>
                <span className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-md py-2 ${
                  comparison.remarkType === 'success' ? 'bg-green-100 text-green-800' :
                  comparison.remarkType === 'danger' ? 'bg-red-100 text-red-800' :
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
              {gradeRange === 'range0To8' && (
                <>
                  <li>تنفيذ برامج علاجية مكثفة لمادة {mostDeclined.subject} لتحسين أداء الطلاب الضعيف</li>
                  <li>توفير دعم إضافي للطلاب الذين يواجهون صعوبات في المواد الأساسية</li>
                </>
              )}
              {gradeRange === 'range9To9' && (
                <>
                  <li>تعزيز مهارات الطلاب في مادة {mostDeclined.subject} لرفعهم إلى فئة النجاح</li>
                  <li>تنظيم ورش عمل لتحسين استراتيجيات التعلم</li>
                </>
              )}
              {gradeRange === 'range10To11' && (
                <>
                  <li>تحسين أداء الطلاب المتوسطين في مادة {mostDeclined.subject}</li>
                  <li>دراسة أسباب التحسن في مادة {mostImproved.subject}</li>
                </>
              )}
              {gradeRange === 'range12To13' && (
                <>
                  <li>تعزيز أداء الطلاب الجيدين في مادة {mostDeclined.subject}</li>
                  <li>تحليل عوامل النجاح في مادة {mostImproved.subject}</li>
                </>
              )}
              {gradeRange === 'range14To15' && (
                <>
                  <li>تطوير مهارات الطلاب المتميزين في مادة {mostDeclined.subject}</li>
                  <li>تعميم أفضل الممارسات من مادة {mostImproved.subject}</li>
                </>
              )}
              {gradeRange === 'range16To17' && (
                <>
                  <li>توفير تحديات أكاديمية إضافية للطلاب المتفوقين في مادة {mostDeclined.subject}</li>
                  <li>دراسة عوامل التميز في مادة {mostImproved.subject}</li>
                </>
              )}
              {gradeRange === 'range18To20' && (
                <>
                  <li>رعاية الموهوبين والمتميزين في مادة {mostDeclined.subject}</li>
                  <li>تحليل أسباب التميز في مادة {mostImproved.subject}</li>
                </>
              )}
              <li>مراجعة استراتيجيات التدريس في المواد التي شهدت تراجعًا</li>
              <li>تعميم أفضل الممارسات من المواد التي شهدت تحسنًا ملحوظًا</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedGradeDistributionQualitativeAnalysis;