import { NotebookPen, X } from 'lucide-react';
import React from 'react';

interface TopStudent {
  name: string;
  department: string;
  certificateGrade: number;
  annualGrade: number;
  transitionGrade: number;
}

const LowestFailingStudentsQualitativeAnalysis: React.FC<{students: TopStudent[]; onClose: () => void;}> = ({ students, onClose }) => {
  const getFailingStudentsAnalysis = (students: TopStudent[]) => {
    if (students.length === 0) {
      return (
        <p>لا توجد معطيات متوفرة حاليًا لتحليل التلاميذ المتعثرين.</p>
      );
    }

    const total = students.length;

    // 1. توزيع حسب الأقسام
    const departmentCounts = students.reduce((acc, student) => {
      acc[student.department] = (acc[student.department] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const avgCertificateGrade = avg(students.map(s => s.certificateGrade));
    const avgAnnualGrade = avg(students.map(s => s.annualGrade));
    const avgTransitionGrade = avg(students.map(s => s.transitionGrade));

    let interpret = "";
      if (avgCertificateGrade < 5) {
        interpret = `مستوى تعثر شديد)`;
      } else if (avgCertificateGrade < 8) {
        interpret = `مستوى تعثر متوسط`;
      } else if (avgCertificateGrade < 10) {
        interpret = `تعثر طفيف)`;
      } else {
      interpret = `دون تعثر ملحوظ)`;
    };

    let recommendation = "";
    if (avgCertificateGrade < 5 && avgAnnualGrade < 5 && avgTransitionGrade < 5) {
      recommendation = "تشير المؤشرات إلى وضعية حرجة تستوجب تدخلاً عاجلاً ودقيقًا يشمل دعمًا فرديًا وخطة علاجية مركزة.";
    } else if (avgTransitionGrade < 8) {
      recommendation = "ينبغي وضع خطة دعم متوسطة المدى تستهدف تعزيز مكتسبات التلاميذ وتجاوز صعوباتهم الدراسية تدريجيًا.";
    } else {
      recommendation = "الوضعية العامة تظهر صعوبات متفاوتة تستوجب مواكبة تربوية منتظمة وتعزيز الثقة الذاتية لدى المتعثرين.";
    }

    return (
      <div className="space-y-4 leading-relaxed text-justify">
        <div>
          <h4 className="font-bold mb-1">1. توزيع التلاميذ المتعثرين حسب الأقسام:</h4>
          <ul className="list-disc pr-5">
            {Object.entries(departmentCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([dep, count]) => (
              <li key={dep}>
                {dep}: {count} تلميذ ({((count / total) * 100).toFixed(1)}%)
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-1">2. المتوسطات العامة للمتعثرين:</h4>
          <p>
            توضح المعطيات أن معدل الشهادة بلغ <strong>{avgCertificateGrade.toFixed(2)}</strong> من 20، 
            والمعدل السنوي <strong>{avgAnnualGrade.toFixed(2)}</strong> من 20، 
            في حين بلغ معدل الانتقال <strong>{avgTransitionGrade.toFixed(2)}</strong> من 20. 
            وتشير هذه الأرقام إلى وجود {interpret} يتطلب تدخلاً تربويًا هادفًا لدعم التلاميذ المتعثرين.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-1">خلاصة تربوية:</h4>
          <p>{recommendation}</p>
        </div>

        <div>
          <h4 className="font-bold mb-2"> توصية:</h4>
          <p>
            يُنصح بتفعيل آليات الدعم المدرسي، واستغلال الحصص المخصصة للمراجعة والتقوية،
            مع متابعة نفسية واجتماعية مستمرة لضمان تحسن الأداء وتجاوز الصعوبات.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b" dir="rtl">
            <h3 className="text-lg font-bold flex items-center gap-2">
                <NotebookPen className="w-5 h-5" />
                تحليل نوعي للتلاميذ المتعثرين
            </h3>
            <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 p-1"
            >
                <X className="w-6 h-6" />
            </button>
        </div>
        <div className="overflow-y-auto p-6 text-justify flex-1">
          <p className="m-4">
            {getFailingStudentsAnalysis(students)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LowestFailingStudentsQualitativeAnalysis;