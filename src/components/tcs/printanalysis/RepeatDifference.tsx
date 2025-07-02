import React from 'react';

type RemarkType = 'success' | 'warning' | 'danger' | 'info' | 'secondary';

interface RepeatDifferenceStats {
  subject: string;
  repeatMean: number;
  nonRepeatMean: number;
  repeatStdDev: number;
  nonRepeatStdDev: number;
  difference: number;
  tTest: number;
  significance: 'significant' | 'not-significant' | 'not-applicable';
  remark: string;
  remarkType: RemarkType;
}

const RepeatDifferencePrintableAnalysis: React.FC<{ differences: RepeatDifferenceStats[] }> = ({ differences }) => {
    const getRepeatDifferenceSummary = (): JSX.Element => {
      const significantNonRepeaters: string[] = [];
      const significantRepeaters: string[] = [];
      const noSignificantDifference: string[] = [];

      differences.forEach(({ subject, difference, significance }) => {
        if (significance === 'significant') {
          if (difference > 0) {
            // Non-repeaters performed better
            significantNonRepeaters.push(`${subject} (تفوق غير المعيدين بفارق ${difference.toFixed(2)} نقطة)`);
          } else {
            // Repeaters performed better
            significantRepeaters.push(`${subject} (تفوق المعيدين بفارق ${Math.abs(difference).toFixed(2)} نقطة)`);
          }
        } else {
          noSignificantDifference.push(subject);
        }
      });

      return (
        <div className="whitespace-pre-line leading-8">
          <p>
            يُظهر التحليل الفارقي بين التلاميذ المعيدين وغير المعيدين في المواد التعليمية تفاوتًا في متوسطات الأداء، مما يُسلط الضوء على أهمية دراسة أثر الإعادة على التحصيل الدراسي.
          </p>

          {significantNonRepeaters.length > 0 && (
            <p>
              أظهرت المواد التالية: {significantNonRepeaters.join("، ")} فروقًا دالة إحصائيًا لصالح غير المعيدين. ويُبرز ذلك ضرورة تعزيز قدرات التلاميذ المعيدين من خلال دعم تربوي مخصص ومرافقة بيداغوجية فعالة.
            </p>
          )}

          {significantRepeaters.length > 0 && (
            <p>
              بينما سجلت المواد التالية: {significantRepeaters.join("، ")} تفوقًا دالًا إحصائيًا لصالح المعيدين، ما قد يُعزى إلى استفادتهم من إعادة السنة في تعزيز مكتسباتهم المعرفية.
            </p>
          )}

          {noSignificantDifference.length > 0 && (
            <p>
              من ناحية أخرى، لم تُسجل فروق دالة إحصائيًا بين المعيدين وغير المعيدين في مواد مثل: {noSignificantDifference.join("، ")}، مما يدل على أن إعادة السنة لم يكن لها أثر واضح على الأداء في هذه المواد.
            </p>
          )}

          <p>
            بناءً على هذه النتائج، يُوصى بإعادة النظر في آليات الدعم التربوي المُوجهة للتلاميذ المعيدين، وتطوير تدخلات فعالة تُراعي احتياجاتهم التعليمية لضمان تحسين فرص النجاح والتحصيل.
          </p>
        </div>
      );
    };

    return (
      <div id="repeatStatsAnalysis" className="hidden-printable">
        <h3 className="text-lg font-bold mb-4">التحليل النوعي للفروق بين المعيدين وغير المعيدين حسب المواد</h3>
        {getRepeatDifferenceSummary()}
      </div>
    );
  };

export default RepeatDifferencePrintableAnalysis;