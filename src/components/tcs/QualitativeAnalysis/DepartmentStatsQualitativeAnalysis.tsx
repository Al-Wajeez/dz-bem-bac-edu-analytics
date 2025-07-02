import { NotebookPen, X } from 'lucide-react';
import React from 'react';

interface DepartmentStats {
  subject: string;
  departments: { [key: string]: number };
  highestDepartment: string;
  lowestDepartment: string;
  highestMean: number;
  lowestMean: number;
}

const DepartmentStatsQualitativeAnalysis: React.FC<{stats: DepartmentStats[]; onClose: () => void;}> = ({ stats, onClose }) => {
    const getDepartmentAnalysis = (item: DepartmentStats): JSX.Element[] | null => {
      const highestValue = item.departments[item.highestDepartment];
      const lowestValue = item.departments[item.lowestDepartment];
      // Skip rendering if both highest and lowest values are 0 or undefined
      if (!highestValue && !lowestValue) return null;
      const range = highestValue - lowestValue;

      let interpretation: string;

      if (range <= 2) {
        interpretation =
          "تعكس هذه النتائج تجانسًا ملحوظًا في الأداء بين مختلف الأقسام، حيث لا يتجاوز الفارق نقطتين، مما يدل على تقارب في مستوى التحصيل الدراسي للمادة وعلى نجاعة توزيع المحتوى البيداغوجي وتوحيد الممارسات التدريسية.";
      } else if (range <= 4) {
        interpretation =
          "تشير المعطيات إلى وجود تفاوت محدود في أداء الأقسام، حيث يتراوح الفارق بين نقطتين وأربع نقاط. هذا التفاوت قد يكون نتيجة لاختلاف في إيقاع التعلّم أو تباين في التفاعل داخل الأقسام، وهو ما يستدعي ضبطًا بيداغوجيًا مرنًا يراعي خصوصيات كل قسم.";
      } else if (range <= 6) {
        interpretation =
          "تُظهر النتائج تباينًا واضحًا في مستويات التحصيل بين الأقسام، بفارق يتجاوز الأربع نقاط. هذا يدل على وجود تحديات بيداغوجية أو فروقات في دعم المتعلمين، ما يفرض ضرورة تحليل سياقات كل قسم واقتراح تدخلات موجهة لمعالجة الفجوات.";
      } else {
        interpretation =
          "تبرز المعطيات تفاوتًا كبيرًا في أداء الأقسام، حيث يتجاوز الفارق الست نقاط، وهو مؤشر مقلق يستوجب تدخلاً عاجلًا لتشخيص أسباب هذا التباين، سواء على مستوى طرائق التدريس أو الممارسات الصفية أو مستوى الدعم التربوي الموجه.";
      }

      return [
        <p className="m-4" key="title">
          تحليل نتائج مادة <strong>{item.subject}</strong> حسب الأقسام الدراسية يظهر أن القسم الأعلى أداءً هو <strong>{item.highestDepartment}</strong> بمعدل قدره <strong>{highestValue}</strong>، في حين سجل القسم الأضعف، <strong>{item.lowestDepartment}</strong>، معدلًا قدره <strong>{lowestValue}</strong>. ويبلغ الفارق بين القسمين <strong>{range.toFixed(2)}</strong> نقطة.
        </p>,
        <p className="m-4" key="interpretation">{interpretation}</p>,
        <p className="m-4" key="conclusion">
          تستوجب هذه المؤشرات وضع خطة تربوية تركز على تعزيز الممارسات الناجعة، ومواكبة الأقسام ذات الأداء الضعيف عبر دعم تكويني للأساتذة، وتنشيط ورشات التقاسم المهني، واعتماد مقاربات تفريدية تُمكن من تقليص الفجوة والارتقاء بمستوى التحصيل في المادة.
        </p>
      ];
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b" dir="rtl">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <NotebookPen className="w-5 h-5" />
              التحليل النوعي لنتائج الأقسام
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
              const analysis = getDepartmentAnalysis(item);
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

export default DepartmentStatsQualitativeAnalysis;