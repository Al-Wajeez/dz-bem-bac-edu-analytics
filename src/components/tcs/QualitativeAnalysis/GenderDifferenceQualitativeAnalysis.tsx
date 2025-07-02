import { NotebookPen, X } from 'lucide-react';
import React from 'react';

type RemarkType = 'success' | 'warning' | 'danger' | 'info' | 'secondary';

interface GenderDifferenceStats {
  subject: string;
  maleMean: number;
  femaleMean: number;
  maleStdDev: number;
  femaleStdDev: number;
  difference: number;
  tTest: number;
  significance: 'significant' | 'not-significant' | 'not-applicable';
  remark: string;
  remarkType: RemarkType;
}

const GenderDifferenceQualitativeAnalysis: React.FC<{differences: GenderDifferenceStats[]; onClose: () => void;}> = ({ differences, onClose }) => {
    const getDifferenceAnalysis = (item: GenderDifferenceStats): JSX.Element | null => {
      const {
        subject,
        maleMean,
        maleStdDev,
        femaleMean,
        femaleStdDev,
        difference,
        tTest,
        significance,
        remark,
      } = item;

      if (
        maleMean === 0 &&
        maleStdDev === 0 &&
        femaleMean === 0 &&
        femaleStdDev === 0
      ) {
        return null; // إخفاء المواد التي لا تحتوي على بيانات
      }

      const introParagraph = (
        <p>
          أظهر التحليل الفارقي بين الذكور والإناث في مادة <strong>{subject}</strong> ما يلي: بلغ متوسط نقاط الذكور{" "}
          <strong>{maleMean.toFixed(2)}</strong>، بانحراف معياري قدره{" "}
          <strong>{maleStdDev.toFixed(2)}</strong>، في حين بلغ متوسط نقاط الإناث{" "}
          <strong>{femaleMean.toFixed(2)}</strong>، بانحراف معياري قدره{" "}
          <strong>{femaleStdDev.toFixed(2)}</strong>. أما الفرق في المتوسطات فقد بلغ{" "}
          <strong>{difference.toFixed(2)}</strong> نقطة، وبلغت قيمة اختبار (ت){" "}
          <strong>{tTest.toFixed(2)}</strong>.
        </p>
      );

      let resultParagraph: JSX.Element;

      if (significance === "significant") {
        const betterGender = maleMean > femaleMean ? "الذكور" : "الإناث";
        resultParagraph = (
          <p>
            تُشير نتائج التحليل إلى وجود <strong>فرق دال إحصائيًا</strong> بين أداء الجنسين في هذه المادة، حيث يظهر تفوق{" "}
            <strong>{betterGender}</strong> بفارق قدره{" "}
            <strong>{Math.abs(difference).toFixed(2)}</strong> نقطة. يُعزز هذا الفارق أهمية مراعاة الفروق الجندرية عند تخطيط التدخلات التربوية، مع تقديم الدعم الملائم للفئة الأقل أداءً لضمان تكافؤ الفرص التعليمية.
          </p>
        );
      } else {
        resultParagraph = (
          <p>
            تُشير البيانات إلى عدم وجود <strong>فرق دال إحصائيًا</strong> بين الذكور والإناث في هذه المادة، مما يدل على تكافؤ في مستوى التحصيل الدراسي بين الجنسين. يُعتبر ذلك مؤشرًا إيجابيًا على فعالية الممارسات التعليمية المحققة للعدالة الجندرية.
          </p>
        );
      }

      const remarkParagraph = remark ? (
        <p className="mt-4">
          وتنسجم هذه المعطيات مع الملاحظة المسجلة: <strong>{remark}</strong>، والتي تعزز القراءة الإحصائية للفروق بين الجنسين.
        </p>
      ) : null;

      return (
        <>
          {introParagraph}
          {resultParagraph}
          {remarkParagraph}
        </>
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b" dir="rtl">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <NotebookPen className="w-5 h-5" />
              التحليل النوعي للفروق بين الجنسين
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 text-justify flex-1" dir="rtl">
            {differences.map((item) => {
              const analysis = getDifferenceAnalysis(item);
              if (!analysis) return null;

              return (
                <div key={item.subject} className="border-b m-4">
                  <h4 className="font-bold mb-4 m-4">{item.subject}</h4>
                  <p className="m-4">{analysis}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

export default GenderDifferenceQualitativeAnalysis;