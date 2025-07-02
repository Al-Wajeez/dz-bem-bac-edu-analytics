import React from "react";

type DepartmentStats = {
  subject: string;
  departments: { [key: string]: number };
  highestDepartment: string;
  lowestDepartment: string;
  highestMean: number;
  lowestMean: number;
};

const GeneralDepartmentPerformanceAnalysis: React.FC<{ stats: DepartmentStats[] }> = ({ stats }) => {
  if (stats.length === 0) return null;

  let closeGap = 0;
  let moderateGap = 0;
  let largeGap = 0;
  let total = 0;

  stats.forEach((item) => {
    const gap = item.highestMean - item.lowestMean;
    total += 1;
    if (gap < 2) {
      closeGap++;
    } else if (gap >= 2 && gap <= 4) {
      moderateGap++;
    } else {
      largeGap++;
    }
  });

  const getPercentage = (value: number) => ((value / total) * 100).toFixed(2);

  return (
    <div className="hidden-printable" id="departmentStatsAnalysis">
      <h3 className="text-lg font-bold mb-6">التحليل النوعي العام لفروقات الأداء بين الأقسام حسب المواد</h3>

      <div className="whitespace-pre-line leading-8 text-right space-y-4">
        <p>
          من خلال تحليل الفروقات بين الأقسام في مختلف المواد، تبين أن {closeGap} مادة ({getPercentage(closeGap)} بالمئة) تُظهر تجانسًا واضحًا حيث لا يتجاوز الفارق نقطتين، 
          بينما سُجّل تفاوت متوسط في {moderateGap} مادة ({getPercentage(moderateGap)} بالمئة)، 
          وتفاوت كبير في الأداء بين الأقسام في {largeGap} مادة ({getPercentage(largeGap)} بالمئة).
        </p>

        {closeGap >= total * 0.7 && (
          <p>
            تعكس هذه النتائج مستوى عالٍ من التجانس البيداغوجي، 
            مما يشير إلى فعالية التنسيق بين المعلمين وتوحيد أساليب العمل داخل المؤسسة. 
            ويمكن اعتبار هذا التجانس مؤشرًا على نجاح الجهود الجماعية لضبط إيقاع التعلم وتوحيد الأهداف.
          </p>
        )}

        {moderateGap >= total * 0.5 && (
          <p>
            تُظهر البيانات تفاوتًا متوسطًا بين الأقسام في عدد معتبر من المواد، 
            مما يدل على وجود بعض التحديات المرتبطة بالفروقات الفردية داخل الأقسام أو التباين في الوتيرة التعليمية، 
            وهو ما يستوجب تدخلًا بيداغوجيًا مرنًا لتقليص الفجوات وضمان تكافؤ فرص التعلم.
          </p>
        )}

        {largeGap >= total * 0.4 && (
          <p>
            تكشف المعطيات عن فروقات كبيرة في الأداء بين الأقسام في نسبة غير قليلة من المواد، 
            وهو ما قد يعكس تباينًا في الممارسات التدريسية أو إشكالات تنظيمية، مما يتطلب مقاربة علاجية وتنسيقية أكثر عمقًا لضمان تحسين الأداء العام.
          </p>
        )}

        <p>
          بناءً على هذه المعطيات، يُوصى الفريق التربوي بوضع خطة دعم متكاملة تشمل تتبع أداء الأقسام المتعثرة، 
          وتنشيط آليات التقويم التشخيصي، وتنظيم ورشات لتبادل الخبرات البيداغوجية بين المدرسين، 
          مع تعزيز المرافقة الفردية للأقسام ذات الأداء المتباين لضمان تطوير مردود المؤسسة التربوية ككل.
        </p>
      </div>
    </div>
  );
};

export default GeneralDepartmentPerformanceAnalysis;