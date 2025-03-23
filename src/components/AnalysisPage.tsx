import React, { useState } from 'react';
import Select from 'react-select';
import { Controller } from 'react-hook-form';
import * as XLSX from 'xlsx';
import { X, BarChart, Printer, FileSpreadsheet, Filter, FilterX, NotebookPen } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Modal from './Modal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnalysisPageProps {
  data: any[];
  isDarkMode: boolean; // Accept dark mode state as a prop

}

export function AnalysisPage({ data, isDarkMode }: AnalysisPageProps) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showChart, setShowChart] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisContent, setAnalysisContent] = useState<JSX.Element | null>(null);

  // Assuming data is an array of objects
  const directorate = data.length > 0 ? data[0]['المديرية'] : ''; // Get the first entry's directorate
  const institution = data.length > 0 ? data[0]['المؤسسة'] : ''; // Get the first entry's institution

  const allFields = {
    'المعلومات العامة': ['الجنس','الإعادة','القسم','السوابق الصحية','عدد الإخوة الذكور','عدد الاخوة الاناث','رتبته في العائلة'],
    'الجانب العائلي': ['مهنة الاب','المستوى الدراسي للأب','هل الأب متوفي','مهنة الأم','المستوى الدراسي للأم','هل الأم متوفية','هل الأبوين منفصلان','هل لديه كفيل','متابعة الأب','متابعة الأم','متابعة الكفيل'],
    'الجانب الدراسي': ['المواد المفضلة','المواد الصعبة','الجذع المشترك المرغوب','المواد المميزة للجذع','سبب اهتمامه بالدراسة','ممن يطلب المساعدة عند الصعوبة','هل تشجعه معاملة الأستاذ','هل تحفزه مكافأة والديه','هل ناقش مشروعه الدراسي مع والديه','سبب اهتمامه بالدراسة راجع إلى',],
    'الجانب المهني': ['المهنة التي يتمناها في المستقبل','المستوى الدراسي الذي تتطلبه المهنة','القطاع المرغوب للعمل فيه',],
    'الجانب الترفيهي': ['هل لديه نشاط ترفيهي','كيف يقضي أوقات فراغه'],
    'الجانب الإعلامي': ['هل لديه معلومات كافية حول مشروعه المستقبلي'],
    'الجانب النفسي البيداغوجي': ['هل يعاني من صعوبات دراسية','هل لديه مشكلة يريد مناقشتها']
  };

  const filerFields = {
    '': ['الجنس','الإعادة','السوابق الصحية','هل الأب متوفي','هل الأم متوفية','الجذع المشترك المرغوب','هل تعاني من صعوبات دراسية','هل لديك مشكل للمناقشة']
  }

  const calculateStats = (field: string) => {
    const filteredData = applyFilters(data);
    const total = filteredData.length;
    const counts: { [key: string]: number } = {};
  
    filteredData.forEach(item => {
      let value = item[field];
  
      // Handle multi-select arrays
      if (Array.isArray(value)) {
        if (value.length === 0) {
          counts['بدون إجابة'] = (counts['بدون إجابة'] || 0) + 1;
        } else {
          // Process each value in the array separately
          value.forEach(v => {
            const displayValue = v?.label || v?.value || v;
            if (displayValue) {
              counts[displayValue] = (counts[displayValue] || 0) + 1;
            }
          });
        }
      }
      // Handle string values that might contain multiple selections
      else if (typeof value === 'string' && value.includes(',')) {
        // Split the string by comma and process each value
        value.split(',').forEach(v => {
          const trimmedValue = v.trim();
          if (trimmedValue) {
            counts[trimmedValue] = (counts[trimmedValue] || 0) + 1;
          }
        });
      }
      // Handle single values
      else {
        const displayValue = value?.label || value?.value || value;
        if (displayValue) {
          counts[displayValue] = (counts[displayValue] || 0) + 1;
        } else {
          counts['بدون إجابة'] = (counts['بدون إجابة'] || 0) + 1;
        }
      }
    });
  
    // Convert to sorted array
    return Object.entries(counts)
      .sort((a, b) => {
        // Always put 'بدون إجابة' at the end
        if (a[0] === 'بدون إجابة') return 1;
        if (b[0] === 'بدون إجابة') return -1;
        // Keep descending order for other values
        return b[1] - a[1];
      })
      .map(([value, count]) => ({
        value,
        count,
        percentage: ((count / total) * 100).toFixed(2),
      }));
  };
  // Enhanced analysis generator function
  const generateQualitativeAnalysis = (field: string, stats: any[], total: number) => {

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto ${isDarkMode ? 'dark-mode' : ''}`}>
          <div className={`flex justify-between items-center mb-4 ${isDarkMode ? 'dark-mode' : ''}`}>
            <NotebookPen className="w-5 h-5" />
            <h3 className="text-lg font-bold text-right">{field}</h3>
            <button
              onClick={() => setShowAnalysisModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6 text-justify">
          <div>
            <h4 className="font-bold mb-2">التحليل النوعي:</h4>
            <ul className="list-disc pr-6 space-y-3">
              <h4>يمثل الجدول توزيعًا نوعيًا للبيانات بناءً على "{field}"، حيث يعرض عدد الأفراد لكل فئة ونسبتهم المئوية من إجمالي العينة الذي يساوي {total} تلميذ، مما يعني أن البيانات تم جمعها من مجموعة متوسطة نسبيًا.</h4>

              {stats
                .filter(stat => stat.value !== 'بدون إجابة')
                .sort((a, b) => b.percentage - a.percentage)
                .map((stat, index, arr) => {
                  const isLast = index === arr.length - 1;
                  const isSingle = arr.length === 1;
                  const connectors = {
                    start: index === 0 ? 'تمثل فئة' : isLast ? 'في حين تمثل فئة' : 'يليها',
                    end: isSingle ? '' : isLast ? '' : '،'
                  };

                  return (
                    <li key={stat.value}>
                      {connectors.start} "{stat.value}" ما نسبته {stat.percentage} بالمئة بتعداد {stat.count} تلميذ.{
                        connectors.end
                      }
                    </li>
                  );
                })}

              {stats.some(s => s.value === 'بدون إجابة') && (
                <li className="text-red-600">
                  هناك {stats.find(s => s.value === 'بدون إجابة')?.count} إجابة غير مكتملة
                  ({stats.find(s => s.value === 'بدون إجابة')?.percentage}%)
                </li>
              )}
            </ul>
          </div>

            {/*<div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium mb-2">التوصيات:</h4>
              <ul className="list-disc pr-6 space-y-4">
                <h4>في سياق استبيان الميول والاهتمامات، يصبح مراجعة البيانات مع إضافة معطيات مكملة أمرًا ضروريًا لضمان دقة التحليل وفهم التوجهات الفعلية للتلاميذ. فقد تساعد هذه المراجعة في التحقق من مدى اتساق الإجابات مع الواقع الأكاديمي أو المهني. كما أن إجراء مقابلات متعمقة مع بعض التلاميذ يتيح فرصة لفهم الدوافع الحقيقية وراء اختياراتهم، مثل الأسباب التي تؤثر على تفضيلهم لمواد معينة أو توجههم نحو مسارات دراسية أو مهنية محددة. علاوة على ذلك، فإن تحسين عملية جمع البيانات، من خلال تصميم أسئلة واضحة ومتنوعة وتشجيع التلاميذ على تقديم إجابات دقيقة، يقلل من نسبة الإجابات غير المكتملة أو غير الدقيقة، مما يسهم في الحصول على صورة أوضح حول الميول والاهتمامات الفعلية، وبالتالي يساعد في تطوير برامج توجيه أكاديمي ومهني أكثر فعالية.</h4>
              </ul>
            </div>*/}
          </div>
        </div>
      </div>
    );
  };

  const applyFilters = (data: any[]) => {
    return data.filter(item => {
      return Object.entries(filters).every(([field, filterValue]) => {
        if (!filterValue) return true;
        const itemValue = item[field];
  
        // Special handling for location field
        if (field === 'مكان الميلاد') {
          return itemValue?.toLowerCase().includes(filterValue.toLowerCase());
        }
  
        // Existing filtering logic
        if (Array.isArray(itemValue)) {
          return itemValue.some(v => (typeof v === 'object' ? v.value : v) === filterValue);
        } else if (typeof itemValue === 'object' && itemValue !== null) {
          return itemValue.value === filterValue || itemValue.label === filterValue;
        } else {
          return itemValue === filterValue;
        }
      });
    });
  };

  const exportToExcel = (tableId: string) => {
    const table = document.getElementById(tableId);
    if (!table) return;

    const wb = XLSX.utils.table_to_book(table);
    XLSX.writeFile(wb, `${tableId}.xlsx`);
  };

  const printTable = (tableId: string) => {
    const printContent = document.getElementById(tableId)?.outerHTML;
    if (!printContent) return;
  
    // Get the field name or identifier for the table (you may need to adjust this based on your data structure)
    const field = tableId.replace('table-', ''); // Example: Extract field name from table ID
  
    // Calculate stats for the specific field
    const stats = calculateStats(field);
    const total = stats.reduce((sum, stat) => sum + stat.count, 0);
  
    // Generate analysis HTML
    const analysisHTML = `
      <div class="analysis-section" dir="rtl" style="margin-top: 20px; font-family: 'Cairo'; line-height: 1.6;">
        <div style="margin-bottom: 30px;">
          <h4 style="font-weight: 600; margin-bottom: 8px;">الملاحظات الإحصائية:</h4>
          <h4>يمثل الجدول توزيعًا نوعيًا للبيانات بناءً على "${field}"، حيث يعرض عدد الأفراد لكل فئة ونسبتهم المئوية من إجمالي العينة الذي يساوي "${total}" تلميذ، مما يعني أن البيانات تم جمعها من مجموعة متوسطة نسبيًا.</h4>
          <ul style="list-style-type: disc; margin-right: 20px;">
            ${stats
              .filter(stat => stat.value !== 'بدون إجابة')
              .sort((a, b) => b.percentage - a.percentage)
              .map((stat, idx, arr) => {
                const connector = idx === 0 
                  ? 'تمثل فئة' 
                  : idx === arr.length - 1 
                    ? 'في حين تمثل فئة' 
                    : 'يليها';
                return `
                  <li style="margin-bottom: 5px;">
                    ${connector} "${stat.value}" ما نسبته ${stat.percentage} بالمئة 
                    بتعداد ${stat.count} تلميذ
                  </li>`;
              })
              .join('')}
            ${stats.some(s => s.value === 'بدون إجابة') ? `
              <li style="color: #dc2626;">
                هناك ${stats.find(s => s.value === 'بدون إجابة')?.count} إجابة غير مكتملة
                (${stats.find(s => s.value === 'بدون إجابة')?.percentage} بالمئة)
              </li>` : ''}
          </ul>
        </div>
      </div>
    `;

    const win = window.open('', '', 'height=700,width=700');
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>برنامج الوجيز - إستبيان الميول الإهتمامات</title>
          <style>
            body {
              direction: rtl;
              font-family: 'Cairo', sans-serif;
            }
            table {
              min-width: 100%;
              border-collapse: collapse;
              margin: 1rem 0;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            th, td {
              border: 1px solid #e5e7eb;
              padding: 0.75rem 1.5rem;
              text-align: center;
              font-size: 0.875rem;
            }
            thead tr {
              background-color: #f9fafb;
            }
            thead th {
              color: #6b7280;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            tbody tr {
              background-color: white;
              border-top: 1px solid #e5e7eb;
            }
            tbody td {
              color: #1f2937;
              white-space: nowrap;
            }
            tfoot tr {
              background-color: #f9fafb;
              font-weight: 600;
            }
            tfoot td {
              font-weight: bold;
            }
            .bg-gray-50 {
              background-color: #f9fafb;
            }
            .divide-y > :not([hidden]) ~ :not([hidden]) {
              border-top-width: 1px;
              border-color: #e5e7eb;
            }
            .analysis-section {
              margin-top: 20px;
              padding: 20px;
              /*background-color: #f8f9fa;*/
              border-radius: 8px;
            }
            .analysis-section h3 {
              text-align: center;
              font-size: 1.2em;
              margin: 20px 0 10px;
              color: #2d3748;
            }
            .analysis-section ul {
              list-style-type: disc;
              margin-right: 20px;
            }
            .analysis-section li {
              margin-bottom: 5px;
            }
          </style>
        </head>
        <body>
          <h3 style="text-align: center; font-size: 1.2em; margin: 20px 0 10px; color: #2d3748;">
            تحليل جدول توزيع التلاميذ حسب ${field}
          </h3>
          ${printContent}
          ${analysisHTML}
        </body>
      </html>
    `);
  
    win.document.close();
    win.print();
  };

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  const printAllTables = () => {
   
    const tables = document.querySelectorAll('table');
    
    // Assuming you want to calculate the count for a specific field
    const stats = calculateStats('الإعادة'); // Replace 'yourFieldName' with the actual field name
    const totalCount = stats.reduce((count, stat) => count + stat.count, 0); // Calculate total count

    const firstContent = `
      <table border="0" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <tr>
          <td colspan="2" style="text-align: center; border: 2px solid #ffffff;">
            <strong>الجمهورية الجزائرية الديمقراطية الشعبية</strong><br>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: center; padding-bottom: 100px; border: 2px solid #ffffff;">
            <p style="font-size: 1rem; font-weight: bold; margin: 0 0 0 0;">وزارة التربية الوطنية</p>
          </td>
        </tr>
        <tr>
          <td style="text-align: center; border: 2px solid #ffffff;">
            <p style="font-size: 1rem; font-weight: bold; margin: 0 0 0 0;">${directorate}</p><br>
            <p style="font-size: 1rem; font-weight: bold; margin: 0 0 0 0;">${institution}</p>
          </td>
          <td style="text-align: center; border: 2px solid #ffffff;">
            <strong>السنة الدراسيــة: ${getCurrentYear()}/${getCurrentYear()-1}</strong>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: center; border: 2px solid #ffffff;">
            <p style="font-size: 2rem; font-weight: bold; margin: 5rem 0 0 0;">حوصلة حول:</p><br>
            <p style="font-size: 3.5rem; font-weight: bold; margin: 1rem;">استبيان الميول والاهتمامات</p><br>
            <p style="font-size: 2rem; font-weight: bold; margin: 0 0 10rem 0;;">خاص بتلاميذ 4 متوسط</p>
          </td>
        </tr>
        <tr>
          <td style="text-align: center; border: 2px solid #ffffff;">
            <p style="font-size: 1rem; font-weight: bold; margin: 0 0 0 0;">مستشار التوجيه والإرشاد المدرسي والمهني</p>
          </td>
          <td style="text-align: center; border: 2px solid #ffffff;">
            <p style="font-size: 1rem; font-weight: bold; margin: 0 0 0 0;">المديــــر(ة)</p>
          </td>
        </tr>
      </table>
    `;

    const introContent = `
      <div dir="rtl" style="page-break-before: always; font-family: 'Cairo'; line-height: 1.8;">
        <h1 style="text-align: center; margin-bottom: 30px;">تقرير استبيان الميول والاهتمامات</h1>
        
        <div class="intro-section">
          <h2 style="color: #2d3748; border-bottom: 2px solid #ddd; padding-bottom: 8px;">1. خلفية الدراسة</h2>
          <p>في شهر نوفمبر ${getCurrentYear()-1}، تم توزيع استبيان الميول والاهتمامات في ${institution} التابعة ل${directorate}، وقد تم تطبيق هذا الاستبيان على (${totalCount}) تلميذ، حيث تمت هذه الخطوة بالتنسيق مع هيئة التعليم والإدارة المدرسية بهدف فهم توجهات واهتمامات التلاميذ في هذه المرحلة المهمة من حياتهم الدراسية.</p>
          <p>تهدف هذه الخطوة إلى تقديم دعم فعّال ومساعدة من قبل مستشار التوجيه والإرشاد المدرسي والمهني، حيث يسعى المستشار لتحديد ميول واهتمامات التلاميذ ومساعدتهم في فهم أفضل لاختياراتهم التعليمية والمهنية المستقبلية، يتمثل الهدف الأساسي في توجيه التلاميذ نحو اتخاذ قرارات مستنيرة وتحديد مساراتهم الدراسية والمهنية بناءً على تفاصيل محددة حول اهتماماتهم وميولهم.</p>
          <p>تعكس هذه العملية التزام المدرسة بتقديم تجارب تعلم شاملة وتحفيزية للتلاميذ، مع التركيز على دعمهم في تحديد أهدافهم المستقبلية وتحقيق توازن بين متطلبات الدراسة وتطلعاتهم الشخصية.</p>
        </div>

        <div class="intro-section">
          <h2 style="color: #2d3748; border-bottom: 2px solid #ddd; padding-bottom: 8px;">2. عملية التفريغ</h2>
          <p>تم تفريغ وترميز وكذا معالجة نتائج هذا الاستبيان في ذات الشهر، بهدف تسهيل تحليل وفهم النتائج بشكل أكثر فعالية من قبل مستشار التوجيه والإرشاد المدرسي والمهني، كما يمكن الهدف من تفريغ الاستبيان أيضا في:</p>
          <ul style="list-style-type: square; margin-right: 30px;">

            <li>تسهيل التحليل:</li>
            <p>عندما يتم تفريغ الاستبيان، يتم تحويل البيانات المكتوبة في الاستبيان إلى شكل قابل للتحليل بسهولة؛ يمكن للمستشار استخدام البيانات المفصلة لتحديد الاتجاهات والميول التي تظهر في إجابات التلاميذ.</p>

            <li>فهم أعمق:</li>
            <p>التفريغ يساعد في الفهم الأعمق لتلك الاحتياجات والاهتمامات التي قد تكون ذات أهمية كبيرة للتلاميذ؛ يمكن أن يكون هذا الفهم أساسيًا للمستشار لتقديم التوجيه والدعم الشخصي.</p>

            <li>تحضير للتفاعل مع التلاميذ:</li>
            <p>من خلال تفريغ الاستبيان، يكون المستشار على دراية بالنقاط الرئيسية والمحاور الرئيسية التي يجب التركيز عليها خلال التفاعل مع التلاميذ؛ يمكن أن يستخدم هذا الإعداد لتوجيه النقاشات وتوفير الدعم الأمثل.</p>

            <li>تخطيط العمل القادم</li>
            <p>تفريغ الاستبيان يُمكن المستشار من تحديد الخطوات التالية بناءً على الاحتياجات الفردية للتلاميذ والتحديات التي يمكن مواجهتها؛ يُمكن أن يُستخدم هذا الفهم لوضع خطط فعّالة للتوجيه المستقبلي وتطوير البرامج الداعمة.</p>

          </ul>
        </div>

        <div class="intro-section">
          <h2 style="color: #2d3748; border-bottom: 2px solid #ddd; padding-bottom: 8px; page-break-before: always;">3. عملية التحليل</h2>
          <p>تمت عملية تحـليـل الاستبيان على مستوى المتوسطة خلال شهر ديسمبر وإستمر إلى غاية شهر جانفي ${getCurrentYear()} مع التلاميذ، والتي شملت عدة خطوات، وهي على النحو التالي:</p>
          <ul style="list-style-type: square; margin-right: 30px;">

            <li>فحص البيانات:</li>
            <p>ويتم ذلك بمراجعة جميع الإجابات للتأكد من استكمال البيانات والتحقق من سلامة النماذج.</p>

            <li>تصنيف البيانات:</li>
            <p>ويتم ذلك بتصنيف البيانات حسب المواضيع أو الأقسام المختلفة الموجودة في الاستبيان، مثل الميول الأكاديمية أو التفضيلات المهنية أو الشعبة.</p>

            <li>إحصاء البيانات:</li>
            <p>ويتم ذلك بإجراء إحصاءات بسيطة لتحديد الاتجاهات العامة والتركيز على النقاط البارزة في البيانات.</p>

            <li>تحليل الاتجاهات:</li>
            <p>ويتم ذلك بالبحث عن الاتجاهات الرئيسية والميول التي يظهرها التلاميذ في إجاباتهم؛ هل هناك اهتمامات مشتركة أو تفضيلات تبرز؟</p>

            <li>التفاعل مع البيانات:</li>
            <p>ويتم ذلك بتحليل البيانات بناءً على الخبرة وفهم السياق المدرسي والمهني.</p>

            <li>تحليل الفرق:</li>
            <p>إذا كان هناك أفواج مختلفة أو فئات، يتم تحليل الاختلافات بين إجاباتهم؛ هل هناك اختلافات بين الصفوف أو الأفواج؟</p>

            <li>استخدام النتائج لاتخاذ القرارات:</li>
            <p>ويتم ذلك بتحليل البيانات بما يتلاءم مع أهداف المدرسة والمستشار؛ هل هناك إجراءات يمكن اتخاذها لتحسين الدعم والتوجيه للتلاميذ؟</p>

            <li>تقديم التوصيات:</li>
            <p>اقترح توصيات وخطط للعمل القادم بناءً على النتائج؛ هل هناك برامج إضافية أو نشاطات يمكن تنظيمها لتلبية احتياجات التلاميذ؟</p>

            <li>التواصل مع التلاميذ:</li>
            <p>ويتم ذلك بإعداد جلسات فردية أو جماعية مع التلاميذ لمناقشة النتائج وتقديم الدعم الإضافي إذا كان ذلك ضروريًا.</p>

          </ul>

          <p>هذه الخطوات تشكل إطاراً عاماً لعملية التحليل، وتساعد في استخلاص الفوائد القصوى من البيانات وتوجيه الجهود بشكل فعّال نحو تحسين توجيه ودعم التلاميذ.</p>

        </div>

        <div class="intro-section">
          <h2 style="color: #2d3748; border-bottom: 2px solid #ddd; padding-bottom: 8px; page-break-before: always;">4. عملية التبليغ</h2>
          <p>تم تبليغ نتائج الاستبيان لمدير المدرسة في جانفي ${getCurrentYear()}، حيث تم ذلك بإعداد تقرير مفصل يشمل النتائج الرئيسية والتوصيات، تم وذلك عن طريق:</p>
          <ul style="list-style-type: square; margin-right: 30px;">
            <li>تحضير تقرير كتابي:</li>
            <p>ويتم ذلك بكتابة تقرير يلخص نتائج الاستبيان بشكل مفصل؛ يجب أن يتضمن التقرير المشاهدات الرئيسية والاتجاهات التي تم استنتاجها من البيانات.</p>

            <li>تحليل النتائج:</li>
            <p>ويتم ذلك بتحليل البيانات بشكل عميق وموجز؛ حدد الميول والاهتمامات الرئيسية التي برزت من الاستبيان.</p>

            <li>تقديم التوصيات:</li>
            <p>ويتم ذلك بتقيدم توصيات ملموسة وعملية استنادًا إلى النتائج؛ اقترح إجراءات قابلة للتنفيذ لتحسين الدعم والتوجيه.</p>

            <li>تحديد القضايا الرئيسية:</li>
            <p>ويتم ذلك بتحديد القضايا أو التحديات التي يمكن أن تكون بحاجة إلى اهتمام إداري، سواء كانت في المجال التعليمي أو الإداري.</p>

            <li>تقديم المعلومات بشكل بصري:</li>
            <p>استخدم رسوم بيانية أو جداول لتقديم البيانات بشكل بصري ومفهوم.</p>

            <li>طرح الأسئلة الرئيسية:</li>
            <p>ويتم ذلك بتقديم أي أسئلة رئيسية حول البيانات، والبحث عن توجيه من مدير المدرسة حول كيفية التعامل مع هذه القضايا.</p>

            <li>عقد اجتماع لمناقشة النتائج:</li>
            <p>اقترح عقد اجتماع مع مدير المدرسة لمناقشة النتائج وتوضيح أي نقاط قد تحتاج إلى توضيح.</p>

            <li>تقديم الدعم:</li>
            <p>ويتم ذلك بعرض االاستعداد لتقديم الدعم الإضافي أو تنظيم جلسات إضافية إذا كانت هناك حاجة.</p>

            <li>تبليغ المعلمين والتلاميذ:</li>
            <p>في حال كانت النتائج تتعلق بالمعلمين أو التلاميذ، قدم إشعارًا لهم بالنتائج والتوصيات.</p>

            <li>الاحتفاظ بالتفاعل المستمر:</li>
            <p>ويتم ذلك بالاستمرار في التواصل مع مدير المدرسة بشكل منتظم لضمان استمرارية التحسين والتطوير.</p>

          </ul>

          <p>بتبليغ نتائج الاستبيان بشكل فعال، يمكن أن يساهم المستشار في تعزيز فهم المدرسة لاحتياجات التلاميذ وتحسين التوجيه والإرشاد المدرسي.</p>

        </div>

      </div>
    `;

    const outroContent = `
      <div dir="rtl" style="page-break-before: always; font-family: 'Cairo'; line-height: 1.8;">

        <div class="intro-section">
          <h2 style="color: #2d3748; border-bottom: 2px solid #ddd; padding-bottom: 8px;">6.	التوصيات والاقتراحات</h2>
          <p>بناءً على الجداول التي تم تقديمها وتحليلها، يمكن إجراء بعض التوصيات والاقتراحات:</p>
          <ul style="list-style-type: square; margin-right: 30px;">

            <li>الجذع المشترك المُفضّل:</li>
            <p>يتبيّن من ما سبق أن الأغلبية يفضلون الجذع المشترك علوم وتكنولوجيا على الجذع المشترك آداب.</p>

            <li>فهم أعمق:</li>
            <p>التفريغ يساعد في الفهم الأعمق لتلك الاحتياجات والاهتمامات التي قد تكون ذات أهمية كبيرة للتلاميذ؛ يمكن أن يكون هذا الفهم أساسيًا للمستشار لتقديم التوجيه والدعم الشخصي.</p>
            <p>يمكن توجيه الجهود لفهم الفوائد والإمكانيات في كلا الجذعين من خلال تقديم المعلومات بشكل مفصّل حول المسارين والوظائف المحتملة التي يمكن الوصول إليها من خلال كلٍ منهما.</p>

            <li>المواد التي تشكل صعوبة:</li>
            <p>استنادًا إلى الجدول رقم (20) الذي يمثل المواد التي يتلقى فيها التلميذ صعوبة، يجب توفير دعم إضافي ومساعدة في المواد التي يظهر فيها التلاميذ صعوبة، مثل الرياضيات والعلوم الفيزيائية.</p>
            <p>يمكن تقديم دروس إضافية أو جلسات تعليمية خاصة لدعم التلاميذ ومساعدتهم في فهم هذه المواد الصعبة.</p>

            <li>تفضيل المواد:</li>
            <p>تبيّن من ما سبق أن التلاميذ يفضلون المواد العلمية والرياضية بشكل عام. يمكن استثمار هذا التفضيل لتشجيع التلاميذ على استكشاف مجالات العلوم والتكنولوجيا وتعزيز تعلمهم في هذه المواد.</p>
            <p>يجب أيضًا التركيز على اللغات بما يتناسب مع أهميتها في العالم الحديث والحاجة إلى التواصل مع الآخرين بلغات متعددة.</p>

            <li>الدعم الأسري:</li>
            <p>يمكن تشجيع التواصل المستمر بين المدرسة وأولياء الأمور لفهم احتياجات التلاميذ والعمل معًا لتحسين أدائهم وتوجيههم نحو المسارات التعليمية المناسبة.</p>

            <li>الدعم الأكاديمي والتوجيه الوظيفي:</li>
            <p>يُعزز الدعم الأكاديمي والتوجيه الوظيفي للتلاميذ لمساعدتهم في تحديد المسارات التعليمية والوظيفية التي تناسب ميولهم وقدراتهم.</p>
            <p>يمكن تقديم جلسات توجيهية للتلاميذ لاستكشاف خيارات التعليم والمهن المختلفة المتاحة لهم.</p>

            <li>التوجيه التعليمي:</li>
            <p>يُنصح بتوفير دعم إضافي في المواد التي يظهر فيها التلاميذ صعوبة، مثل الرياضيات والعلوم.</p>
            <p>يُشجع على توفير جلسات تقوية أو مساعدة إضافية للتلاميذ للتغلب على الصعوبات التي يواجهونها في هذه المواد.</p>

            <li>استكشاف المسارات التعليمية:</li>
            <p>يجب تقديم دعم أكاديمي وتوجيه وظيفي للتلاميذ لمساعدتهم في اختيار المسارات التعليمية الملائمة وفقًا لاهتماماتهم وقدراتهم.</p>

            <li>التواصل مع أولياء الأمور:</li>
            <p>ينبغي تعزيز التواصل مع أولياء الأمور لفهم احتياجات التلاميذ والعمل سويًا لدعم تحسين أدائهم الأكاديمي.</p>

            <li>تعزيز المواد العلمية واللغات:</li>
            <p>يُشجع على تعزيز المواد العلمية والرياضية وكذلك تعلم اللغات لأنها تعد أساسية في العالم الحديث.</p>

            <li>التوجه الأكاديمي:</li>
            <p>يتطلب الأمر تقديم توجيه فردي للتلاميذ ودعمهم في اتخاذ القرارات الأكاديمية المناسبة لمستقبلهم.</p>

            <li>الاستفادة من المعلومات:</li>
            <p>يجب استخدام تحليل البيانات والمعلومات المُقدمة في تطوير البرامج التعليمية والتوجيه الأكاديمي.</p>

            <li>دعم الشرائح الضعيفة:</li>
            <p>ينبغي دعم التلاميذ الذين يظهرون صعوبات في مواد محددة من خلال برامج خاصة تُعنى بتطوير قدراتهم.</p>

            <li>تحفيز الفضول والاستكشاف:</li>
            <p>يُشجع على توفير فرص للتلاميذ لاكتشاف مهاراتهم وميولهم من خلال الأنشطة اللاصفية والبرامج الاختيارية</p>
          </ul>

          <p>هذه التوصيات مصممة لتحسين الأداء الأكاديمي للتلاميذ ودعمهم في اتخاذ القرارات التعليمية والوظيفية المستقبلية بشكلٍ أفضل.</p>
        </div>

        <div class="intro-section">
          <h2 style="color: #2d3748; border-bottom: 2px solid #ddd; padding-bottom: 8px;">الخاتمة:</h2>
          <p>بناءً على التحليل المقدم، يتعين تقديم دعم شامل للتلاميذ في المواد التي يواجهون فيها صعوبة وتشجيعهم على استكشاف موادهم المفضلة وتوجيههم نحو مسارات تعليمية ومهنية تتناسب مع اهتماماتهم ومهاراتهم.</p>
        </div>

      </div>
    `;
    const printContent = Array.from(tables).map((table, index) => {
      const field = Object.values(allFields).flat()[index];
      const stats = calculateStats(field);
      const total = stats.reduce((sum, stat) => sum + stat.count, 0);
  
      // Generate analysis HTML
      const tabletitleHTML = `
        <div class="tabletitle-section">
          <h3 style="text-align: center; font-size: 1.2em; margin: 20px 0 10px; color: #2d3748;">
            الجدول رقم (${index + 1}) - يمثل توزيع التلاميذ حسب ${field}
          </h3>
        </div>
      `;

      const analysisHTML = `
        <div class="analysis-section">
          <div style="margin-bottom: 30px;">
            <h4 style="font-weight: 600; margin-bottom: 8px;">الملاحظات الإحصائية:</h4>
            <h4>يمثل الجدول توزيعًا نوعيًا للبيانات بناءً على "${field}"، حيث يعرض عدد الأفراد لكل فئة ونسبتهم المئوية من إجمالي العينة الذي يساوي "${total}" تلميذ، مما يعني أن البيانات تم جمعها من مجموعة متوسطة نسبيًا.</h4>
            <ul style="list-style-type: disc; margin-right: 20px;">
              ${stats
                .filter(stat => stat.value !== 'بدون إجابة')
                .sort((a, b) => b.percentage - a.percentage)
                .map((stat, idx, arr) => {
                  const connector = idx === 0 
                    ? 'تمثل فئة' 
                    : idx === arr.length - 1 
                      ? 'في حين تمثل فئة' 
                      : 'يليها';
                  return `
                    <li style="margin-bottom: 5px;">
                      ${connector} "${stat.value}" ما نسبته ${stat.percentage} بالمئة 
                      بتعداد ${stat.count} تلميذ
                    </li>`;
                })
                .join('')}
              ${stats.some(s => s.value === 'بدون إجابة') ? `
                <li style="color: #dc2626;">
                  هناك ${stats.find(s => s.value === 'بدون إجابة')?.count} إجابة غير مكتملة
                  (${stats.find(s => s.value === 'بدون إجابة')?.percentage} بالمئة)
                </li>` : ''}
            </ul>
          </div>
        </div>
      `;

      return `${tabletitleHTML}${table.outerHTML}${analysisHTML}`;
    }).join('<div style="page-break-after: always;"></div>');
  
    const win = window.open('', '', 'height=700,width=700');
    if (!win) return;
  
    win.document.write(`
      <html>
        <head>
          <title>برنامج الوجيز - إستبيان الميول الإهتمامات</title>
          <style>
            body {
              direction: rtl;
              font-family: 'Cairo', sans-serif;
              line-height: 1.6;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: center;
            }
            th {
              background-color: #f8f9fa;
              font-weight: 600;
            }
            .analysis-section {
              margin: 30px 0;
              padding: 20px;
              border-radius: 8px;
            }
            .analysis-section h3 {
              border-bottom: 2px solid #ddd;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            ul {
              margin-right: 20px;
            }
            @media print {
              body {
                font-size: 14px;
              }
              table {
                page-break-inside: avoid;
              }
              .analysis-section {
                page-break-inside: avoid;
                page-break-after: auto;
              }
            }
          </style>
        </head>
        <body>
          ${firstContent}
          ${introContent}
          <div style="page-break-before: always;">
              <h2 style="color: #2d3748; border-bottom: 2px solid #ddd; padding-bottom: 8px;">5.	تحليل ومناقشة إستبيان الميول والإهتمامات</h2>
            ${printContent}
          </div>
          ${outroContent}
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  const renderChart = (stats: any[], title: string) => {
    const colors = stats.map(
      (_, index) => `hsl(${(index * 360) / stats.length}, 70%, 50%)` // Generates a range of colors
    );

    const chartData = {
      labels: stats.map(item => item.value),
      datasets: [
        {
          label: title,
          data: stats.map(item => item.count),
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('70%', '50%')),
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: false,
        title: {
          display: false,
          text: title,
        },
      },
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`bg-white rounded-lg p-6 max-w-6xl w-full ${isDarkMode ? 'nav-dark' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{title}</h3>
            <button
              onClick={() => setShowChart(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="w-full h-[400px]">
            <Bar data={chartData} options={options} />
          </div>
        </div>
      </div>
    );
  };

  const renderAnalysisTable = (field: string, title: string) => {
    const stats = calculateStats(field);
    const tableId = `table-${field}`;

    // Calculate the total count
    const total = stats.reduce((sum, stat) => sum + stat.count, 0);

    return (
      <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowChart(field)}
              className="p-2 text-blue-600 hover:text-blue-800"
              title="Show Chart"
            >
              <BarChart className="w-5 h-5" />
            </button>
            <button
              onClick={() => printTable(tableId)}
              className="p-2 text-gray-600 hover:text-gray-800"
              title="Print Table"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={() => exportToExcel(tableId)}
              className="p-2 text-green-600 hover:text-green-800"
              title="Export to Excel"
            >
              <FileSpreadsheet className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                const stats = calculateStats(field);
                const total = stats.reduce((sum, stat) => sum + stat.count, 0);
                const content = generateQualitativeAnalysis(field, stats, total);
                setAnalysisContent(content);
                setShowAnalysisModal(true);
              }}
              className="p-2 text-orange-600 hover:text-orange-800"
              title="Generate Qualitative Analysis"
            >
              <NotebookPen className="w-5 h-5" />
            </button>
  
          </div>
        </div>
        <div className="overflow-x-auto">
          <table id={tableId} className={`min-w-full ${isDarkMode ? 'dark-mode' : ''}`}>
            <thead>
              <tr className={`bg-gray-50 ${isDarkMode ? 'dark-mode' : ''}`}>
                <th className={`px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider ${isDarkMode ? 'button-dark bg-gray-800' : ''}`}>
                  القيمة
                </th>
                <th className={`px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider ${isDarkMode ? 'button-dark bg-gray-800' : ''}`}>
                  العدد
                </th>
                <th className={`px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider ${isDarkMode ? 'button-dark bg-gray-800' : ''}`}>
                  النسبة المئوية
                </th>
              </tr>
            </thead>
            <tbody className={`bg-white divide-y divide-gray-200 ${isDarkMode ? 'dark-mode divide-gray-500' : ''}`}>
              {stats.map((stat, index) => (
                <tr key={index}>
                  <td className={`px-6 py-4 whitespace-nowrap text-center ${isDarkMode ? 'dark-mode' : ''}`}>{stat.value}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-center ${isDarkMode ? 'dark-mode' : ''}`}>{stat.count}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-center ${isDarkMode ? 'dark-mode' : ''}`}>%{stat.percentage}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
            <tr className={`bg-gray-50 font-bold ${isDarkMode ? 'dark-mode bg-gray-900' : ''}`}>
              <td className={`px-6 py-4 text-center ${isDarkMode ? 'button-mode bg-gray-800' : ''}`}>المجموع</td>
              <td className={`px-6 py-4 text-center ${isDarkMode ? 'button-mode bg-gray-800' : ''}`}>{total}</td>
              <td className={`px-6 py-4 text-center ${isDarkMode ? 'button-mode bg-gray-800' : ''}`}>100%</td>
            </tr>
          </tfoot>
          </table>
        </div>
      </div>
    );
  };

  const clearFilters = () => {
    setFilters({
      'الجنس': '',
      'الإعادة': '',
      'السوابق الصحية': '',
      'هل الأب متوفي': '',
      'هل الأم متوفية': '',
      'الجذع المشترك المرغوب': '',
      'هل تعاني من صعوبات دراسية': '',
      'هل لديك مشكل للمناقشة': ''
    });
  };

  const FilterModal = () => {
    const renderSelect = (name, options) => {
      // Add the "الكل" option to the beginning of the options array
      const allOption = { value: "", label: "الكل" };
      const combinedOptions = [allOption, ...options.map(opt => ({ value: opt, label: opt }))];

      return (
        <Select
          name={name}
          options={combinedOptions}
          className="mt-1"
          classNamePrefix="select"
          placeholder="الكل"
          noOptionsMessage={() => "لا توجد خيارات"}
          styles={{
            control: (base, state) => ({
              ...base,
              backgroundColor: isDarkMode ? '#1E293B' : '#ffffff', // Dark mode background
              border: `1px solid ${isDarkMode ? '#4B5563' : '#e2e8f0'}`, // Dark mode border
              borderRadius: '8px',
              boxShadow: state.isFocused ? `0 0 0 2px ${isDarkMode ? '#64748B' : '#94a3b8'}` : 'none', // Focus border color
              '&:hover': {
                borderColor: isDarkMode ? '#64748B' : '#94a3b8',
              },
              color: isDarkMode ? '#F1F5F9' : '#1E293B', // Text color
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: isDarkMode ? '#222529' : '#ffffff', // Dropdown background
              color: isDarkMode ? '#F1F5F9' : '#1E293B',
            }),
            option: (base, { isFocused, isSelected }) => ({
              ...base,
              backgroundColor: isSelected
                ? isDarkMode
                  ? '#64748B'
                  : '#222529'
                : isFocused
                ? isDarkMode
                  ? '#334155'
                  : '#F1F5F9'
                : 'transparent',
              color: isDarkMode ? '#F1F5F9' : '#1E293B',
            }),
            singleValue: (base) => ({
              ...base,
              color: isDarkMode ? '#F1F5F9' : '#1E293B', // Selected value text color
            }),
          }}
          
          onChange={(selectedOption) => {
            setFilters({ ...filters, [name]: selectedOption ? selectedOption.value : "" });
          }}
          value={combinedOptions.find(option => option.value === filters[name]) || null}
        />
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`bg-white rounded-lg p-6 max-w-xl w-full shadow-lg ${isDarkMode ? 'dark-mode' : ''}`}>
          <h3 className="text-lg font-medium mb-4">تصفية النتائج</h3>
          <div className="space-y-4">
            {Object.entries(filerFields).map(([section, fields]) => (
              <div key={section}>
                <h4 className="font-medium mb-2">{section}</h4>
                <div className={`grid grid-cols-2 gap-4 ${isDarkMode ? 'columnMenu-dark' : ''}`}>
                  {/* Row 1 */}
                  {fields.slice(0, 3).map((field) => (
                    <div key={field} className={`mb-2 ${isDarkMode ? 'nav-dark' : ''}`}>
                      <label className={`block text-sm font-medium text-gray-700 ${isDarkMode ? 'columnMenu-dark' : ''}`}>{field}</label>
                      {renderSelect(field, Array.from(
                        new Set(
                          data
                            .map((item) => {
                              const value = item[field];
                              if (Array.isArray(value)) {
                                return value.map((v) =>
                                  typeof v === "object" ? v.label || v.value : v
                                );
                              } else if (typeof value === "object" && value !== null) {
                                return value.label || value.value;
                              } else {
                                return value;
                              }
                            })
                            .flat()
                            .filter((v) => v !== undefined && v !== null)
                        )
                      ))}
                    </div>
                  ))}

                  {/* Row 2 */}
                  {fields.slice(3, 5).map((field) => (
                    <div key={field} className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">{field}</label>
                      {renderSelect(field, Array.from(
                        new Set(
                          data
                            .map((item) => {
                              const value = item[field];
                              if (Array.isArray(value)) {
                                return value.map((v) =>
                                  typeof v === "object" ? v.label || v.value : v
                                );
                              } else if (typeof value === "object" && value !== null) {
                                return value.label || value.value;
                              } else {
                                return value;
                              }
                            })
                            .flat()
                            .filter((v) => v !== undefined && v !== null)
                        )
                      ))}
                    </div>
                  ))}

                  {/* Row 3 */}
                  {fields.slice(5, 6).map((field) => (
                    <div key={field} className="mb-2 col-span-2">
                      <label className="block text-sm font-medium text-gray-700">{field}</label>
                      {renderSelect(field, Array.from(
                        new Set(
                          data
                            .map((item) => {
                              const value = item[field];
                              if (Array.isArray(value)) {
                                return value.map((v) =>
                                  typeof v === "object" ? v.label || v.value : v
                                );
                              } else if (typeof value === "object " && value !== null) {
                                return value.label || value.value;
                              } else {
                                return value;
                              }
                            })
                            .flat()
                            .filter((v) => v !== undefined && v !== null)
                        )
                      ))}
                    </div>
                  ))}

                  {/* Row 4 */}
                  {fields.slice(6, 8).map((field) => (
                    <div key={field} className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">{field}</label>
                      {renderSelect(field, Array.from(
                        new Set(
                          data
                            .map((item) => {
                              const value = item[field];
                              if (Array.isArray(value)) {
                                return value.map((v) =>
                                  typeof v === "object" ? v.label || v.value : v
                                );
                              } else if (typeof value === "object" && value !== null) {
                                return value.label || value.value;
                              } else {
                                return value;
                              }
                            })
                            .flat()
                            .filter((v) => v !== undefined && v !== null)
                        )
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end space-x-6 rtl:space-x-reverse">
            <button
              onClick={clearFilters}
              className={`flex items-center px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors ${isDarkMode ? 'button-dark hover:bg-gray-900' : 'button-dark'}`}
            >
              إلغاء
              <FilterX className="w-4 h-4 mr-2" />
            </button>
            <button
              onClick={() => setShowFilterModal(false)}
              className="flex items-center px-6 py-2 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              تطبيق
              <Filter className="w-4 h-4 mr-2" />
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`container mx-auto px-4 py-6 mt-16 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className={`mb-6 flex justify-between items-center ${isDarkMode ? 'nav-dark' : ''}`}>
        <h2 className="text-2xl font-bold">تحليل بيانات - {institution}</h2>
        <div className="flex space-x-4 gap-4">
        <button
          onClick={() => setShowFilterModal(true)}
            className={`flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${isDarkMode ? 'button-dark hover:bg-gray-900' : ''}`}
        >
          تصفية الجداول
          <Filter className="w-4 h-4 mr-2" />
        </button>
          <button
            onClick={printAllTables}
            className="flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            طباعة التقرير
            <Printer className="w-4 h-4 mr-2" />
          </button>
        </div>
      </div>

      {showFilterModal && <FilterModal />}
      {showChart && renderChart(calculateStats(showChart), `توزيع ${showChart}`)}

      {showAnalysisModal && (
        <Modal isOpen={showAnalysisModal} onClose={() => setShowAnalysisModal(false)} isDarkMode={isDarkMode}>
          {analysisContent}
        </Modal>
      )}

      {Object.entries(allFields).map(([section, fields]) => (
        <div key={section} className={`mb-8 ${isDarkMode ? 'dark-mode' : ''}`}>
          <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'table-white' : 'table-black'}`}>{section}</h3>
          {fields.map(field => renderAnalysisTable(field, `توزيع ${field}`))}
        </div>
      ))}
    </div>
  );
}