import { NotebookPen, X } from 'lucide-react';
import React from 'react';

interface Subject {

  field: string;
  mean: number;
  stdDev: number;
  remark?: string;
}

interface Stat {
  value: string;
  count: number;
  percentage: number;
  remark?: string;
}

interface SubjectStatsQualitativeAnalysisProps {
  field: string;
  stats: Stat[];
  total: number;
  mean: number;
  stdDev: number;
  remark: string;
  allSubjects: Subject[];
  onClose: () => void;
}

const getPerformanceLevel = (mean: number): string => {
  if (mean >= 14) return 'مرتفعًا';
  if (mean >= 10) return 'متوسطًا';
  return 'منخفضًا';
};

const getVariationLevel = (stdDev: number | undefined): string => {
  if (stdDev === undefined) return 'غير كاف لتحديد مستوى التباين';
  if (stdDev >= 3.5) return 'تباين عالٍ في الأداء (يشير إلى وجود فروق كبيرة بين المتعلمين)';
  if (stdDev >= 2) return 'تباين متوسط في الأداء (يشير إلى درجة متوسطة من الفروق)';
  return 'تباين محدود في الأداء (يدل على تقارب واضح بين نتائج المتعلمين)';
};

const getFieldCategory = (field: string): 'علمي' | 'أدبي' => {
  const literary = ['العربية ش ت م', 'الفرنسية ش ت م', 'الإنجليزية ش ت م', 'تاريخ جغرافيا ش ت م'];
  const scientific = ['العربية ش ت م', 'رياضيات ش ت م', 'علوم ط ش ت م', 'فيزياء ش ت م'];
  if (literary.includes(field)) return 'أدبي';
  if (scientific.includes(field)) return 'علمي';
  return 'أدبي';
};

const shouldAnalyzeSubject = (field: string): boolean => {
  const literary = ['العربية ش ت م', 'الفرنسية ش ت م', 'الإنجليزية ش ت م', 'تاريخ جغرافيا ش ت م'];
  const scientific = ['العربية ش ت م', 'رياضيات ش ت م', 'علوم ط ش ت م', 'فيزياء ش ت م'];
  return [...literary, ...scientific].includes(field);
};

const getSubjectSpecificAnalysis = (field: string, mean: number, stdDev: number | undefined, performance: string, variation: string): string => {
  const baseAnalysis = `تشير نتائج مادة ${field} إلى أداء ${performance} من طرف التلاميذ، حيث بلغ المتوسط الحسابي ${mean}، مما يعكس مستوى عامًا ${performance} للنتائج. ${stdDev !== undefined ? `أما الانحراف المعياري الذي قُدّر بـ ${stdDev}، فيدل على ${variation} في أداء التلاميذ.` : ''}`;

  const subjectAnalyses: { [key: string]: string } = {
    'العربية ش ت م': `${baseAnalysis} وتجدر الإشارة إلى أن هذه النتائج تعكس مستوى ${performance} في اللغة العربية، حيث يظهر التلاميذ ${mean >= 10 ? 'فهمًا جيدًا' : 'صعوبة في'} استيعاب المفاهيم اللغوية والأدبية.`,
    'الأمازيغية ش ت م': `${baseAnalysis} وتجدر الإشارة إلى أن هذه النتائج تعكس مستوى ${performance} في اللغة العربية، حيث يظهر التلاميذ ${mean >= 10 ? 'فهمًا جيدًا' : 'صعوبة في'} استيعاب المفاهيم اللغوية والأدبية.`,
    'الفرنسية ش ت م': `${baseAnalysis} وتجدر الإشارة إلى أن هذه النتائج تعكس مستوى ${performance} في اللغة الفرنسية، حيث يظهر التلاميذ ${mean >= 10 ? 'قدرة جيدة' : 'صعوبة في'} التواصل والتفاهم باللغة الفرنسية.`,
    'الإنجليزية ش ت م': `${baseAnalysis} وتجدر الإشارة إلى أن هذه النتائج تعكس مستوى ${performance} في اللغة الإنجليزية، حيث يظهر التلاميذ ${mean >= 10 ? 'قدرة جيدة' : 'صعوبة في'} استخدام اللغة الإنجليزية في التواصل.`,
    'ت إسلامية ش ت م': `${baseAnalysis} وتجدر الإشارة إلى أن هذه النتائج تعكس مستوى ${performance} في اللغة الإنجليزية، حيث يظهر التلاميذ ${mean >= 10 ? 'قدرة جيدة' : 'صعوبة في'} استخدام اللغة الإنجليزية في التواصل.`,
    'ت مدنية ش ت م': `${baseAnalysis} وتجدر الإشارة إلى أن هذه النتائج تعكس مستوى ${performance} في اللغة الإنجليزية، حيث يظهر التلاميذ ${mean >= 10 ? 'قدرة جيدة' : 'صعوبة في'} استخدام اللغة الإنجليزية في التواصل.`,
    'تاريخ جغرافيا ش ت م': `${baseAnalysis} وتجدر الإشارة إلى أن هذه النتائج تعكس مستوى ${performance} في التاريخ والجغرافيا، حيث يظهر التلاميذ ${mean >= 10 ? 'فهمًا جيدًا' : 'صعوبة في'} استيعاب المفاهيم التاريخية والجغرافية.`,
    'رياضيات ش ت م': `${baseAnalysis} وتجدر الإشارة إلى أن هذه النتائج تعكس مستوى ${performance} في الرياضيات، حيث يظهر التلاميذ ${mean >= 10 ? 'قدرة جيدة' : 'صعوبة في'} حل المسائل الرياضية وتطبيق المفاهيم الرياضية.`,
    'علوم ط ش ت م': `${baseAnalysis} وتجدر الإشارة إلى أن هذه النتائج تعكس مستوى ${performance} في العلوم الطبيعية، حيث يظهر التلاميذ ${mean >= 10 ? 'فهمًا جيدًا' : 'صعوبة في'} استيعاب المفاهيم العلمية والتجريبية.`,
    'فيزياء ش ت م': `${baseAnalysis} وتجدر الإشارة إلى أن هذه النتائج تعكس مستوى ${performance} في الفيزياء، حيث يظهر التلاميذ ${mean >= 10 ? 'قدرة جيدة' : 'صعوبة في'} تطبيق المفاهيم الفيزيائية وحل المسائل.`,
    'معلوماتية ش ت م': `${baseAnalysis} وتجدر الإشارة إلى أن هذه النتائج تعكس مستوى ${performance} في الفيزياء، حيث يظهر التلاميذ ${mean >= 10 ? 'قدرة جيدة' : 'صعوبة في'} تطبيق المفاهيم الفيزيائية وحل المسائل.`,
    'ت تشكيلية ش ت م': `${baseAnalysis} وتجدر الإشارة إلى أن هذه النتائج تعكس مستوى ${performance} في الفيزياء، حيث يظهر التلاميذ ${mean >= 10 ? 'قدرة جيدة' : 'صعوبة في'} تطبيق المفاهيم الفيزيائية وحل المسائل.`,
    'ت موسيقية ش ت م': `${baseAnalysis} وتجدر الإشارة إلى أن هذه النتائج تعكس مستوى ${performance} في الفيزياء، حيث يظهر التلاميذ ${mean >= 10 ? 'قدرة جيدة' : 'صعوبة في'} تطبيق المفاهيم الفيزيائية وحل المسائل.`,
    'ت بدنية ش ت م': `${baseAnalysis} وتجدر الإشارة إلى أن هذه النتائج تعكس مستوى ${performance} في الفيزياء، حيث يظهر التلاميذ ${mean >= 10 ? 'قدرة جيدة' : 'صعوبة في'} تطبيق المفاهيم الفيزيائية وحل المسائل.`,
    'المعدل السنوي': `${baseAnalysis} وتجدر الإشارة إلى أن هذه النتائج تعكس مستوى ${performance} في الفيزياء، حيث يظهر التلاميذ ${mean >= 10 ? 'قدرة جيدة' : 'صعوبة في'} تطبيق المفاهيم الفيزيائية وحل المسائل.`,
    'معدل ش ت م': `${baseAnalysis} وتجدر الإشارة إلى أن هذه النتائج تعكس مستوى ${performance} في الفيزياء، حيث يظهر التلاميذ ${mean >= 10 ? 'قدرة جيدة' : 'صعوبة في'} تطبيق المفاهيم الفيزيائية وحل المسائل.`,
    'معدل الإنتقال': `${baseAnalysis} وتجدر الإشارة إلى أن هذه النتائج تعكس مستوى ${performance} في الفيزياء، حيث يظهر التلاميذ ${mean >= 10 ? 'قدرة جيدة' : 'صعوبة في'} تطبيق المفاهيم الفيزيائية وحل المسائل.`,
  };

  return subjectAnalyses[field] || baseAnalysis;

};

const SubjectStatsQualitativeAnalysis: React.FC<SubjectStatsQualitativeAnalysisProps> = ({ 
  field, 
  stats, 
  total, 
  mean, 
  stdDev, 
  remark, 
  allSubjects,
  onClose 
}) => {
  const subjectsToAnalyze = allSubjects.filter(subject => subject.mean > 0);
  const bestSubject = subjectsToAnalyze.reduce((prev, curr) => (curr.mean > prev.mean ? curr : prev), subjectsToAnalyze[0]);
  const worstSubject = subjectsToAnalyze.reduce((prev, curr) => (curr.mean < prev.mean ? curr : prev), subjectsToAnalyze[0]);
  const topCategories = subjectsToAnalyze.reduce(
    (acc: { science: Subject[]; literature: Subject[] }, curr: Subject) => {
      const cat = getFieldCategory(curr.field);
      if (cat === 'علمي') acc.science.push(curr);
      else if (cat === 'أدبي') acc.literature.push(curr);
      return acc;
    },
    { science: [], literature: [] }
  );

  // Helper to find subject mean or return 0 if not found
  const getMean = (arr: Subject[], fieldName: string): number =>
    arr.find((s) => s.field === fieldName)?.mean ?? 0;

  // Calculate literature average with weights
  const arabicGrade = getMean(topCategories.literature, 'العربية ش ت م');
  const frenchGrade = getMean(topCategories.literature, 'الفرنسية ش ت م');
  const englishGrade = getMean(topCategories.literature, 'الإنجليزية ش ت م');
  const historyGrade = getMean(topCategories.literature, 'تاريخ جغرافيا ش ت م');

  const literatureAvg = ((arabicGrade * 5) + (frenchGrade * 4) + (englishGrade * 3) + (historyGrade * 2)) / 14;

  // Calculate science average with weights
  const arabicGradeSci = getMean(topCategories.science, 'العربية ش ت م');
  const mathGrade = getMean(topCategories.science, 'رياضيات ش ت م');
  const scienceGrade = getMean(topCategories.science, 'علوم ط ش ت م');
  const physicsGrade = getMean(topCategories.science, 'فيزياء ش ت م');

  const scienceAvg = ((arabicGradeSci * 2) + (mathGrade * 4) + (scienceGrade * 4) + (physicsGrade * 4)) / 14;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between p-6 border-b" dir="rtl">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <NotebookPen className="w-5 h-5" />
            التحليل النوعي للمواد
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 text-justify flex-1">
          {subjectsToAnalyze.map((subject) => {
            const performance = getPerformanceLevel(subject.mean);
            const variation = getVariationLevel(subject.stdDev);
            const subjectNote = stats.find(s => s.value === subject.field)?.remark;

            return (
              <div key={subject.field} className="border-b p-4">
                <h4 className="font-bold mb-2">{subject.field}</h4>
                <p className="mb-4">
                  {getSubjectSpecificAnalysis(subject.field, subject.mean, subject.stdDev, performance, variation)}
                </p>
                <p className="mb-4">
                   {subjectNote && `وتنسجم هذه المعطيات مع الملاحظة المسجلة: ${subjectNote}، والتي تعزز القراءة الإحصائية لنتائج المادة.`}
                </p>
              </div>
            );
          })}

          <div className="bg-blue-100 text-blue-800 m-4 p-4 rounded-md">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              ملاحظة
            </h4>
            <p>
              توضح المعطيات الإحصائية أن أفضل أداء للتلاميذ سُجّل في مادة <strong>{bestSubject.field}</strong>، حيث بلغ المتوسط الحسابي <strong>{bestSubject.mean}</strong>، 
              ما يعكس تمكّنًا جيدًا نسبيًا في هذه المادة،
              في المقابل، لوحظ أضعف أداء في مادة <strong>{worstSubject.field}</strong>، بمتوسط قدره <strong>{worstSubject.mean}</strong>.
              وهو ما يستدعي المزيد من الدعم والتعزيز،
              وعند المقارنة بين المواد ذات الطابع العلمي وتلك ذات الطابع الأدبي، يتبيّن أن التلاميذ أظهروا مستوى أفضل في المواد
              {scienceAvg > literatureAvg ? ' العلمية ' : ' الأدبية '}
              إذ بلغ المتوسط العام فيها
              {scienceAvg > literatureAvg ? ` ${scienceAvg.toFixed(2)} ` : ` ${literatureAvg.toFixed(2)} `}
              مقابل
              {scienceAvg > literatureAvg ? ` ${literatureAvg.toFixed(2)} ` : ` ${scienceAvg.toFixed(2)} ` }
              في المواد
              {scienceAvg > literatureAvg ? ' الأدبية ' : ' العلمية '}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectStatsQualitativeAnalysis;
