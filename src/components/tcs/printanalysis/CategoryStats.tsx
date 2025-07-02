import React from 'react';

interface GradeRange {
  count: number;
  percentage: number;
}

interface CategoryStats {
  subject: string;
  weakCategory: GradeRange;
  nearAverageCategory: GradeRange;
  averageCategory: GradeRange;
  goodCategory: GradeRange;
  excellentCategory: GradeRange;
}

const CategoryDistributionPrintableAnalysis: React.FC<{ stats: CategoryStats[] }> = ({ stats }) => {
  const validStats = stats.filter(stat =>
  stat.weakCategory.percentage +
  stat.nearAverageCategory.percentage +
  stat.averageCategory.percentage +
  stat.goodCategory.percentage +
  stat.excellentCategory.percentage > 0
);
  const subjectCount = validStats.length;
  if (subjectCount === 0) return null;

  const totalStats = validStats.reduce(
    (acc, item) => {
      acc.weak += item.weakCategory.percentage;
      acc.nearAvg += item.nearAverageCategory.percentage;
      acc.avg += item.averageCategory.percentage;
      acc.good += item.goodCategory.percentage;
      acc.excellent += item.excellentCategory.percentage;
      return acc;
    },
    { weak: 0, nearAvg: 0, avg: 0, good: 0, excellent: 0 }
  );

  const avgWeak = totalStats.weak / subjectCount;
  const avgNearAvg = totalStats.nearAvg / subjectCount;
  const avgAvg = totalStats.avg / subjectCount;
  const avgGood = totalStats.good / subjectCount;
  const avgExcellent = totalStats.excellent / subjectCount;

  const categories = [
    { label: 'الضعيفة', value: avgWeak },
    { label: 'القريبة من المتوسط', value: avgNearAvg },
    { label: 'المتوسطة', value: avgAvg },
    { label: 'الحسنة', value: avgGood },
    { label: 'الجيدة جداً', value: avgExcellent },
  ];

  const dominant = categories.reduce((prev, curr) => (curr.value > prev.value ? curr : prev));

  // تحليلات نوعية بناءً على الفئة المهيمنة
  let interpretation = "";
  if (dominant.label === 'الضعيفة') {
    interpretation = `
تشير البيانات إلى أن النسبة الأعلى من التلاميذ يتموقعون ضمن الفئة الضعيفة (≈ ${avgWeak.toFixed(2)} بالمئة)، 
وهو مؤشر دالّ على وجود صعوبات تعلمية وبيداغوجية كبيرة تتطلب تدخلاً تربويًا عاجلاً.
يعكس هذا الوضع اختلالًا واضحًا في مستوى التحصيل العام داخل عدد من المواد، وقد يرجع ذلك إلى غياب الدعم المنتظم أو عدم ملاءمة المقاربات التعليمية المعتمدة.`;
  } else if (dominant.label === 'القريبة من المتوسط') {
    interpretation = `
تفيد المعطيات بأن حوالي ${avgNearAvg.toFixed(2)} بالمئة من التلاميذ ينتمون إلى الفئة القريبة من المتوسط، 
مما يدل على أن فئة واسعة من التلاميذ بحاجة إلى تعزيز المكتسبات وتثبيت المعارف الأساسية.
يوحي هذا النمط بوجود إمكانيات واعدة قابلة للتطوير إذا ما تم توفير دعم موجه واستراتيجيات تدريس مرنة تواكب خصوصيات المتعلمين.`;
  } else if (dominant.label === 'المتوسطة') {
    interpretation = `
تتمركز النسبة الأعلى من التلاميذ ضمن الفئة المتوسطة (≈ ${avgAvg.toFixed(2)} بالمئة)، 
وهو ما يعكس درجة من الاستيعاب المقبول للمحتويات الدراسية، 
غير أنها لا ترقى إلى مستوى التميز مما يستوجب مزيدًا من التحفيز التربوي والتقويم التكويني المستمر لضمان التقدم.`;
  } else if (dominant.label === 'الحسنة') {
    interpretation = `
تشير النسب إلى أن أغلب التلاميذ يصنّفون ضمن الفئة الحسنة (≈ ${avgGood.toFixed(2)} بالمئة)، 
وهو مؤشر إيجابي يعكس تمكنًا جيدًا من الكفايات المستهدفة، 
كما يدل على فعالية التدريس المعتمد وجودة البيئة الصفية.`;
  } else if (dominant.label === 'الجيدة جداً') {
    interpretation = `
تُظهر البيانات أن النسبة الأهم من التلاميذ تنتمي إلى الفئة الجيدة جداً (≈ ${avgExcellent.toFixed(2)} بالمئة)، 
مما يعكس تفوقًا ملحوظًا ومردودية تعليمية عالية داخل المؤسسة.
هذا المستوى يبرز قدرة المتعلمين على التفاعل الإيجابي مع المواقف التعليمية وتحقيق أداء متميز يتجاوز التوقعات.`;
  }

  return (
    <div className="hidden-printable" id="categoryStatsAnalysis">
      <h3 className="text-lg font-bold mb-6">التحليل النوعي العام لتوزيع التلاميذ حسب الفئات</h3>

      <div className="whitespace-pre-line leading-8 text-right space-y-4">
        <p>
          تُظهر نتائج التحليل متوسطات نسب التلاميذ في مختلف الفئات كما يلي:
        </p>

        <p>
          أظهرت النتائج أن نسبة التلاميذ الذين ينتمون إلى الفئة الضعيفة بلغت حوالي {avgWeak.toFixed(2)} بالمئة، 
          بينما تمركزت نسبة {avgNearAvg.toFixed(2)} بالمئة في الفئة القريبة من المتوسط. 
          أما الفئة المتوسطة فقد ضمّت حوالي {avgAvg.toFixed(2)} بالمئة من التلاميذ، 
          في حين وصلت نسبة التلاميذ في الفئة الحسنة إلى {avgGood.toFixed(2)} بالمئة. 
          وبلغت نسبة التلاميذ في الفئة الجيدة جداً ما يقارب {avgExcellent.toFixed(2)} بالمئة.
        </p>

        <p>{interpretation}</p>

        <p>
          بناءً على هذه المؤشرات، يُوصى الفريق التربوي بتطوير خطط الدعم والتقويم التكويني، واعتماد مقاربات تفريدية تعزز الإنصاف البيداغوجي، مع ضرورة تنظيم ورشات تربوية لتبادل الخبرات وتوحيد الرؤى البيداغوجية بين المدرسين.
        </p>
      </div>
    </div>
  );
};


export default CategoryDistributionPrintableAnalysis;