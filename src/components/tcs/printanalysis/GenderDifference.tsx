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

const GenderDifferencePrintableAnalysis: React.FC<{ differences: GenderDifferenceStats[] }> = ({ differences }) => {
    const getGenderDifferenceSummary = (): JSX.Element => {
      const significantFemaleAdvantage: string[] = [];
      const significantMaleAdvantage: string[] = [];
      const noSignificantDifference: string[] = [];

      differences.forEach(({ subject, difference, significance, remark }) => {
        if (significance === 'significant') {
          if (difference > 0) {
            significantFemaleAdvantage.push(`${subject} (تفوق الإناث بفارق ${difference.toFixed(2)} نقطة)`);
          } else {
            significantMaleAdvantage.push(`${subject} (تفوق الذكور بفارق ${(Math.abs(difference)).toFixed(2)} نقطة)`);
          }
        } else {
          noSignificantDifference.push(subject);
        }
      });

      return (
        <div className="whitespace-pre-line leading-8">
          <p>
            يُظهر التحليل الفارقي بين الجنسين في المواد التعليمية وجود تباينات في متوسطات الأداء، مما يعكس تأثيرًا محتملاً للبعد الجندري على التحصيل الدراسي.
          </p>

          {significantFemaleAdvantage.length > 0 && (
            <p>
              أظهرت المواد التالية: {significantFemaleAdvantage.join("، ")} فروقًا دالة إحصائيًا لصالح الإناث. ويُعزز هذا التفوق أهمية تكييف الخطط التعليمية لدعم الفئات الأقل أداءً، مع مراعاة الجوانب الجندرية في التخطيط البيداغوجي.
            </p>
          )}

          {significantMaleAdvantage.length > 0 && (
            <p>
              أما المواد التالية: {significantMaleAdvantage.join("، ")} فقد سجلت فروقًا دالة إحصائيًا لصالح الذكور، مما يستدعي تقديم دعم تربوي إضافي للإناث في هذه المواد لضمان العدالة الجندرية في فرص التعلم.
            </p>
          )}

          {noSignificantDifference.length > 0 && (
            <p>
              من جهة أخرى، لم تُسجل فروق دالة إحصائيًا بين الذكور والإناث في مواد مثل: {noSignificantDifference.join("، ")}. ويُعد هذا مؤشرًا إيجابيًا على تحقيق التوازن الجندري في التحصيل الدراسي بها.
            </p>
          )}

          <p>
            بناءً على هذه المعطيات، يُوصى باعتماد تدخلات تربوية مدروسة تستند إلى نتائج التحليل الفارقي لضمان بيئة تعليمية عادلة تراعي الفروق الفردية والجندرية، وتُعزز تكافؤ الفرص لجميع التلاميذ.
          </p>
        </div>
      );
    };

    return (
      <div id="genderStatsAnalysis" className="hidden-printable">
        <h3 className="text-lg font-bold mb-4">التحليل النوعي للفروق بين الجنسين حسب المواد</h3>
        {getGenderDifferenceSummary()}
      </div>
    );
  };

export default GenderDifferencePrintableAnalysis;