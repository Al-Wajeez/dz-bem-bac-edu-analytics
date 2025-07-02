import React from "react";

interface TopStudent {
  name: string;
  department: string;
  certificateGrade: number;
  annualGrade: number;
  transitionGrade: number;
}

const FailingStudentsPrintableAnalysis: React.FC<{ students: TopStudent[] }> = ({ students }) => {
  if (students.length === 0) {
    return <p className="hidden-printable">لا توجد معطيات متوفرة حاليًا لتحليل التلاميذ المتعثرين.</p>;
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

  // تحليل توزيع الأقسام كسرد
  const departmentDistribution = Object.entries(departmentCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([dep, count]) => `${dep} (${count} تلميذ، ${(count / total * 100).toFixed(1)}%)`)
    .join('، ');

  let interpret = "";
  if (avgCertificateGrade < 5) {
    interpret = "مستوى تعثر شديد يعكس تدنيًا كبيرًا في الكفايات الأساسية.";
  } else if (avgCertificateGrade < 8) {
    interpret = "مستوى تعثر متوسط يحتاج إلى متابعة منتظمة وإعادة تركيز على المهارات الأساسية.";
  } else if (avgCertificateGrade < 10) {
    interpret = "تعثر طفيف يمكن تجاوزه من خلال دعم بيداغوجي قصير المدى.";
  } else {
    interpret = "مؤشرات غير مقلقة لكنها تستدعي اهتمامًا وقائيًا.";
  }

  let recommendation = "";
  if (avgCertificateGrade < 5 && avgAnnualGrade < 5 && avgTransitionGrade < 5) {
    recommendation = "تشير المؤشرات إلى وضعية حرجة تستوجب تدخلاً عاجلاً وخطة علاجية مركزة تشمل الجوانب المعرفية والدافعية والنفسية.";
  } else if (avgTransitionGrade < 8) {
    recommendation = "ينبغي وضع خطة دعم متوسطة المدى لتجاوز الصعوبات الدراسية تدريجيًا مع إشراك الولي والمدرس في العملية.";
  } else {
    recommendation = "الوضعية تظهر صعوبات متفاوتة تستوجب مواكبة تربوية منتظمة وتعزيز الثقة الذاتية وتنمية المهارات الأساسية.";
  }

  return (
    <div id="lowestFailingStudentsAnalysis" className="hidden-printable space-y-6 text-right leading-relaxed">
      <h3 className="text-lg font-bold mb-4">التحليل النوعي للتلاميذ المتعثرين</h3>

      <div>
        <p>
          تُظهر المعطيات أن التلاميذ المتعثرين يتوزعون عبر الأقسام كما يلي: {departmentDistribution}. هذا التوزيع قد يشير إلى وجود أقسام تحتاج إلى تدخل تربوي مكثف أو إعادة النظر في الممارسات الصفية والدعم البيداغوجي المعتمد.
        </p>
      </div>

      <div>
        <p>
          بلغ معدل الشهادة {avgCertificateGrade.toFixed(2)}، والمعدل السنوي {avgAnnualGrade.toFixed(2)}، بينما بلغ معدل الانتقال {avgTransitionGrade.toFixed(2)}. وتشير هذه المؤشرات إلى {interpret}
        </p>
      </div>

      <div>
        <p>{recommendation}</p>
      </div>

      <div>
        <p>
          يُنصح بتفعيل آليات الدعم المدرسي المنتظم، واستغلال الحصص المخصصة للمراجعة والتقوية، مع متابعة نفسية واجتماعية دقيقة تراعي الجوانب الشخصية والدافعية، وتشجيع تدخلات متعدّدة الاختصاصات لتعزيز فرص النجاح لهؤلاء التلاميذ.
        </p>
      </div>
    </div>
  );
};


export default FailingStudentsPrintableAnalysis;