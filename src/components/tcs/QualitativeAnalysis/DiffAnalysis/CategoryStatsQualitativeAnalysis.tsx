import { NotebookPen, X } from 'lucide-react';
import React from 'react';

interface CategoryComparison {
  subject: string;
  termACount: number;
  termAPercentage: string;
  termBCount: number;
  termBPercentage: string;
  difference: string;
  remark: string;
  remarkType: 'success' | 'danger' | 'secondary';
}

interface CategoryQualitativeAnalysisProps {
  termA: string;
  termB: string;
  comparisons: CategoryComparison[];
  category: 'weakCategory' | 'nearAverageCategory' | 'averageCategory' | 
            'goodCategory' | 'excellentCategory';
  onClose: () => void;
}

const getCategoryTitle = (category: string): string => {
  switch(category) {
    case 'weakCategory': return 'الفئة الضعيفة';
    case 'nearAverageCategory': return 'الفئة القريبة من المتوسط';
    case 'averageCategory': return 'الفئة المتوسطة';
    case 'goodCategory': return 'الفئة الحسنة';
    case 'excellentCategory': return 'الفئة الجيدة';
    default: return '';
  }
};

const getCategoryDescription = (category: string): string => {
  switch(category) {
    case 'weakCategory': return 'أداء ضعيف (أقل من 1.5 انحراف معياري تحت المتوسط)';
    case 'nearAverageCategory': return 'أداء قريب من المتوسط (بين 0.5 و1.5 انحراف معياري تحت المتوسط)';
    case 'averageCategory': return 'أداء متوسط (ضمن 0.5 انحراف معياري حول المتوسط)';
    case 'goodCategory': return 'أداء جيد (بين 0.5 و1.5 انحراف معياري فوق المتوسط)';
    case 'excellentCategory': return 'أداء ممتاز (أكثر من 1.5 انحراف معياري فوق المتوسط)';
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
  category: string
): string => {
  const isImproved = termBPercentage > termAPercentage;
  const difference = Math.abs(termBPercentage - termAPercentage);
  const improvementLevel = getImprovementLevel(difference);
  const categoryTitle = getCategoryDescription(category);

  const baseAnalysis = `في مادة ${subject}، بلغت نسبة الطلاب في ${categoryTitle} ${termAPercentage.toFixed(2)}% في ${termA} مقارنة بـ ${termBPercentage.toFixed(2)}% في ${termB}، مما يشير إلى ${isImproved ? 'تحسن' : 'تراجع'} ${improvementLevel}.`;

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

const CategoryStatsQualitativeAnalysis: React.FC<CategoryQualitativeAnalysisProps> = ({ 
  termA,
  termB,
  comparisons,
  category,
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
            التحليل النوعي لتوزيع الفئات ({getCategoryTitle(category)}) بين {termA} و {termB}
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
              بناءً على تحليل توزيع الفئات في {getCategoryTitle(category)} ({getCategoryDescription(category)}) بين {termA} و {termB}، نلاحظ وجود {overallTrend} عام في الأداء بمعدل {Math.abs(avgImprovement).toFixed(2)}%.
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
                  category
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
              {category === 'weakCategory' && (
                <>
                  <li>تنفيذ برامج علاجية مكثفة لمادة {mostDeclined.subject} لتحسين أداء الطلاب الضعيف</li>
                  <li>توفير دعم إضافي للطلاب الذين يواجهون صعوبات في المواد الأساسية</li>
                </>
              )}
              {category === 'nearAverageCategory' && (
                <>
                  <li>تعزيز مهارات الطلاب في مادة {mostDeclined.subject} لرفعهم إلى الفئة المتوسطة</li>
                  <li>تنظيم ورش عمل لتحسين استراتيجيات التعلم</li>
                </>
              )}
              {category === 'averageCategory' && (
                <>
                  <li>تحسين أداء الطلاب المتوسطين في مادة {mostDeclined.subject}</li>
                  <li>دراسة أسباب التحسن في مادة {mostImproved.subject}</li>
                </>
              )}
              {category === 'goodCategory' && (
                <>
                  <li>تعزيز أداء الطلاب الجيدين في مادة {mostDeclined.subject}</li>
                  <li>تحليل عوامل النجاح في مادة {mostImproved.subject}</li>
                </>
              )}
              {category === 'excellentCategory' && (
                <>
                  <li>توفير تحديات أكاديمية إضافية للطلاب المتفوقين في مادة {mostDeclined.subject}</li>
                  <li>دراسة عوامل التميز في مادة {mostImproved.subject}</li>
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

export default CategoryStatsQualitativeAnalysis;