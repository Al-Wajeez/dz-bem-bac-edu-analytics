import React from 'react';

interface GradeRange {
  count: number;
  percentage: number;
}

interface DetailedGradeDistribution {
  subject: string;
  range0To8: GradeRange;
  range9To9: GradeRange;
  range10To11: GradeRange;
  range12To13: GradeRange;
  range14To15: GradeRange;
  range16To17: GradeRange;
  range18To20: GradeRange;
}

const DetailedGradePrintableAnalysis: React.FC<{ distribution: DetailedGradeDistribution[] }> = ({ distribution }) => {
    // نحسب المتوسطات العامة لكل فئة
    const totals = {
      range0To8: 0,
      range9To9: 0,
      range10To11: 0,
      range12To13: 0,
      range14To15: 0,
      range16To17: 0,
      range18To20: 0,
    };

    const count = distribution.length;

    distribution.forEach(item => {
      totals.range0To8 += item.range0To8.percentage;
      totals.range9To9 += item.range9To9.percentage;
      totals.range10To11 += item.range10To11.percentage;
      totals.range12To13 += item.range12To13.percentage;
      totals.range14To15 += item.range14To15.percentage;
      totals.range16To17 += item.range16To17.percentage;
      totals.range18To20 += item.range18To20.percentage;
    });

    const average = (value: number) => (value / count).toFixed(2);

    return (
      <div id="detailedGradeDistributionAnalysis" className="hidden-printable">
        <h3 className="text-lg font-bold mb-6">التحليل النوعي العام لتوزيع النتائج حسب الفئات</h3>

        <div className="whitespace-pre-line leading-8 space-y-4 text-right">

          <p>
            يُبرز التوزيع العام لنتائج التلاميذ عبر مختلف المواد تفاوتًا ملحوظًا في مستويات التحصيل الدراسي،
            وهو ما يعكس تنوعًا في الفهم والاستيعاب والتمكن من الكفاءات المطلوبة في البرامج الدراسية.
          </p>

          <p>
            تشير البيانات إلى أن نسبة معتبرة من التلاميذ تندرج ضمن الفئات الدنيا. فقد بلغت نسبة التلاميذ
            الذين حصلوا على معدلات بين 0 و 8 حوالي {average(totals.range0To8)} بالمئة، 
            وهي نسبة تستدعي وقفة تحليلية لتحديد أسباب التعثر.
            كما أن نسبة التلاميذ ضمن الفئة [9 - 9.99] قُدّرت بـ {average(totals.range9To9)} بالمئة،
            مما يعكس امتدادًا لحالة التحصيل المحدود.
          </p>

          <p>
            أما الفئات المتوسطة فقد شكلت شريحة معتبرة، حيث وُجد أن حوالي {average(totals.range10To11)} بالمئة 
            من التلاميذ ينتمون للفئة [10 - 11.99]، و {average(totals.range12To13)} بالمئة 
            للفئة [12 - 13.99]. 
            وهذه المعطيات تعكس وجود قاعدة صلبة قابلة للتطوير نحو أداء أفضل إذا ما تم تقديم الدعم المناسب لها.
          </p>

          <p>
            من جهة أخرى، تُظهر الفئات العليا نسبًا متفاوتة، حيث تم تسجيل نسبة {average(totals.range14To15)} بالمئة 
            للفئة [14 - 15.99]، و {average(totals.range16To17)} بالمئة 
            للفئة [16 - 17.99]، بينما بلغت نسبة المتفوقين ضمن الفئة [18 - 20] 
            حوالي {average(totals.range18To20)} بالمئة. 
            وتشير هذه النسب إلى وجود تلاميذ ذوي أداء متميز يجب احتضانهم وتوجيههم نحو التميز المستدام.
          </p>

          <p>
            في ضوء هذه المعطيات، يبدو جليًا أن الأداء الدراسي يتوزع بين الفئات الضعيفة والمتوسطة مع بروز نسبي للفئات العليا. 
            الأمر الذي يستدعي من الفرق التربوية اعتماد مقاربات بيداغوجية متنوعة تراعي الفروقات الفردية،
            مع تكثيف التدخلات لفائدة الفئات المتعثرة، وتحفيز المتفوقين ضمن بيئة تعليمية داعمة وشاملة.
          </p>

        </div>
      </div>
    );
  };

export default DetailedGradePrintableAnalysis;