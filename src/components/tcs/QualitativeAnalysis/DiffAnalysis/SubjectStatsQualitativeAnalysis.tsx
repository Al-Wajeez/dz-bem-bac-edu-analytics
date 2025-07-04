import { NotebookPen, X } from 'lucide-react';
import React from 'react';

interface TermComparison {
  subject: string;
  meanA: number;
  meanB: number;
  stdDevA: number;
  stdDevB: number;
  difference: number;
  remark: string;
  remarkType: 'success' | 'info' | 'secondary';
}

interface SubjectStatsQualitativeAnalysisProps {
  termA: string;
  termB: string;
  comparisons: TermComparison[];
  onClose: () => void;
}

const getPerformanceLevel = (mean: number): string => {
  if (mean >= 14) return 'مرتفعًا';
  if (mean >= 10) return 'متوسطًا';
  return 'منخفضًا';
};

const getVariationLevel = (stdDev: number): string => {
  if (stdDev >= 3.5) return 'تباين عالٍ في الأداء';
  if (stdDev >= 2) return 'تباين متوسط في الأداء';
  return 'تباين محدود في الأداء';
};

const getImprovementLevel = (difference: number, isPositive: boolean): string => {
  const absDiff = Math.abs(difference);
  if (absDiff >= 3) return isPositive ? 'تحسنًا كبيرًا' : 'تراجعًا كبيرًا';
  if (absDiff >= 1.5) return isPositive ? 'تحسنًا ملحوظًا' : 'تراجعًا ملحوظًا';
  return isPositive ? 'تحسنًا طفيفًا' : 'تراجعًا طفيفًا';
};

const getSubjectSpecificAnalysis = (
  subject: string,
  meanA: number,
  meanB: number,
  stdDevA: number,
  stdDevB: number,
  termA: string,
  termB: string
): string => {
  const performanceA = getPerformanceLevel(meanA);
  const performanceB = getPerformanceLevel(meanB);
  const variationA = getVariationLevel(stdDevA);
  const variationB = getVariationLevel(stdDevB);
  const isImproved = meanB > meanA;
  const difference = Math.abs(meanB - meanA);
  const improvementLevel = getImprovementLevel(difference, isImproved);

  const baseAnalysis = `في مادة ${subject}، سجل التلاميذ متوسطًا قدره ${meanA.toFixed(2)} في ${termA} مقابل ${meanB.toFixed(2)} في ${termB}، مما يشير إلى ${improvementLevel}.`;

  const performanceComparison = `كان الأداء ${performanceA} في ${termA} وأصبح ${performanceB} في ${termB}.`;

  const variationComparison = `من حيث التباين، ${variationA} في ${termA} بينما ${variationB} في ${termB}.`;

  const subjectSpecifics: { [key: string]: string } = {
    'اللغة العربية': `تشير هذه النتائج إلى ${isImproved ? 'تحسن' : 'تراجع'} في المهارات اللغوية الأساسية ${isImproved ? 'مما يعكس تحسنا في الفهم القرائي والتعبير الكتابي' : 'وخاصة في مجالات الفهم والتعبير'}.`,
    'الرياضيات': `هذه النتائج تعكس ${isImproved ? 'تحسنا' : 'تراجعا'} في القدرة على حل المسائل الرياضية ${isImproved ? 'والتفكير المنطقي' : 'وخاصة في المسائل المعقدة'}.`,
    'العلوم': `يدل هذا على ${isImproved ? 'تحسن' : 'تراجع'} في الفهم العلمي ${isImproved ? 'والتجريبي' : 'وخاصة في تطبيق المفاهيم العلمية'}.`,
    'اللغة الفرنسية': `يعكس هذا ${isImproved ? 'تحسنا' : 'تراجعا'} في ${isImproved ? 'المهارات اللغوية' : 'القدرة على التواصل'} باللغة الفرنسية.`,
    'اللغة الإنجليزية': `تشير النتائج إلى ${isImproved ? 'تحسن' : 'تراجع'} في ${isImproved ? 'اكتساب المفردات والقواعد' : 'الفهم والاستيعاب'}.`,
  };

  const subjectKey = Object.keys(subjectSpecifics).find(key => subject.includes(key)) || '';

  return `${baseAnalysis} ${performanceComparison} ${variationComparison} ${subjectSpecifics[subjectKey] || ''}`;
};

const SubjectStatsQualitativeAnalysis: React.FC<SubjectStatsQualitativeAnalysisProps> = ({ 
  termA,
  termB,
  comparisons,
  onClose 
}) => {
  // Filter out subjects with no data
  const validComparisons = comparisons.filter(c => c.meanA > 0 && c.meanB > 0);
  
  // Find most improved and most declined subjects
  const mostImproved = validComparisons.reduce((prev, curr) => 
    (curr.meanB - curr.meanA) > (prev.meanB - prev.meanA) ? curr : prev, validComparisons[0]);
  
  const mostDeclined = validComparisons.reduce((prev, curr) => 
    (curr.meanA - curr.meanB) > (prev.meanA - prev.meanB) ? curr : prev, validComparisons[0]);

  // Calculate overall improvement
  const totalImprovement = validComparisons.reduce((sum, curr) => sum + (curr.meanB - curr.meanA), 0);
  const avgImprovement = totalImprovement / validComparisons.length;
  const overallTrend = avgImprovement > 0 ? 'تحسن' : 'تراجع';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between p-6 border-b" dir="rtl">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <NotebookPen className="w-5 h-5" />
            التحليل النوعي للمقارنة بين {termA} و {termB}
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
              بناءً على تحليل النتائج بين {termA} و {termB}، نلاحظ وجود {overallTrend} عام في الأداء بمعدل {Math.abs(avgImprovement).toFixed(2)} نقطة.
              وقد سجلت المادة {mostImproved.subject} أكبر تحسن بمقدار {(mostImproved.meanB - mostImproved.meanA).toFixed(2)} نقطة،
              بينما شهدت المادة {mostDeclined.subject} أكبر تراجع بمقدار {(mostDeclined.meanA - mostDeclined.meanB).toFixed(2)} نقطة.
            </p>
          </div>

          {validComparisons.map((comparison) => (
            <div key={comparison.subject} className="border-b p-4 mb-4">
              <h4 className="font-bold mb-2">{comparison.subject}</h4>
              <p className="mb-2">
                {getSubjectSpecificAnalysis(
                  comparison.subject,
                  comparison.meanA,
                  comparison.meanB,
                  comparison.stdDevA,
                  comparison.stdDevB,
                  termA,
                  termB
                )}
              </p>
              <p className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-md py-2 ${
                comparison.remarkType === 'success' ? 'bg-green-100 text-green-800' :
                comparison.remarkType === 'info' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {comparison.remark}
              </p>
            </div>
          ))}

          <div className="mt-6 bg-yellow-50 p-4 rounded-md">
            <h4 className="font-bold mb-2">التوصيات</h4>
            <ul className="list-disc pr-5 space-y-2">
              <li>تعزيز الدعم في مادة {mostDeclined.subject} لمعالجة أسباب التراجع</li>
              <li>الاستفادة من الاستراتيجيات الناجحة في تدريس {mostImproved.subject} وتطبيقها على مواد أخرى</li>
              <li>معالجة الفروق الكبيرة في الأداء بين التلاميذ في المواد ذات التباين العالي</li>
              <li>تنظيم حصص تقوية مركزة للمواد التي سجلت أداءً منخفضًا في كلا الفصلين</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectStatsQualitativeAnalysis;
