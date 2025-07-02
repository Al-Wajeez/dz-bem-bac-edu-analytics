import { NotebookPen, X } from 'lucide-react';
import React from 'react';

type RemarkType = 'success' | 'warning' | 'danger' | 'info' | 'secondary';

interface GradeDistribution {
  subject: string;
  above10: { count: number; percentage: number };
  between8And10: { count: number; percentage: number };
  below8: { count: number; percentage: number };
  remark: string;
  remarkType: RemarkType;
}

const GradeDistributionQualitativeAnalysis: React.FC<{distribution: GradeDistribution[];onClose: () => void;}> = ({ distribution, onClose }) => {
    const getDistributionAnalysis = (item: GradeDistribution): JSX.Element | null => {
      const {
        above10,
        between8And10,
        below8
      } = item;

      if (
        above10.count === 0 &&
        between8And10.count === 0 &&
        below8.count === 0
      ) {
        return null; // إخفاء المواد التي لا تحتوي على بيانات
      }

      return (
        <p>
          أظهرت نتائج التلاميذ في مادة <strong>{item.subject}</strong>،
          {above10.percentage >= 80
            ? " أداءً متميزًا يعكس تحصيلاً عاليًا لدى أغلب التلاميذ."
            : above10.percentage >= 50
            ? " أداءً إيجابيًا يعكس مستوىً تعليميًا جيدًا."
            : above10.percentage >= 40
            ? " أداءً متوسطًا يعكس مستوى تعليميًا مقبولًا، حيث أن حوالي ثلث التلاميذ حققوا معدلات النجاح."
            : " أداءً متواضعًا يُبرز صعوبات واضحة في اكتساب الكفايات المستهدفة في هذه المادة."
          } حيث بلغت نسبة التلاميذ الذين حققوا معدلات مساوية أو تفوق عتبة النجاح (10/20) حوالي
          <strong> {above10.percentage.toFixed(2)}%</strong>.

          كما سجّلت نسبة التلاميذ الذين تتراوح معدلاتهم بين (8 و 10)
          <strong> {between8And10.percentage.toFixed(2)}%</strong>،

          في حين لم تتجاوز نسبة التلاميذ الذين حصلوا على أقل من 8/20 حدود
          <strong> {below8.percentage.toFixed(2)}%</strong>، مما يدل على
          {below8.percentage > 30
            ? " حاجة ملحة لتكثيف الدعم التربوي لهؤلاء المتعثرين."
            : " انخفاض واضح في نسب التعثر الدراسي في هذه المادة."}
        </p>
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b" dir="rtl">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <NotebookPen className="w-5 h-5" />
              التحليل النوعي لتوزيع النتائج
            </h3>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 text-justify flex-1">
            {distribution.map((item) => {
              const analysis = getDistributionAnalysis(item);
              return analysis ? (
                <div key={item.subject} className="border-b p-4">
                  <h4 className="font-bold mb-2">{item.subject}</h4>
                  <p className="whitespace-pre-line">{analysis}</p>

                  {item.remark && item.remark.trim() !== '' && (
                    <p className="mt-4">
                      وتنسجم هذه المعطيات مع الملاحظة المسجلة: {item.remark}، والتي تعزز القراءة الإحصائية لنتائج المادة.
                    </p>
                  )}
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
    );
  };

export default GradeDistributionQualitativeAnalysis;