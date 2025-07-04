import { NotebookPen, X } from 'lucide-react';
import React from 'react';

interface MeritStats {
  indicator: string;
  count: number;
  percentage?: string;
}

const MeritQualitativeAnalysis: React.FC<{stats: MeritStats[]; onClose: () => void;}> = ({ stats, onClose }) => {
    const getMeritAnalysis = (stats: MeritStats[]): JSX.Element[] => {
      const total = stats.find(stat => stat.indicator === 'المجموع')?.count || 0;
      const meritCount = stats.find(stat => stat.indicator === 'إمتياز')?.count || 0;
      const congratulationCount = stats.find(stat => stat.indicator === 'تهنئة')?.count || 0;
      const encouragementCount = stats.find(stat => stat.indicator === 'تشجيع')?.count || 0;
      const honorBoardCount = stats.find(stat => stat.indicator === 'لوحة شرف')?.count || 0;
      const noteCount = stats.find(stat => stat.indicator === 'ملاحظة')?.count || 0;

      const meritPercentage = (meritCount / total) * 100;
      const congratulationPercentage = (congratulationCount / total) * 100;
      const encouragementPercentage = (encouragementCount / total) * 100;
      const honorBoardPercentage = (honorBoardCount / total) * 100;
      const notePercentage = (noteCount / total) * 100;
      const excellentAndCongratulated = meritPercentage + congratulationPercentage;

      return [
        <p className="mb-2" key="intro">
          تشير المؤشرات النوعية إلى أن عدد التلاميذ المتميزين بلغ {meritCount}، أي بنسبة ({meritPercentage.toFixed(1)}%) من مجموع التلاميذ، في حين بلغ عدد المهنئين {congratulationCount} بنسبة ({congratulationPercentage.toFixed(1)}%). أما التلاميذ المشجعون فعددهم {encouragementCount} ({encouragementPercentage.toFixed(1)}%)، فيما بلغ عدد التلاميذ الذين تم إدراجهم في لوحة الشرف {honorBoardCount}، بنسبة ({honorBoardPercentage.toFixed(1)}%). من جهة أخرى، يمثل التلاميذ الملاحظون النسبة الأكبر، حيث بلغ عددهم {noteCount} أي ما يعادل ({notePercentage.toFixed(1)}%).
        </p>,
        <p className="mb-2" key="performance">
          تعكس هذه المعطيات مؤشراً دالاً على تفاوت كبير في الأداء. فالنسبة العامة للتلاميذ الذين حصلوا على امتياز أو تهنئة لا تتجاوز ({excellentAndCongratulated.toFixed(1)}%)، وهي نسبة متواضعة تُبرز الحاجة إلى تعزيز ثقافة التميز وتوفير بيئة تعليمية محفزة تُراعي الفروق الفردية وتستنهض الطاقات الكامنة لدى التلاميذ.
        </p>,
        notePercentage > 50 ? (
          <p className="mb-2" key="note-high">
            كما أن النسبة المرتفعة للتلاميذ الملاحظين ({notePercentage.toFixed(1)}%) تُنذر بوجود صعوبات تربوية وبيداغوجية تتطلب تدخلاً عاجلاً، سواء على مستوى الدعم النفسي التربوي أو عبر خطط معالجة فردية/جماعية تساعد التلاميذ على تجاوز تعثراتهم.
          </p>
        ) : notePercentage > 30 ? (
          <p className="mb-2" key="note-medium">
            أما نسبة التلاميذ الملاحظين ({notePercentage.toFixed(1)}%) فهي متوسطة لكنها تدعو إلى تحسينات بيداغوجية مستمرة عبر أنشطة علاجية وتدبير فعال لزمن التعلم ودينامية القسم.
          </p>
        ) : (
          <p className="mb-2" key="note-low">
            وتُعد نسبة التلاميذ الملاحظين ({notePercentage.toFixed(1)}%) منخفضة، مما يعكس أثراً إيجابيًا للجهود التربوية المبذولة، ويؤكد أهمية مواصلة هذه المقاربات الناجعة لضمان تطور مستدام في الأداء المدرسي.
          </p>
        ),
        <p key="conclusion">
          في ضوء هذه المؤشرات، تقتضي الضرورة التربوية توجيه مجهودات الفريق التربوي نحو ترسيخ ثقافة التميز، وتوفير آليات الدعم التربوي المستمر للفئات المتعثرة، بما يضمن تحسين النتائج في المستقبل وتعزيز مؤشرات الجودة التعليمية بالمؤسسة.
        </p>
      ];
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b" dir="rtl">
            <h3 className="text-lg font-bold flex items-center gap-2">
                <NotebookPen className="w-5 h-5" />
                التحليل النوعي للمؤشرات البيداغوجية
                </h3>
                <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 p-1"
                >
                <X className="w-6 h-6" />
                </button>
            </div>
    
          <div className="overflow-y-auto p-6 text-justify flex-1">
            <p className="m-4">
              {getMeritAnalysis(stats)}
            </p>
          </div>
        </div>
      </div>
    );
  };

export default MeritQualitativeAnalysis;