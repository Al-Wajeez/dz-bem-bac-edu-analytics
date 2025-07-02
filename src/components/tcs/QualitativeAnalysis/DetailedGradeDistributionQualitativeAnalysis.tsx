import { NotebookPen, X } from 'lucide-react';
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

const DetailedGradeDistributionQualitativeAnalysis: React.FC<{distribution: DetailedGradeDistribution[]; onClose: () => void;}> = ({ distribution, onClose }) => {
    
    const getDistributionAnalysis = (item: DetailedGradeDistribution): JSX.Element[] | null => {
      const total = Object.values(item).reduce(
        (sum, range) => typeof range === 'object' && 'count' in range ? sum + range.count : sum,
        0
      );

      const as = item.range0To8.count + item.range9To9.count + item.range10To11.count + item.range12To13.count + item.range14To15.count + item.range16To17.count + item.range18To20.count

      if (!as || as === 0) return null;

      const getPercentage = (count: number) => parseFloat(((count / total) * 100).toFixed(2));

      const ranges = [
        { label: 'من 0 إلى 8', count: item.range0To8.count, value: getPercentage(item.range0To8.count) },
        { label: 'من 9 إلى 9.99', count: item.range9To9.count, value: getPercentage(item.range9To9.count) },
        { label: 'من 10 إلى 11.99', count: item.range10To11.count, value: getPercentage(item.range10To11.count) },
        { label: 'من 12 إلى 13.99', count: item.range12To13.count, value: getPercentage(item.range12To13.count) },
        { label: 'من 14 إلى 15.99', count: item.range14To15.count, value: getPercentage(item.range14To15.count) },
        { label: 'من 16 إلى 17.99', count: item.range16To17.count, value: getPercentage(item.range16To17.count) },
        { label: 'من 18 إلى 20', count: item.range18To20.count, value: getPercentage(item.range18To20.count) },
      ];

      const elements: JSX.Element[] = [];

      elements.push(
        <p className="mb-4" key="intro">
          يعرض توزيع نتائج التلاميذ في مادة <strong>{item.subject}</strong> تباينًا في الأداء يعكس تعدد مستويات الفهم والتحصيل.
        </p>
      );

      ranges.forEach((range, index) => {
        if (range.count > 0) {
          elements.push(
            <p className="mb-4" key={`range-${index}`}>
              بلغت نسبة التلاميذ في الفئة <strong>[{range.label}]</strong> حوالي <strong>{range.value}%</strong>.
            </p>
          );
        }
      });

      // تحليل نوعي إضافي بناء على الفئات
      const p0To8 = ranges[0].value;
      const p12To13 = ranges[3].value;
      const p14To15 = ranges[4].value;
      const p16To17 = ranges[5].value;
      const p18To20 = ranges[6].value;

      if (p18To20 >= 20) {
        elements.push(
          <p className="mb-4" key="remark-excellent">
            تشير المعطيات إلى أداء متميز، حيث أن أكثر من خُمس التلاميذ حصلوا على معدلات بين 18 و20، مما يدل على فهم معمّق وفعالية في استراتيجيات التدريس والتقويم.
          </p>
        );
      }

      if (p16To17 >= 30) {
        elements.push(
          <p className="mb-4" key="remark-good">
            سجل حوالي ثلث التلاميذ نتائج جيدة بين 16 و17.99، وهو ما يعكس استقرارًا بيداغوجيًا وتناسقًا في تقديم المحتويات.
          </p>
        );
      }

      if (p14To15 >= 40) {
        elements.push(
          <p className="mb-4" key="remark-average">
            يُبرز هذا التوزيع وجود شريحة واسعة من التلاميذ ضمن الأداء المتوسط، مما يستدعي دعمًا إضافيًا لترقية المستوى العام.
          </p>
        );
      }

      if (p12To13 >= 50) {
        elements.push(
          <p className="mb-4" key="remark-below-average">
            تسجيل أكثر من نصف التلاميذ في الفئة [12-13.99] يُشير إلى نتائج دون المتوسط، ويستوجب إعادة النظر في طرائق التقييم والدعم.
          </p>
        );
      }

      if (p0To8 >= 60) {
        elements.push(
          <p className="mb-4" key="remark-weak">
            تمثل نسبة مرتفعة (تفوق 60%) في الفئة [0-8] مؤشرًا على وجود صعوبات بنيوية في التعلم، تستوجب تدخلًا بيداغوجيًا عاجلًا وممنهجًا.
          </p>
        );
      }

      elements.push(
        <p className="mb-4" key="conclusion">
          بناءً على هذه المعطيات، يُوصى بتكييف آليات الدعم والتقويم حسب الحاجات الفعلية للتلاميذ، مع اعتماد أساليب تعليمية متنوعة تضمن تكافؤ الفرص وتحقيق الأهداف التعليمية المنشودة.
        </p>
      );

      return elements;
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b" dir="rtl">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <NotebookPen className="w-5 h-5" />
              التحليل النوعي للتوزيع التفصيلي للنتائج
            </h3>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 text-justify flex-1">
            {distribution.map((item) => {
              const analysis = getDistributionAnalysis(item);
              if (!analysis) return null;

              return (
                <div key={item.subject} className="border-b m-4">
                  <h4 className="font-bold mb-4 m-4">{item.subject}</h4>
                  <p className="m-4">{analysis}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

export default DetailedGradeDistributionQualitativeAnalysis;