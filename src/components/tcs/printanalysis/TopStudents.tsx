import React from "react";

interface TopStudent {
  name: string;
  department: string;
  certificateGrade: number;
  annualGrade: number;
  transitionGrade: number;
}

const TopStudentsPrintableAnalysis: React.FC<{ students: TopStudent[] }> = ({ students }) => {
  if (students.length === 0) {
    return <p className="hidden-printable">لا توجد معطيات متوفرة حاليًا لتحليل التلاميذ المتفوقين.</p>;
  }

  const total = students.length;

  const departmentCounts = students.reduce((acc, student) => {
    acc[student.department] = (acc[student.department] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const avgCertificateGrade = avg(students.map(s => s.certificateGrade));
  const avgAnnualGrade = avg(students.map(s => s.annualGrade));
  const avgTransitionGrade = avg(students.map(s => s.transitionGrade));

  // الفقرة التحليلية لتوزيع الأقسام
  const departmentDistribution = Object.entries(departmentCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([dep, count]) => `${dep} (${count} تلميذ، ${(count / total * 100).toFixed(1)}%)`)
    .join('، ');

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

  let recommendation = "";
  if (avgCertificateGrade >= 16) {
    recommendation = "ينبغي الاستثمار في نجاح هؤلاء التلاميذ عبر إتاحة فرص تربوية متقدمة تتناسب مع انتقالهم إلى مستوى أعلى، كتفعيل نوادي البحث العلمي أو المسابقات الفكرية.";
  } else if (avgCertificateGrade >= 14) {
    recommendation = "يُنصح بتقديم تحديات معرفية إضافية لهؤلاء التلاميذ عبر ورشات إبداعية ومسابقات تعليمية تُحفّز التفكير النقدي والإنتاج الشخصي.";
  } else {
    recommendation = "رغم تميز هؤلاء التلاميذ، فإن المرحلة القادمة تتطلب مواكبة تربوية مركزة تهدف إلى تعميق الكفايات وتعزيز الاستقلالية في التعلم.";
  }

  return (
    <div id="topStudentsAnalysis" className="hidden-printable space-y-6 text-right leading-relaxed">
      <h3 className="text-lg font-bold mb-4">التحليل النوعي للتلاميذ المتفوقين</h3>

      <div>
        <p>
          تُبيّن المعطيات أن التلاميذ المتفوقين موزّعون على الأقسام كما يلي: {departmentDistribution}. 
          هذا التوزيع قد يعكس فاعلية معينة في بعض الأقسام، ويستحق التوقف عند ممارساتها التربوية الناجعة.
        </p>
      </div>

      <div>
        <p>
          يعكس أداء التلاميذ المتميزين مستوىً تربويًا مشرفًا. {interpretation} 
          وتشير النتائج إلى أن معدل الشهادة هو {avgCertificateGrade.toFixed(2)}، 
          والمعدل السنوي {avgAnnualGrade.toFixed(2)}، 
          ومعدل الانتقال {avgTransitionGrade.toFixed(2)}.
        </p>
      </div>

      <div>
        <p>{recommendation}</p>
      </div>
    </div>
  );
};


export default TopStudentsPrintableAnalysis;
