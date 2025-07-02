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

interface DirectoratePerformanceStats {
  directorate: string;
  presentCount: number;
  mean: number;
  stdDev: number;
  remark: string;
  remarkType: RemarkType;
}

const DirectoratePerformanceStatsQualitativeAnalysis: React.FC<{stats: DirectoratePerformanceStats[]; onClose: () => void;}> = ({ stats, onClose }) => {
    const getDirectorateAnalysis = (stat: DirectoratePerformanceStats): JSX.Element[] => {
      const performance = getPerformanceLevel(stat.mean);
      const variation = getVariationLevel(stat.stdDev);
      const isHighPerformance = stat.mean >= 10;
      const isLowVariation = stat.stdDev < 3;

      return [
        <p className="mb-4" key="title">
          تحليل أداء <strong>{stat.directorate}</strong>
        </p>,

        <p className="mb-4" key="level">
          يُصنف مستوى الأداء العام في هذه المديرية بـ <strong>{performance}</strong>، حيث بلغ المعدل الحسابي للنتائج <strong>{stat.mean.toFixed(2)}</strong>. أما مستوى التشتت، فقد وُصف بـ <strong>{variation}</strong>، اعتمادًا على قيمة الانحراف المعياري المقدرة بـ <strong>{stat.stdDev.toFixed(2)}</strong>.
        </p>,

        isHighPerformance ? (
          <p className="mb-4" key="good-performance">
            يُظهر هذا المعدل مؤشرات إيجابية على فعالية الممارسات التربوية في المديرية، بما يعكس مجهودات الفرق التربوية والإدارية. 
            {isLowVariation
              ? " ويُعزز هذا الأداء تجانس في مستويات التلاميذ، مما يدل على تقارب في نجاعة التدريس وتكافؤ في فرص التعلم."
              : " غير أن ارتفاع التشتت يشير إلى وجود تباينات في التحصيل الدراسي، مما يستدعي تقويمًا داخليًا لمصادر الفروقات بين المؤسسات التعليمية."}
          </p>
        ) : (
          <p className="mb-4" key="low-performance">
            يُعَد هذا المؤشر دالًا على ضرورة التدخل لتحسين الأداء العام، خصوصًا أن المعدل المحقق (<strong>{stat.mean.toFixed(2)}</strong>) لا يرقى إلى المستوى المطلوب. 
            {isLowVariation
              ? " ورغم ذلك، فإن التجانس في النتائج يعكس استقرارًا نسبيًا في الأداء، ما يتيح إمكانيات للتطوير الجماعي."
              : " كما أن التباين المرتفع يفرض ضرورة تتبع الفروق الفردية والمؤسساتية، وبناء تدخلات بيداغوجية موجهة ومتكاملة."}
          </p>
        ),

        <p key="conclusion">
          في ضوء هذه المعطيات، تبرز الحاجة إلى مواصلة الجهود الرامية إلى دعم التميز التربوي داخل المديرية، عبر تعزيز آليات التقويم التكويني، وتفعيل خطط الدعم التربوي والتتبع الفردي، بما يضمن تحسين جودة التعلمات وتضييق الفجوات بين المؤسسات التعليمية.
        </p>
      ];
    }; 
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b" dir="rtl">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <NotebookPen className="w-5 h-5" />
               تحليل نوعي لأداء المديريات
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
              <div key={stat.directorate} className="p-4 border rounded-overflow-y-auto p-6 text-justify flex-1">
                <p className="m-4">
                  {getDirectorateAnalysis(stat)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

export default DirectoratePerformanceStatsQualitativeAnalysis;