import React from "react";

interface MeritStats {
  indicator: string;
  count: number;
  percentage?: string;
}

interface Props {
  stats: MeritStats[];
}

const MeritPerformancePrintableAnalysis: React.FC<Props> = ({ stats }) => {
  const total = stats.reduce((sum, s) => sum + s.count, 0);
  const get = (label: string) => stats.find((s) => s.indicator === label);

  const excellent = get("امتياز");
  const honored = get("تهنئة");
  const encouraged = get("تشجيع");
  const honorRoll = get("لوحة الشرف");
  const observed = get("ملاحظة");

  const totalTop = (excellent?.count || 0) + (honored?.count || 0);
  const totalTopPercentage = ((totalTop / total) * 100).toFixed(1);

  return (
    <div id="meritStatsAnalysis" className="hidden-printable space-y-6">
      <h3 className="text-lg font-bold mb-4">التحليل النوعي للتلاميذ حسب مؤشرات الاستحقاق</h3>

      <p className="mb-2">
        تشير المؤشرات النوعية إلى أن عدد التلاميذ المتميزين بلغ {excellent?.count ?? 0}، أي بنسبة ({excellent?.percentage ?? "0 بالمئة"}) من مجموع التلاميذ،
        في حين بلغ عدد المهنئين {honored?.count ?? 0} بنسبة ({honored?.percentage ?? "0 بالمئة"}).
        أما التلاميذ المشجعون فعددهم {encouraged?.count ?? 0} ({encouraged?.percentage ?? "0 بالمئة"}),
        فيما بلغ عدد التلاميذ الذين تم إدراجهم في لوحة الشرف {honorRoll?.count ?? 0}، بنسبة ({honorRoll?.percentage ?? "0 بالمئة"}).
        من جهة أخرى، يمثل التلاميذ الملاحظون النسبة الأكبر، حيث بلغ عددهم {observed?.count ?? 0} أي ما يعادل ({observed?.percentage ?? "0 بالمئة"}).
      </p>

      <p className="mb-2">
        تعكس هذه المعطيات مؤشراً دالاً على تفاوت كبير في الأداء.
        فالنسبة العامة للتلاميذ الذين حصلوا على امتياز أو تهنئة لا تتجاوز ({totalTopPercentage} بالمئة)، وهي نسبة متواضعة تُبرز الحاجة إلى تعزيز ثقافة التميز
        وتوفير بيئة تعليمية محفزة تُراعي الفروق الفردية وتستنهض الطاقات الكامنة لدى التلاميذ.
      </p>

      <p className="mb-2">
        كما أن النسبة المرتفعة للتلاميذ الملاحظين ({observed?.percentage ?? "0 بالمئة"}) تُنذر بوجود صعوبات تربوية وبيداغوجية تتطلب تدخلاً عاجلاً،
        سواء على مستوى الدعم النفسي التربوي أو عبر خطط معالجة فردية/جماعية تساعد التلاميذ على تجاوز تعثراتهم.
      </p>

      <p>
        في ضوء هذه المؤشرات، تقتضي الضرورة التربوية توجيه مجهودات الفريق التربوي نحو ترسيخ ثقافة التميز،
        وتوفير آليات الدعم التربوي المستمر للفئات المتعثرة، بما يضمن تحسين النتائج في المستقبل وتعزيز مؤشرات الجودة التعليمية بالمؤسسة.
      </p>
    </div>
  );
};

export default MeritPerformancePrintableAnalysis;
