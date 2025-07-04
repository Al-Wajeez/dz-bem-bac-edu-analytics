import { NotebookPen, X } from 'lucide-react';
import React from 'react';

type RemarkType = 'success' | 'warning' | 'danger' | 'info' | 'secondary';


interface HarmonyStats {
  subject: string;
  harmonyRatio: number;
  remark: string;
  remarkType: RemarkType;
}

const HarmonyStatsQualitativeAnalysis: React.FC<{stats: HarmonyStats[]; onClose: () => void;}> = ({ stats, onClose }) => {
const getHarmonyAnalysis = (item: HarmonyStats): JSX.Element[] | null => {
    const { subject, harmonyRatio } = item;

    // إذا لم تتوفر بيانات حقيقية، لا يتم عرض المادة
    if (!harmonyRatio || harmonyRatio === 0) return null;

    let interpretation: string;

    if (harmonyRatio <= 15) {
    interpretation = `تعكس نسبة الإنسجام (${harmonyRatio.toFixed(2)}%) في مادة ${subject} انسجامًا تامًا في أداء التلاميذ، مما يدل على تقارب كبير في نتائجهم واستيعاب مشترك للمحتوى التعليمي.`;
    } else if (harmonyRatio <= 30 && harmonyRatio > 15) {
    interpretation = `تشير نسبة الإنسجام (${harmonyRatio.toFixed(2)}%) في مادة ${subject} إلى وجود انسجام نسبي بين التلاميذ، مع تباين محدود في النتائج يستوجب رصد الفروقات وتثمين نقاط القوة.`;
    } else if (harmonyRatio > 30 && harmonyRatio > 15) {
    interpretation = `تبرز نسبة الإنسجام (${harmonyRatio.toFixed(2)}%) في مادة ${subject} تشتتًا واضحًا في نتائج التلاميذ، مما يستدعي تحليل الأسباب واقتراح تدخلات تربوية لتقليص الفجوة.`;
    } else {
    interpretation = `لا يمكن إصدار حكم دقيق حول الإنسجام في مادة ${subject} لعدم توفر معطيات كافية أو بسبب انخفاض عدد التلاميذ المشاركين في التحليل.`;
    }

    const recommendation =
    `بناءً على هذه المعطيات، يُوصى باتخاذ تدابير بيداغوجية تتلاءم مع الفروق الفردية، وتفعيل الدعم التربوي الموجّه، مع تعزيز التنسيق بين الأساتذة من أجل توحيد الإيقاع البيداغوجي وتحسين مستويات الإنسجام في مادة ${subject}.`;

    return [
    <p className="m-4" key="title">
        <strong>{subject}</strong>:
    </p>,
    <p className="m-4" key="interpretation">{interpretation}</p>,
    <p className="m-4" key="recommendation">{recommendation}</p>
    ];
};


return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b" dir="rtl">
        <h3 className="text-lg font-bold flex items-center gap-2">
            <NotebookPen className="w-5 h-5" />
            التحليل النوعي لنسب الإنسجام
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
            const analysis = getHarmonyAnalysis(item);
            return analysis ? (
            <div key={item.subject} className="border-b m-4">
                {analysis}
            </div>
            ) : null;
        })}
        </div>
    </div>
    </div>
);
};

export default HarmonyStatsQualitativeAnalysis;