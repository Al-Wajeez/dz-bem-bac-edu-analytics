import { NotebookPen, X } from 'lucide-react';
import React from 'react';

type RemarkType = 'success' | 'warning' | 'danger' | 'info' | 'secondary';

interface SubjectPassStats {
  subject: string;
  passCount: number;
  passPercentage: number;
  remark: string;
  remarkType: RemarkType;
}

const SubjectPassQualitativeAnalysis: React.FC<{data: SubjectPassStats[]; onClose: () => void;}> = ({ data, onClose }) => {
    const getPassAnalysis = (item: SubjectPassStats): string | null => {

      let analysis = `تشير نتائج مادة ${item.subject} إلى تسجيل نسبة نجاح بلغت ${item.passPercentage.toFixed(2)}%.\n\n`;
      if (
        item.passPercentage === 0
      ) {
        return null; // إخفاء المواد التي لا تحتوي على بيانات
      }

      if (item.passPercentage >= 85) {
        analysis += `يعكس هذا المؤشر أداءً بيداغوجيًا متميزًا، يُظهر تمكّنًا واضحًا لدى التلاميذ من الكفايات المستهدفة في هذه المادة. ويمكن اعتبار هذا الإنجاز نتيجة لتضافر جهود الفريق التربوي، وتوفر ظروف تعلّم داعمة وفعّالة.`;
      } else if (item.passPercentage >= 70) {
        analysis += `تعكس هذه النتائج أداءً جيدًا بوجه عام، حيث إن أغلب التلاميذ تمكّنوا من بلوغ عتبة النجاح. ويُسجّل حضور إيجابي لممارسات تعليمية ناجعة، مع إمكانية تعزيز المكتسبات لدى الفئة المتوسطة عبر دعم موجّه.`;
      } else if (item.passPercentage >= 50) {
        analysis += `تشير هذه النتائج إلى أداء متوسط، يعكس تفاوتًا في التحصيل الدراسي بين التلاميذ. ويتطلب الأمر تفعيل آليات الدعم البيداغوجي المستهدف لفائدة الفئات المتعثرة، والاشتغال على تكييف طرائق التدريس لتقليص الفوارق.`;
      } else if (item.passPercentage >= 30) {
        analysis += `تبرز هذه النتائج أداءً ضعيفًا، حيث إن أقل من نصف التلاميذ تمكنوا من اجتياز المادة. ويستدعي هذا الوضع تدخلاً بيداغوجيًا عاجلاً، من خلال خطط إنقاذ تربوي، وإعادة النظر في استراتيجيات التعلم والتقويم المعتمدة.`;
      } else {
        analysis += `تُعد هذه النتائج مقلقة، إذ تشير إلى تعثر جماعي يستوجب تحليلًا معمقًا للأسباب البنيوية والتربوية، مع وضع مخطط طوارئ بيداغوجي يشمل التكوين، وإعادة التموقع البيداغوجي، وتكثيف الدعم الفردي والجماعي.`;
      }

      return analysis;
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b" dir="rtl">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <NotebookPen className="w-5 h-5" />
              التحليل النوعي لنسب النجاح
            </h3>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 text-justify flex-1">
            {data.map((item) => {
              const analysis = getPassAnalysis(item);
              if (!analysis) return null;

              return (
                <div key={item.subject} className="border-b p-4">
                  <h4 className="font-bold mb-2">{item.subject}</h4>
                  <p className="whitespace-pre-line">{analysis}</p>

                  {item.remark?.trim() && (
                    <p className="mt-4">
                      وتنسجم هذه المعطيات مع الملاحظة المسجلة: {item.remark}، والتي تعزز القراءة الإحصائية لنتائج المادة.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

export default SubjectPassQualitativeAnalysis;