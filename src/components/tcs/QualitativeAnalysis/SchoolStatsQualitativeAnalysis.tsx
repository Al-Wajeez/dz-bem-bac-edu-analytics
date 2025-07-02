import { NotebookPen, X } from 'lucide-react';
import React from 'react';

type RemarkType = 'success' | 'warning' | 'danger' | 'info' | 'secondary';

const getPerformanceLevel = (mean: number): string => {
  if (mean >= 18) return 'متميز جداً';
  if (mean >= 15) return 'متميز';
  if (mean >= 12) return 'جيد';
  if (mean >= 10) return 'مقبول';
  return 'ضعيف';
};

const getVariationLevel = (stdDev: number | undefined): string => {
  if (!stdDev) return 'غير معروف';
  if (stdDev < 3) return 'منخفض';
  if (stdDev < 5) return 'متوسط';
  return 'مرتفع';
};

interface SchoolStats {
  school: string;
  presentCount: number;
  mean: number;
  stdDev: number;
  remark: string;
  remarkType: RemarkType;
}

const SchoolStatsQualitativeAnalysis: React.FC<{stats: SchoolStats[]; onClose: () => void;}> = ({ stats, onClose }) => {
    const getSchoolAnalysis = (stat: SchoolStats): JSX.Element[] => {
      const performance = getPerformanceLevel(stat.mean);
      const variation = getVariationLevel(stat.stdDev);
      const isHighPerformance = stat.mean >= 10;
      const isLowVariation = stat.stdDev < 3;

      return [
        <p className="mb-4" key="title">
          تحليل أداء <strong>{stat.school}</strong>
        </p>,

        <p className="mb-4" key="level">
          يُصنف مستوى الأداء العام في هذه المؤسسة بـ <strong>{performance}</strong>، حيث بلغ المعدل العام للمتعلمين <strong>{stat.mean.toFixed(2)}</strong>. أما مستوى التشتت فقد تم تحديده بـ <strong>{variation}</strong>، بناءً على انحراف معياري مقداره <strong>{stat.stdDev.toFixed(2)}</strong>.
        </p>,

        isHighPerformance ? (
          <p className="mb-4" key="high-performance">
            تعكس هذه النتائج أداءً جيدًا داخل المؤسسة، مما يدل على فعالية الأنشطة التعليمية والممارسات التربوية المعتمدة. 
            {isLowVariation
              ? " كما أن تجانس النتائج يُبرز اتساق مستويات التحصيل الدراسي بين التلاميذ، وهو مؤشر على نجاعة التدبير البيداغوجي الجماعي."
              : " غير أن تباين النتائج الملحوظ يستوجب دراسة الفروق الفردية وتقييم الممارسات الصفّية من أجل تقليص الفجوات وتحقيق توازن أكبر في التعلمات."}
          </p>
        ) : (
          <p className="mb-4" key="low-performance">
            تشير هذه المؤشرات إلى حاجة ملحة لتحسين مستوى الأداء العام، إذ إن المعدل المسجل (<strong>{stat.mean.toFixed(2)}</strong>) لا يرقى إلى المستوى المأمول. 
            {isLowVariation
              ? " ورغم ذلك، فإن التجانس في النتائج يشير إلى استقرار الأداء ويشكل أرضية مناسبة لبناء خطة دعم جماعية موجهة."
              : " كما أن تباين النتائج يعكس تفاوتًا في مستويات التحصيل، مما يستدعي تدخلات تربوية مخصصة تعتمد على تحليل دقيق للفروق الفردية بين المتعلمين."}
          </p>
        ),

        <p key="conclusion">
          بناءً على ما سبق، يتعين على الفريق التربوي بالمؤسسة تكثيف الجهود من أجل تحسين جودة التعلمات، وذلك عبر تعزيز استراتيجيات الدعم التربوي المستمر، وتطوير كفايات التدريس التفريدي، وتفعيل آليات التتبع والتقويم لتحسين مؤشرات الأداء والارتقاء بالمستوى العام للمتعلمين.
        </p>
      ];
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b" dir="rtl">
            <h3 className="text-lg font-bold flex items-center gap-2">
                <NotebookPen className="w-5 h-5" />
            تحليل نوعي لأداء المؤسسات
                </h3>
                <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 p-1"
                >
                <X className="w-6 h-6" />
                </button>
            </div>
          <div className="space-y-4">
            {stats.map((stat) => (
              <div key={stat.school} className="p-4 border rounded-overflow-y-auto p-6 text-justify flex-1">
                <div className="m-4">
                  {getSchoolAnalysis(stat)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

export default SchoolStatsQualitativeAnalysis;