import React from 'react';

type RemarkType = 'success' | 'warning' | 'danger' | 'info' | 'secondary';

interface SubjectStats {
  subject: string;
  presentCount: number;
  mean: number;
  stdDev: number;
  median: number;
  range: number;
  variance: number;
  remark: string;
  remarkType: RemarkType;
}

interface SubjectStatsPrintAnalysisProps {
  stats: SubjectStats[];
}

const getPerformanceLabel = (mean: number): string => {
  if (mean >= 14) return 'مرتفع';
  if (mean >= 10) return 'متوسط';
  return 'ضعيف';
};

const getVariationLabel = (stdDev: number): string => {
  if (stdDev >= 3.5) return 'تفاوت كبير';
  if (stdDev >= 2) return 'تفاوت متوسط';
  return 'تفاوت محدود';
};

const SubjectStatsPrintableAnalysis: React.FC<SubjectStatsPrintAnalysisProps> = ({ stats }) => {
  const subjects = stats.filter(s => s.mean > 0);
  if (!subjects.length) return null;

  const best = subjects.reduce((a, b) => (a.mean > b.mean ? a : b));
  const worst = subjects.reduce((a, b) => (a.mean < b.mean ? a : b));

  const getMean = (label: string) => subjects.find(s => s.subject === label)?.mean ?? 0;

  const arabic = getMean('العربية ش ت م');
  const math = getMean('رياضيات ش ت م');
  const science = getMean('علوم ط ش ت م');
  const physics = getMean('فيزياء ش ت م');
  const french = getMean('الفرنسية ش ت م');
  const english = getMean('الإنجليزية ش ت م');
  const history = getMean('تاريخ جغرافيا ش ت م');

  const literaryAvg = ((arabic * 5) + (french * 4) + (english * 3) + (history * 2)) / 14;
  const scienceAvg = ((arabic * 2) + (math * 4) + (science * 4) + (physics * 4)) / 14;

  const overallMean = subjects.reduce((sum, s) => sum + s.mean, 0) / subjects.length;
  const overallStd = subjects.reduce((sum, s) => sum + s.stdDev, 0) / subjects.length;

  return (
    <div id="subjectStatsAnalysis" className="hidden-printable space-y-6 text-right leading-relaxed print-visible">
      <h3 className="text-lg font-bold mb-4">التحليل التربوي الإجمالي لأداء التلاميذ حسب المواد</h3>

      <p className="text-justify">
        يُبرز التحليل العام لأداء التلاميذ في مختلف المواد الدراسية مستوىً {getPerformanceLabel(overallMean)} من التحصيل، حيث بلغ المعدل العام {overallMean.toFixed(2)}. 
        كما أن الانحراف المعياري الإجمالي، والمقدر بـ {overallStd.toFixed(2)}، 
        يشير إلى {getVariationLabel(overallStd)} في النتائج، وهو ما يعكس طبيعة التفاوت أو التقارب بين أداء التلاميذ.
      </p>

      <p className="text-justify">
        من خلال المقارنة بين نتائج المواد، تبيّن أن التلاميذ أبدوا أفضل أداء في مادة {best.subject}، 
        بمتوسط بلغ {best.mean.toFixed(2)}، 
        مما يعكس تمكنًا ملحوظًا فيها. بالمقابل، سُجل أضعف أداء في مادة {worst.subject}، 
        بمتوسط قدره {worst.mean.toFixed(2)}، 
        وهو ما يستوجب وقفة تحليلية للبحث في العوامل المؤثرة وسبل الدعم.
      </p>

      <p className="text-justify">
        أما فيما يخص الأداء حسب طبيعة المواد، فقد أظهرت نتائج التلاميذ تفوقًا في  
        {scienceAvg > literaryAvg ? 'المواد العلمية' : 'المواد الأدبية'}، 
        حيث بلغ متوسطها {Math.max(scienceAvg, literaryAvg).toFixed(2)}، 
        مقارنة بـ {Math.min(scienceAvg, literaryAvg).toFixed(2)} في  
        {scienceAvg > literaryAvg ? 'المواد الأدبية' : 'المواد العلمية'}. 
        هذا الفارق قد يعكس ميولات المتعلمين أو فعالية الأساليب البيداغوجية المعتمدة في تلك المواد.
      </p>

      <p className="text-justify">
        بناءً على هذه المؤشرات، يُوصى بتعزيز نقاط القوة من خلال تثمين الممارسات الناجعة، 
        ومواصلة الدعم للمواد التي تُظهر نتائج ضعيفة، مع اعتماد استراتيجيات تعليمية متنوعة تراعي الفروق الفردية بين المتعلمين.
      </p>
    </div>
  );
};

export default SubjectStatsPrintableAnalysis;