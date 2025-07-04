import { NotebookPen, X } from 'lucide-react';
import React from 'react';

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

const CategoryStatsQualitativeAnalysis: React.FC<{ stats: CategoryStats[]; onClose: () => void;}> = ({ stats, onClose }) => {
    const getCategoryAnalysis = (item: CategoryStats): JSX.Element[] | null => {
      const {
        weakCategory,
        nearAverageCategory,
        averageCategory,
        goodCategory,
        excellentCategory,
        subject
      } = item;

      const total = weakCategory.count + nearAverageCategory.count + averageCategory.count + goodCategory.count + excellentCategory.count;

      // إذا كانت جميع الفئات صفر، لا يتم عرض التحليل
      if (total === 0) return null;

      const excellentAndGoodPercentage = excellentCategory.percentage + goodCategory.percentage;
      const weakAndNearAveragePercentage = weakCategory.percentage + nearAverageCategory.percentage;

      let diagnosis: string;
      if (excellentAndGoodPercentage >= 50) {
        diagnosis = `تشير المعطيات إلى أن نسبة ${excellentAndGoodPercentage.toFixed(2)}% من التلاميذ ينتمون إلى الفئتين الجيدة والحسنة، مما يعكس أداءً بيداغوجيًا متميزًا في مادة ${subject}. يدل هذا على نجاعة الممارسات الصفية وفعالية المقاربات المعتمدة في تقديم المحتوى.`;
      } else if (averageCategory.percentage >= 40) {
        diagnosis = `تبين النتائج أن حوالي ${averageCategory.percentage.toFixed(2)}% من التلاميذ ينتمون إلى الفئة المتوسطة، مما يعكس مستوى استيعاب مقبول ويستوجب دعمًا بيداغوجيًا موجهًا نحو تعزيز الكفاءات وتثبيت المكتسبات.`;
      } else if (weakAndNearAveragePercentage >= 60) {
        diagnosis = `تشير النسب المسجلة إلى أكثر من 60% من التلاميذ ينتمون إلى الفئتين الضعيفة والقريبة من المتوسط، وهو مؤشر على وجود صعوبات تعليمية قد تكون ناتجة عن تمثلات خاطئة، أو عوائق في استيعاب المفاهيم الأساسية للمادة.`;
      } else {
        diagnosis = `تُظهر النتائج توزيعًا متقاربًا بين مختلف الفئات، مما يدل على تباين مستويات التحصيل داخل القسم، ويستوجب ذلك اعتماد آليات تشخيص دقيقة لمواكبة خصوصيات كل فئة بيداغوجيًا.`;
      }

      const summary = `انطلاقًا من هذه المؤشرات، يُوصى الفريق التربوي بتعزيز آليات الدعم والتقويم التكويني، وضبط تدخلات تفريدية تستجيب للفروق الفردية، مع تشجيع تبادل التجارب الناجعة بين المدرسين بهدف الارتقاء بالأداء البيداغوجي العام في مادة ${subject}.`;

      return [
        <p className="m-4" key="header">
          تحليل بيداغوجي لتوزيع التلاميذ حسب الفئات في مادة <strong>{subject}</strong>:
        </p>,
        <p className="m-4" key="stats">
          - الفئة الضعيفة: {weakCategory.percentage.toFixed(2)}%<br />
          - الفئة القريبة من المتوسط: {nearAverageCategory.percentage.toFixed(2)}%<br />
          - الفئة المتوسطة: {averageCategory.percentage.toFixed(2)}%<br />
          - الفئة الحسنة: {goodCategory.percentage.toFixed(2)}%<br />
          - الفئة الجيدة جداً: {excellentCategory.percentage.toFixed(2)}%
        </p>,
        <p className="m-4" key="diagnosis">
          {diagnosis}
        </p>,
        <p className="m-4" key="summary">
          {summary}
        </p>
      ];
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b" dir="rtl">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <NotebookPen className="w-5 h-5" />
              التحليل النوعي لتوزيع الفئات
            </h3>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 text-justify flex-1">
            {stats.map((item) => {
              const analysis = getCategoryAnalysis(item);
              if (!analysis) return null;

              return (
                <div key={item.subject} className="border-b m-4">
                  <h4 className="font-bold mb-2 m-4">{item.subject}</h4>
                  {analysis}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

export default CategoryStatsQualitativeAnalysis;