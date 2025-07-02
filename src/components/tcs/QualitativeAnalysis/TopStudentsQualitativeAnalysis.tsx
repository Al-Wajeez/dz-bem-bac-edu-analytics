import { NotebookPen, X } from 'lucide-react';
import React from 'react';

interface TopStudent {
  name: string;
  department: string;
  certificateGrade: number;
  annualGrade: number;
  transitionGrade: number;
}

const TopStudentsQualitativeAnalysis: React.FC<{students: TopStudent[]; onClose: () => void;}> = ({ students, onClose }) => {
  const getTopStudentsAnalysis = (students: TopStudent[]) => {
  if (students.length === 0) {
    return <p>لا توجد معطيات متوفرة حاليًا لتحليل التلاميذ المتميزين.</p>;
  }

  const total = students.length;

  // توزيع حسب الأقسام
  const departmentCounts = students.reduce((acc, student) => {
    acc[student.department] = (acc[student.department] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // المعدلات
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const avgCertificateGrade = avg(students.map(s => s.certificateGrade));
  const avgAnnualGrade = avg(students.map(s => s.annualGrade));
  const avgTransitionGrade = avg(students.map(s => s.transitionGrade));

  // التوصيف العام
  let interpretation = "";
  if (avgTransitionGrade >= 18) {
    interpretation = "مستوى تفوق استثنائي يدل على نضج معرفي وقدرات عالية في جميع المحطات التقييمية.";
  } else if (avgTransitionGrade >= 16) {
    interpretation = "أداء متميز ومتزن يعكس تحصيلًا علميًا قويًا واستيعابًا متقدمًا للمهارات والكفاءات.";
  } else if (avgTransitionGrade >= 14) {
    interpretation = "مستوى جيد جداً يبرز قدرات معرفية واعدة تحتاج إلى تحفيز مستمر للحفاظ على نسق التميز.";
  } else {
    interpretation = "أداء جيد يتطلب مواكبة خاصة لترسيخ المكتسبات وتحفيز روح التميز.";
  }

  // التوصية
  let recommendation = "";

  if (avgCertificateGrade >= 16) {
    recommendation =
      "ينبغي الاستثمار في نجاح هؤلاء التلاميذ عبر إتاحة فرص تربوية متقدمة تتناسب مع انتقالهم إلى مستوى أعلى، وذلك من خلال توفير توجيه تربوي مستمر لمرافقتهم في مسار التميز، وتشجيعهم على الانخراط في أندية علمية أو تخصصات واعدة تفتح أمامهم آفاقًا جديدة، مما يسهم في ترسيخ ثقتهم بأنفسهم وتحفيزهم على تحقيق إنجازات أكاديمية أرقى.";
  } else if (avgCertificateGrade >= 14) {
    recommendation =
      "يُنصح بتقديم تحديات معرفية إضافية لهؤلاء التلاميذ عبر ورشات إبداعية ومسابقات تعليمية تُنمّي التفكير النقدي والابتكار، مع توفير تأطير تربوي يواكب انتقالهم ويوجّه طاقاتهم نحو مجالات علمية وتنموية محفّزة.";
  } else {
    recommendation =
      "رغم تميز هؤلاء التلاميذ، فإن المرحلة القادمة تتطلب مواكبة تربوية مركزة تهدف إلى تعميق الكفايات وتثبيت مكتسباتهم، مع تعزيز روح المبادرة والتفوق المستدام من خلال مسارات دعم فردية وفرص تعلم مُوجهة ترتقي بأدائهم في المستويات التعليمية المقبلة.";
  }

  return (
    <div className="space-y-4 leading-relaxed text-justify">
      <div>
        <h4 className="font-bold mb-1">1. توزيع التلاميذ المتميزين حسب الأقسام:</h4>
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
        <h4 className="font-bold mb-1">2. قراءة تربوية لأداء المتفوقين:</h4>
        <p>
          يعكس أداء التلاميذ المتميزين مستوىً تربويًا مشرفًا يتجلى في توازن النتائج بين مختلف المحطات التقييمية،
          كما يُبرز {interpretation}، مما يدل على بيئة تعليمية مشجعة ومجهودات فردية واعية نحو النجاح،
            حيث توضح المعطيات أن معدل الشهادة بلغ <strong>{avgCertificateGrade.toFixed(2)}</strong> من 20، 
            والمعدل السنوي <strong>{avgAnnualGrade.toFixed(2)}</strong> من 20، 
            في حين بلغ معدل الانتقال <strong>{avgTransitionGrade.toFixed(2)}</strong> من 20. 
          </p>
      </div>

      <div>
        <h4 className="font-bold mb-1">توصية:</h4>
        <p>{recommendation}</p>
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
                تحليل نوعي للتلاميذ المتفوقين
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
            {getTopStudentsAnalysis(students)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopStudentsQualitativeAnalysis;