import React from 'react';

type RemarkType = 'success' | 'warning' | 'danger' | 'info' | 'secondary';

interface GradeDistribution {
  subject: string;
  above10: { count: number; percentage: number };
  between8And10: { count: number; percentage: number };
  below8: { count: number; percentage: number };
  remark: string;
  remarkType: RemarkType;
}

const GradeDistributionPrintableAnalysis: React.FC<{ distribution: GradeDistribution[] }> = ({ distribution }) => {
    const getGlobalSummary = (): JSX.Element => {
      // تصنيفات حسب نسبة النجاح
      const excellentSubjects: string[] = [];
      const averageSubjects: string[] = [];
      const weakSubjects: string[] = [];

      distribution.forEach((item) => {
        const percentage = item.above10.percentage;
        if (percentage >= 85) {
          excellentSubjects.push(`${item.subject} (${percentage.toFixed(2)}%)`);
        } else if (percentage >= 50) {
          averageSubjects.push(`${item.subject} (${percentage.toFixed(2)}%)`);
        } else {
          weakSubjects.push(`${item.subject} (${percentage.toFixed(2)}%)`);
        }
      });

      return (
        <div className="whitespace-pre-line text-sm leading-8 text-justify">
          <p>
            تشير معطيات تحليل نتائج امتحانات شهادة التعليم المتوسط إلى تباين واضح في مستويات أداء التلاميذ حسب المواد، حيث سجلت بعض المواد نتائج متميزة، في حين أظهرت أخرى مؤشرات تدعو إلى تدخل بيداغوجي عاجل.
          </p>

          {excellentSubjects.length > 0 && (
            <p>
              فمن جهة، تميّزت مواد مثل {excellentSubjects.join("، ")} بنسبة نجاح عالية جدًا، مع نسب منخفضة جدًا للتعثر، ما يعكس تمكّنًا واضحًا من الكفايات، ويُبرز استقرار المسار التعلمي والتأطير الفعّال داخل القسم.
            </p>
          )}

          {averageSubjects.length > 0 && (
            <p>
              من جهة أخرى، حققت مواد مثل {averageSubjects.join("، ")} نسب نجاح متوسطة، تعكس تفاوتًا في مستويات التلاميذ، وتستدعي تعزيز آليات الدعم التربوي الموجه للفئات التي تراوحت معدلاتها بين 8 و10، مع مراجعة وتكييف استراتيجيات التدريس المعتمدة.
            </p>
          )}

          {weakSubjects.length > 0 && (
            <p>
              أما مواد مثل {weakSubjects.join("، ")} فقد سجلت نسب نجاح ضعيفة، حيث فشل نصف التلاميذ أو أكثر في تجاوز عتبة النجاح، مما يُظهر خللًا واضحًا في اكتساب الكفايات الأساسية، ويستوجب إعداد خطة علاجية مستعجلة تشمل حصص دعم مكثفة، مراجعة أدوات التقييم، وتكوينات لفائدة الأساتذة في تقنيات تبسيط المفاهيم.
            </p>
          )}

          <p>
            ويُلاحظ أيضًا أن نسبة التلاميذ الذين حصلوا على معدلات أقل من 8/20 ظلت مرتفعة في المواد العلمية والاجتماعية مقارنة بالمواد الأدبية والتكوينية، مما يعزز ضرورة التركيز على الجوانب المفاهيمية والتطبيقية في التعلّم.
          </p>

          <p>
            بوجه عام، تعكس هذه النتائج مشهدًا تعليميًا مختلطًا بين مواطن القوة ومناطق الهشاشة، ما يفرض على المؤسسة التربوية تفعيل مقاربة تشخيصية علاجية دقيقة، تستند إلى البيانات الرقمية والتحليل النوعي لتقليص نسب الفشل وتحسين جودة التعليم.
          </p>
        </div>
      );
    };

    return (
      <div id="gradeDistributionAnalysis" className="hidden-printable">
        <h3 className="text-lg font-bold mb-4">التحليل الشامل لأداء التلاميذ حسب المواد</h3>
        {getGlobalSummary()}
      </div>
    );
  };

export default GradeDistributionPrintableAnalysis;