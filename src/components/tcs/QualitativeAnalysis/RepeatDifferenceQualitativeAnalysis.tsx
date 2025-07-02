import { NotebookPen, X } from 'lucide-react';
import React from 'react';

type RemarkType = 'success' | 'warning' | 'danger' | 'info' | 'secondary';

interface RepeatDifferenceStats {
  subject: string;
  repeatMean: number;
  nonRepeatMean: number;
  repeatStdDev: number;
  nonRepeatStdDev: number;
  difference: number;
  tTest: number;
  significance: 'significant' | 'not-significant' | 'not-applicable';
  remark: string;
  remarkType: RemarkType;
}

const RepeatDifferenceQualitativeAnalysis: React.FC<{differences: RepeatDifferenceStats[]; onClose: () => void;}> = ({ differences, onClose }) => {
    const getDifferenceAnalysis = (item: RepeatDifferenceStats): JSX.Element | null => {
      const {
        //subject,
        repeatMean,
        repeatStdDev,
        nonRepeatMean,
        nonRepeatStdDev,
        difference,
        tTest,
        significance,
      } = item;

      if (
        repeatMean === 0 &&
        repeatStdDev === 0 &&
        nonRepeatMean === 0 &&
        nonRepeatStdDev === 0
      ) {
        return null; // إخفاء المواد التي لا تحتوي على بيانات
      }

      const introParagraph = (
        <p className="mb-4">
          أظهرت نتائج التحليل الفارقي بين التلاميذ المعيدين وغير المعيدين ما يلي:
           بلغ متوسط نقاط التلاميذ المعيدين{" "}
          <strong>{repeatMean.toFixed(2)}</strong>، بانحراف معياري قدره{" "}
          <strong>{repeatStdDev.toFixed(2)}</strong>، في حين بلغ متوسط نقاط التلاميذ غير المعيدين{" "}
          <strong>{nonRepeatMean.toFixed(2)}</strong>، بانحراف معياري قدره{" "}
          <strong>{nonRepeatStdDev.toFixed(2)}</strong>. أما الفرق في المتوسطات بين المجموعتين فقد بلغ{" "}
          <strong>{difference.toFixed(2)}</strong> نقطة، وبلغت قيمة اختبار T الإحصائي{" "}
          <strong>{tTest.toFixed(2)}</strong>.
        </p>
      );

      let resultParagraph: JSX.Element;

      if (significance === "significant") {
        const betterGroup = repeatMean > nonRepeatMean ? "المعيدين" : "غير المعيدين";
        resultParagraph = (
          <p className="mb-4">
            تشير نتائج التحليل إلى وجود <strong>فرق دال إحصائيًا</strong> بين أداء التلاميذ المعيدين وغير المعيدين، حيث يظهر تفوق فئة{" "}
            <strong>{betterGroup}</strong> بفارق قدره{" "}
            <strong>{Math.abs(difference).toFixed(2)}</strong> نقطة. يعكس هذا الفارق تأثيرًا ملحوظًا قد يرتبط بعوامل تربوية مثل إعادة السنة أو التكيف مع المادة، مما يستدعي مزيدًا من الدراسة والتأمل في دعم الفئة الأقل أداءً، وتعزيز الممارسات البيداغوجية الملائمة.
          </p>
        );
      } else {
        resultParagraph = (
          <p>
            تُشير المعطيات إلى عدم وجود <strong>فرق دال إحصائيًا</strong> بين أداء المعيدين وغير المعيدين، ما يعني أن إعادة السنة لم تؤدِّ إلى تحسن ملحوظ في مستوى التحصيل الدراسي في هذه المادة. يُوصى بتوجيه الجهود التربوية نحو عناصر أخرى مؤثرة كطرائق التدريس والدعم الفردي ومرافقة التلاميذ حسب حاجاتهم.
          </p>
        );
      }

      return (
        <>
          {introParagraph}
          {resultParagraph}
        </>
      );
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b" dir="rtl">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <NotebookPen className="w-5 h-5" />
              التحليل النوعي للفروق بين المكررين وغير المكررين
            </h3>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 text-justify flex-1">
            {differences.map((item) => {
              const analysis = getDifferenceAnalysis(item);
              if (!analysis) return null;

              return (
                <div key={item.subject} className="border-b m-4">
                  <h4 className="font-bold mb-4 m-4">{item.subject}</h4>
                  <p className="m-4">{analysis}</p>
                  <p className="m-4">
                  {item.remark && `وتنسجم هذه المعطيات مع الملاحظة المسجلة: ${item.remark}، والتي تعزز القراءة الإحصائية للفروق بين المجموعتين.`}
                </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };


export default RepeatDifferenceQualitativeAnalysis;