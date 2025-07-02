import React from "react";

interface StatisticalCount {
  count: number;
  percentage: number;
  total: number;
}

interface StatisticalCountData {
  [key: string]: StatisticalCount;
}

interface GenderStatisticalCount {
  male: StatisticalCount;
  female: StatisticalCount;
}

interface RepeatStatisticalCount {
  repeat: StatisticalCount;
  nonRepeat: StatisticalCount;
}

const genderMap: Record<string, string> = {
  male: 'ذكر',
  female: 'أنثى',
  repeat: 'المعيدين',
  nonRepeat: 'غير المعيدين',
};

const StatisticalCountQualitativePrintableAnalysis: React.FC<{
    title: string;
    data: StatisticalCountData | GenderStatisticalCount | RepeatStatisticalCount;
    id?: string;
}> = ({ title, data, id }) => {
  const entries = Object.entries(data);
  const total = entries.reduce((sum, [, stat]) => sum + stat.count, 0);

  if (total === 0) return null;

  const sorted = entries
    .map(([key, stat]) => ({
      label: genderMap[key] || key,
      count: stat.count,
      percentage: (stat.count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  const dominant = sorted[0];
  const least = sorted[sorted.length - 1];

  const expectedEqual = 100 / sorted.length;
  const variance =
    sorted.reduce((sum, item) => {
      const diff = item.percentage - expectedEqual;
      return sum + diff * diff;
    }, 0) / sorted.length;

  let varianceDescription = '';
  if (variance < 100) {
    varianceDescription = 'توزيع متقارب بين الفئات يعكس توازنًا نسبيًا في البيانات.';
  } else if (variance < 400) {
    varianceDescription = 'توزيع متوسط التفاوت، مما يدل على وجود بعض الفروقات بين الفئات.';
  } else {
    varianceDescription = 'توزيع غير متوازن، حيث تهيمن فئة معينة بشكل واضح على باقي الفئات.';
  }

  const distributionSentence = sorted
    .map(item => `${item.label} بنسبة ${item.percentage.toFixed(1)} بالمئة (${item.count} تلميذ)`)
    .join('، ');

  return (
    <div id={id} className="hidden-printable space-y-6 text-right leading-relaxed">
      <h3 className="text-lg font-bold mb-4">التحليل النوعي لتوزيع {title}</h3>

      <div>
        <p>
          يُظهر {title} ما يلي: {distributionSentence}. ويُلاحظ أن الفئة الأكثر تمثيلاً هي فئة {dominant.label} بنسبة {dominant.percentage.toFixed(1)} بالمئة، 
          في حين تُعد فئة {least.label} الأقل تمثيلًا بنسبة {least.percentage.toFixed(1)} بالمئة.
        </p>
      </div>

      <div>
        <p>{varianceDescription}</p>
      </div>

      <div>
        <p>
          يُنصح الفريق التربوي بتحليل أسباب الفروقات بين الفئات، والعمل على تعزيز التكافؤ من خلال تدخلات بيداغوجية تستهدف الفئات الأقل تمثيلًا، 
          مع تثمين مكتسبات الفئة المهيمنة ومواصلة دعمها لضمان استمرارية الأداء الجيد.
        </p>
      </div>
    </div>
  );
};

export default StatisticalCountQualitativePrintableAnalysis;