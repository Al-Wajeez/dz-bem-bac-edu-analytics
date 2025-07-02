import React from "react";

type RemarkType = 'success' | 'warning' | 'danger' | 'info' | 'secondary';

const getRemark = (mean: number, stdDev: number): { remark: string; type: RemarkType } => {
  if (mean === 0 && stdDev === 0) return { remark: 'لم تدرس', type: 'secondary' };
  if (mean >= 15 && stdDev <= 3) return { remark: 'أداء ممتاز', type: 'success' };
  if (mean >= 15 && stdDev > 3) return { remark: 'أداء ممتاز ولكنه غير مستقر', type: 'warning' };
  if (mean >= 10 && mean < 15 && stdDev <= 3) return { remark: 'أداء جيد وثابت', type: 'success' };
  if (mean >= 10 && mean < 15 && stdDev > 3) return { remark: 'أداء جيد لكنه متنوع', type: 'warning' };
  if (mean >= 5 && mean < 10 && stdDev <= 3) return { remark: 'أداء ضعيف لكنه ثابت', type: 'info' };
  if (mean >= 5 && mean < 10 && stdDev > 3) return { remark: 'أداء ضعيف وغير مستقر', type: 'warning' };
  if (mean < 5 && mean >= 0.01 && stdDev <= 3) return { remark: 'أداء ضعيف جداً لكنه ثابت', type: 'danger' };
  if (mean < 5 && mean >= 0.01 && stdDev > 3) return { remark: 'أداء ضعيف جداً وغير مستقر', type: 'danger' };
  return { remark: 'لم تدرس', type: 'secondary' };
};

interface DirectoratePerformanceStats {
  directorate: string;
  presentCount: number;
  mean: number;
  stdDev: number;
  remark: string;
  remarkType: RemarkType;
}

const DirectoratePerformancePrintableAnalysis: React.FC<{ stats: DirectoratePerformanceStats[] }> = ({ stats }) => {
  return (
    <div id="directorateAnalysis" className="hidden-printable space-y-8">
      {stats.map((stat) => {
        const { remark } = getRemark(stat.mean, stat.stdDev);
        const stdDevLabel =
          stat.stdDev < 2 ? "ضعيف" :
          stat.stdDev < 3 ? "منخفض" :
          stat.stdDev < 4 ? "متوسط" :
          "مرتفع";

        return (
          <div key={stat.directorate}>
            <h3 className="text-lg font-bold mb-4">تحليل الأداء العام ل{stat.directorate}</h3>

            <div className="whitespace-pre-line leading-8 text-right space-y-4">

              {/* فقرة أولى: عرض المعطيات */}
              <p>
                تُصنّف الوضعية العامة لمؤسسة {stat.directorate} ضمن فئة {remark} من حيث الأداء، 
                إذ بلغ المعدل العام للمتعلمين {stat.mean.toFixed(2)}. 
                أما مستوى التشتت في النتائج، فقد وُصف بأنه {stdDevLabel}، بناءً على انحراف معياري قدره {stat.stdDev.toFixed(2)}.
              </p>

              {/* فقرة ثانية: تحليل تربوي حسب التشتت */}
              {stat.stdDev < 3 ? (
                <p>
                  تعكس هذه النتائج تجانسًا مقبولًا في أداء المتعلمين، 
                  مما يدل على استقرار في وتيرة التعلم وفعالية المقاربات البيداغوجية المطبّقة داخل المؤسسة. 
                  كما يُعدّ هذا التجانس مؤشرًا إيجابيًا على التنسيق الجيد بين المدرّسين وعلى توفّر مناخ تعليمي داعم للتحصيل.
                </p>
              ) : (
                <p>
                  تشير النتائج إلى وجود تباين ملحوظ في أداء المتعلمين، 
                  مما يوحي بوجود تفاوت في الاستيعاب قد يعود إلى عوامل بيداغوجية أو تنظيمية. 
                  ويتطلّب ذلك التدخل لتقليص الفجوات التعليمية، عبر تفعيل استراتيجيات التدريس التفريدي وتعزيز المتابعة المستمرة.
                </p>
              )}

              {/* فقرة ثالثة: توصيات تربوية */}
              <p>
                استنادًا إلى هذه المؤشرات، يُوصى الطاقم التربوي بالمؤسسة بوضع خطة عمل محكمة تهدف إلى تحسين جودة التعلمات، 
                من خلال تطوير استراتيجيات الدعم البيداغوجي، وتكثيف الجهود في تتبع المتعلمين، 
                وتشجيع التعاون بين أعضاء الفريق البيداغوجي من أجل تحقيق الأهداف التعليمية المنشودة والارتقاء بالمردود العام.
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DirectoratePerformancePrintableAnalysis;
