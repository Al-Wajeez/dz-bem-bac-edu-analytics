import React, { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';
import { Filter, BarChart, Printer, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import CustomModal from './Modal';

interface GlobalAnalysisPageProps {
  data: any[];
  isDarkMode: boolean; // Accept dark mode state as a prop
}

export function GlobalAnalysisPage({ data, isDarkMode }: GlobalAnalysisPageProps) {
  const [selectedField, setSelectedField] = useState<string>('الإعادة'); // Default field for chart
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false); // State for modal visibility
  const [showChartModal, setShowChartModal] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartTitle, setChartTitle] = useState<string>('');
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Define analysis fields
  const analysisFields = [
    'الجنس', 'الإعادة', 'القسم', 'السوابق الصحية', 'مكان', 'عدد الإخوة الذكور', 'عدد الاخوة الاناث', 'الرتبة في العائلة',
    'مهنة الاب', 'المستوى الدراسي للأب', 'هل الأب متوفي', 'مهنة الأم', 'المستوى الدراسي للأم', 'هل الأم متوفية',
    'هل الأبوين منفصلان', 'هل لديك كفيل', 'متابعة الأب', 'متابعة الأم', 'متابعة الكفيل', 'المواد المفضلة', 
    'المواد الصعبة', 'الجذع المشترك المرغوب', 'المواد المميزة للجذع', 'المهنة المستقبلية', 'المستوى الدراسي المطلوب', 'قطاع العمل المرغوب',
    'هل لك نشاط ترفيهي', 'أوقات الفراغ', 'هل لديك معلومات كافية عن مشروعك', 'هل تعاني من صعوبات دراسية', 'هل لديك مشكل للمناقشة'
  ];

  const checkFormCompletion = (item: any) => {
    const requiredFields = [
      'المؤسسة', 'المديرية', 'اللقب و الاسم', 'الجنس', 'الإعادة', 'القسم', 'السوابق الصحية', 'تاريخ الميلاد',
      'مكان الميلاد', 'العنوان', 'عدد الإخوة الذكور', 'عدد الاخوة الاناث', 'رتبته في العائلة', 'مهنة الاب',
      'المستوى الدراسي للأب', 'هل الأب متوفي', 'مهنة الأم', 'المستوى الدراسي للأم', 'هل الأم متوفية', 'هل الأبوين منفصلان',
      'هل لديه كفيل', 'متابعة الأب', 'متابعة الأم', 'متابعة الكفيل', 'المواد المفضلة', 'سبب تفضيلها', 'المواد الصعبة',
      'سبب صعوبتها', 'الجذع المشترك المرغوب', 'المواد المميزة للجذع', 'سبب اهتمامه بالدراسة',
      'ممن يطلب المساعدة عند الصعوبة', 'وسيلة أخرى لفهم الدروس', 'هل تشجعه معاملة الأستاذ', 'هل تحفزه مكافأة والديه',
      'هل ناقش مشروعه الدراسي مع والديه', 'سبب عدم مناقشته لمشروعه الدراسي', 'سبب اهتمامه بالدراسة',
      'أسباب أخرى للاهتمام بالدراسة', 'المهنة التي يتمناها في المستقبل', 'سبب اختيارها', 'المستوى الدراسي الذي تتطلبه المهنة',
      'القطاع المرغوب للعمل فيه', 'قطاعات أخرى مهتم بها', 'هل لديه نشاط ترفيهي', 'كيف يقضي أوقات فراغه', 'مجالات أخرى للترفيه',
      'هل لديه معلومات كافية حول مشروعه المستقبلي', 'ما المعلومات التي يحتاجها', 'هل يعاني من صعوبات دراسية', 'ما هي الصعوبات',
      'هل لديه مشكلة يريد مناقشتها','ما هي المشكلة'
    ];

    const numericFields = ['عدد الإخوة الذكور', 'عدد الاخوة الاناث', 'رتبته في العائلة'];
  
    const missingFields = requiredFields.filter(field => {
      const value = item[field];
  
      // Allow 0 as a valid entry for numeric fields
      if (numericFields.includes(field)) {
        return value === null || value === undefined || value === '';
      }
  
      // For all other fields, check if they are empty
      return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
      console.log(`❌ Missing fields for student in ${item['القسم']}:`, missingFields);
    }
  
    return missingFields.length === 0;
  };

  // Function to calculate participation analysis by section
  const participationBySection = () => {
    const sections = Array.from(new Set(data.map(item => item['القسم'])));
    
    return sections.map(section => {
      const sectionData = data.filter(item => item['القسم'] === section);
      const totalParticipants = sectionData.length;
      
      // Use checkFormCompletion instead of checkCompletion
      const completeCount = sectionData.filter(item => checkFormCompletion(item)).length;
      const incompleteCount = totalParticipants - completeCount;
      const percentage = totalParticipants > 0 ? (completeCount / totalParticipants) * 100 : 0;
  
      return { 
        section, 
        totalParticipants: completeCount, 
        incompleteCount, 
        percentage 
      };
    });
  };  

  const sectionStats = participationBySection();

  const calculateStats = () => {
    if (!data || data.length === 0 || !selectedField) {
      console.warn('No data available or no field selected'); // Debugging line
      return { uniqueValues: [], fieldValues: [] };
    }

    // Count occurrences of each unique value
    const valueCounts = data.reduce((acc, item) => {
      let value = item[selectedField];

      // Handle multi-select arrays
      if (Array.isArray(value)) {
        if (value.length === 0) {
          acc['بدون إجابة'] = (acc['بدون إجابة'] || 0) + 1;
        } else {
          // Process each value in the array separately
          value.forEach(v => {
            let displayValue;
            if (typeof v === 'object' && v !== null) {
              // Handle object with label/value properties
              displayValue = v.label || v.value;
            } else {
              // Handle primitive values
              displayValue = v;
            }
            if (displayValue) {
              acc[displayValue] = (acc[displayValue] || 0) + 1;
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
            acc[trimmedValue] = (acc[trimmedValue] || 0) + 1;
          }
        });
      }
      // Handle single values
      else if (typeof value === 'object' && value !== null) {
        // Handle single object with label/value properties
        const displayValue = value.label || value.value;
        if (displayValue) {
          acc[displayValue] = (acc[displayValue] || 0) + 1;
        } else {
          acc['بدون إجابة'] = (acc['بدون إجابة'] || 0) + 1;
        }
      } else {
        // Handle primitive values
        if (value) {
          acc[value] = (acc[value] || 0) + 1;
        } else {
          acc['بدون إجابة'] = (acc['بدون إجابة'] || 0) + 1;
        }
      }

      return acc;
    }, {} as Record<string, number>);

    const uniqueValues = Object.keys(valueCounts);
    const fieldValues = Object.values(valueCounts);

    return { uniqueValues, fieldValues };
  };

  const stats = calculateStats();

  const allFields = {
    'المعلومات العامة': ['الجنس','الإعادة','السوابق الصحية','عدد الإخوة الذكور','عدد الاخوة الاناث','رتبته في العائلة'],
    'الجانب العائلي': ['مهنة الاب','المستوى الدراسي للأب','هل الأب متوفي','مهنة الأم','المستوى الدراسي للأم','هل الأم متوفية','هل الأبوين منفصلان','هل لديه كفيل','متابعة الأب','متابعة الأم','متابعة الكفيل'],
    'الجانب الدراسي': ['المواد المفضلة','المواد الصعبة','الجذع المشترك المرغوب','المواد المميزة للجذع','سبب اهتمامه بالدراسة','ممن يطلب المساعدة عند الصعوبة','هل تشجعه معاملة الأستاذ','هل تحفزه مكافأة والديه','هل ناقش مشروعه الدراسي مع والديه','سبب اهتمامه بالدراسة راجع إلى',],
    'الجانب المهني': ['المهنة التي يتمناها في المستقبل','المستوى الدراسي الذي تتطلبه المهنة','القطاع المرغوب للعمل فيه',],
    'الجانب الترفيهي': ['هل لديه نشاط ترفيهي','كيف يقضي أوقات فراغه'],
    'الجانب الإعلامي': ['هل لديه معلومات كافية حول مشروعه المستقبلي'],
    'الجانب النفسي البيداغوجي': ['هل يعاني من صعوبات دراسية','هل لديه مشكلة يريد مناقشتها']
  };

   // Calculate modal content dimensions when modal opens
   useEffect(() => {
    if (showChartModal && modalContentRef.current) {
      const { width, height } = modalContentRef.current.getBoundingClientRect();
      setChartDimensions({ width, height });
    }
  }, [showChartModal]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (showChartModal && modalContentRef.current) {
        const { width, height } = modalContentRef.current.getBoundingClientRect();
        setChartDimensions({ width, height });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showChartModal]);

  const groupDataBySection = (data: any[]) => {
    return data.reduce((acc, item) => {
      const section = item['القسم'] || 'غير محدد';
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(item);
      return acc;
    }, {} as Record<string, any[]>);
  };

  const generateCrossTabulatedData = (groupedData: Record<string, any[]>, field: string) => {
    const crossTabulatedData: Record<string, Record<string, number>> = {};
    const totalCounts: Record<string, number> = {};

    for (const section in groupedData) {
      crossTabulatedData[section] = {};
      totalCounts[section] = groupedData[section].length; // Set total count to number of students in section

      groupedData[section].forEach((item) => {
        let value = item[field];

        // Handle multi-select arrays
        if (Array.isArray(value)) {
          if (value.length === 0) {
            crossTabulatedData[section]['بدون إجابة'] = (crossTabulatedData[section]['بدون إجابة'] || 0) + 1;
          } else {
            // Process each value in the array separately
            value.forEach(v => {
              if (typeof v === 'object' && v !== null) {
                // Handle object with label/value properties
                const displayValue = v.label || v.value || 'غير محدد';
                crossTabulatedData[section][displayValue] = (crossTabulatedData[section][displayValue] || 0) + 1;
              } else {
                // Handle primitive values
                crossTabulatedData[section][v] = (crossTabulatedData[section][v] || 0) + 1;
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
              crossTabulatedData[section][trimmedValue] = (crossTabulatedData[section][trimmedValue] || 0) + 1;
            }
          });
        }
        // Handle single object values
        else if (typeof value === 'object' && value !== null) {
          const displayValue = value.label || value.value || 'غير محدد';
          crossTabulatedData[section][displayValue] = (crossTabulatedData[section][displayValue] || 0) + 1;
        }
        // Handle primitive values
        else if (value) {
          crossTabulatedData[section][value] = (crossTabulatedData[section][value] || 0) + 1;
        } else {
          crossTabulatedData[section]['بدون إجابة'] = (crossTabulatedData[section]['بدون إجابة'] || 0) + 1;
        }
      });
    }

    return { crossTabulatedData, totalCounts };
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

    const field = tableId.replace('table-', '');

    const win = window.open('', '', 'height=700,width=700');
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>برنامج الوجيز - إستبيان الميول الإهتمامات</title>
          <style>
            @page { size: landscape; }
            body { direction: rtl; font-family: 'Cairo', sans-serif; }
            table { min-width: 100%; border-collapse: collapse; margin: 1rem 0; }
            th, td { border: 1px solid #e5e7eb; padding: 0.75rem 1.5rem; text-align: center; }
            thead tr { background-color: #f9fafb; }
            tbody tr { background-color: white; }
            tfoot tr { background-color: #f9fafb; font-weight: 600; }
          </style>
        </head>
        <body>
          <h3 style="text-align: center; font-size: 1.2em; margin: 20px 0 10px; color: #2d3748;">
            تحليل جدول توزيع التلاميذ حسب ${field}
          </h3>
          ${printContent}
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  const renderCrossTabulatedTable = (
    crossTabulatedData: Record<string, Record<string, number>>,
    totalCounts: Record<string, number>,
    field: string
  ) => {
    const sections = Object.keys(crossTabulatedData);
    const tableId = `table-${field}`;
    const categories = new Set<string>();

    for (const section in crossTabulatedData) {
      for (const value in crossTabulatedData[section]) {
        categories.add(value);
      }
    }

    const numberOfSections = sections.length;

    // Prepare data for the chart
    const chartData = Array.from(categories).map((category) => ({
      x: sections, // X-axis: Sections (e.g., "السنة الرابعة م 01", "السنة الرابعة م 02")
      y: sections.map((section) => crossTabulatedData[section][category] || 0), // Y-axis: Counts for each section
      name: category, // Legend: Category (e.g., "أنثى", "ذكر")
      type: 'bar', // Chart type
    }));

    return (
      <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className={`flex justify-between items-center mb-4 ${isDarkMode ? 'dark-mode' : ''}`}>
          <h3 className="text-lg font-medium">تحليل {field} حسب القسم</h3>
          <div className={`flex space-x-2 ${isDarkMode ? 'dark-mode' : ''}`}>
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
          </div>
        </div>
        <table id={tableId} className={`min-w-full ${isDarkMode ? 'dark-mode' : ''}`}>
          <thead>
            <tr className={`bg-gray-50 ${isDarkMode ? 'dark-mode' : ''}`}>
              <th colSpan={2} rowSpan={3} className={`px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider ${isDarkMode ? 'button-dark bg-gray-800' : ''}`}>
                {field}
              </th>
              <th colSpan={numberOfSections * 2} className={`px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider ${isDarkMode ? 'button-dark bg-gray-800' : ''}`}>
                الأقسام
              </th>
            </tr>
            <tr className={`bg-gray-50 ${isDarkMode ? 'dark-mode' : ''}`}>
              {sections.map((section) => (
                <th key={section} colSpan={2} className={`px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider ${isDarkMode ? 'button-dark bg-gray-800' : ''}`}>
                  {section}
                </th>
              ))}
            </tr>
            <tr className={`bg-gray-50 ${isDarkMode ? 'dark-mode' : ''}`}>
              {sections.map((section) => (
                <React.Fragment key={section}>
                  <th className={`px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider ${isDarkMode ? 'button-dark bg-gray-800' : ''}`}>
                    التعداد
                  </th>
                  <th className={`px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider ${isDarkMode ? 'button-dark bg-gray-800' : ''}`}>
                    النسبة
                  </th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody className={`bg-white divide-y divide-gray-200 ${isDarkMode ? 'dark-mode divide-gray-500' : ''}`}>
            {Array.from(categories).map((category) => (
              <tr key={category}>
                <td colSpan={2} className={`px-6 py-4 whitespace-nowrap text-center ${isDarkMode ? 'dark-mode' : ''}`}>
                  {category}
                </td>
                {sections.map((section) => {
                  const count = crossTabulatedData[section][category] || 0;
                  const total = totalCounts[section] || 1;
                  const percentage = ((count / total) * 100).toFixed(2);
                  return (
                    <React.Fragment key={`${section}-${category}`}>
                      <td className={`px-6 py-4 whitespace-nowrap text-center ${isDarkMode ? 'dark-mode' : ''}`}>{count}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-center ${isDarkMode ? 'dark-mode' : ''}`}>{percentage} %</td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-bold">
              <td colSpan={2} className={`px-6 py-4 text-center ${isDarkMode ? 'dark-mode bg-gray-800' : ''}`}>
                المجموع
              </td>
              {sections.map((section) => {
                const totalCount = totalCounts[section] || 0;
                const totalPercentage = ((totalCount / data.length) * 100).toFixed(2);
                return (
                  <React.Fragment key={section}>
                    <td className={`px-6 py-4 text-center ${isDarkMode ? 'dark-mode bg-gray-800' : ''}`}>{totalCount}</td>
                    <td className={`px-6 py-4 text-center ${isDarkMode ? 'dark-mode bg-gray-800' : ''}`}>{totalPercentage} %</td>
                  </React.Fragment>
                );
              })}
            </tr>
          </tfoot>
        </table>

        {/* Chart Modal */}
        <CustomModal isOpen={showChartModal}onClose={() => setShowChartModal(false)} isDarkMode={isDarkMode}>
          <div ref={modalContentRef} className="w-full h-full flex flex-col">
            <Plot
              key={chartTitle} // Force re-render when chartTitle changes
              data={chartData}
              layout={{
                title: chartTitle,
                width: chartDimensions.width,
                height: chartDimensions.height - 100, // Adjust for padding/margins
                barmode: 'group',
                xaxis: { title: 'الأقسام' },
                yaxis: { title: 'التعداد' },
                showlegend: true,
                legend: {
                  orientation: 'h',  // Horizontal legend
                  y: -0.2,           // Move legend below the chart
                  x: 0.5,            // Center align the legend
                  xanchor: 'center', // Anchor to center
                  yanchor: 'top',
                },
                paper_bgcolor: isDarkMode ? '#222529' : '', // Full background
                plot_bgcolor: isDarkMode ? '#222529' : '', // Inner plot area
                font: { color: isDarkMode ? '#ffffff' : '',},
              }}
            />
          </div>
        </CustomModal>
      </div>
    );
  };

  const groupedData = groupDataBySection(data);

  const printAllTables = () => {
    const tables = document.querySelectorAll('table');
    
    // Gather all fields for analysis
    const printContent = Array.from(tables).map((table, index) => {
      const field = Object.values(allFields).flat()[index];
      const stats = calculateStats(field); // Call without arguments
      const total = stats.fieldValues.reduce((sum, value) => sum + (value as number), 0); // Calculate total

      // Generate analysis HTML
      const tabletitleHTML = `
        <div class="tabletitle-section">
          <h3 style="text-align: center; font-size: 1.2em; margin: 20px 0 10px; color: #2d3748;">
            الجدول رقم (${index + 1}) - يمثل توزيع التلاميذ حسب ${field}
          </h3>
        </div>
      `;

      return `${tabletitleHTML}${table.outerHTML}`;
    }).join('<div style="page-break-after: always;"></div>');

    const win = window.open('', '', 'height=700,width=700');
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>برنامج الوجيز - إستبيان الميول الإهتمامات</title>
          <style>
            @page { size: landscape; }
            body { direction: rtl; font-family: 'Cairo', sans-serif; }
            table { min-width: 100%; border-collapse: collapse; margin: 1rem 0; }
            th, td { border: 1px solid #e5e7eb; padding: 0.75rem 1.5rem; text-align: center; }
            thead tr { background-color: #f9fafb; }
            tbody tr { background-color: white; }
            tfoot tr { background-color: #f9fafb; font-weight: 600; }
          </style>
        </head>
        <body>
          <h1 style="text-align: center;">تقرير شامل</h1>
          ${printContent}
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  return (
    <div className="container mx-auto px-4 py-6 mt-16">
      
      {/* Button to Open Filter Modal */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-6">تحليل شامل للبيانات</h2>
        <div className="flex space-x-4 gap-4">
          <button
            onClick={printAllTables}
            className="flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            طباعة التقرير
            <Printer className="w-4 h-4 mr-2" />
          </button>
        </div>
        {/*
        <button
          onClick={() => setShowFilterModal(true)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
           اختر السؤال لتصفية الرسم البياني
          <Filter className="w-4 h-4 mr-2" />
        </button>
        */}
      </div>

      {/* Plotly Chart 
      <div>
      
        <Plot
          data={[
            {
              x: stats.uniqueValues,
              y: stats.fieldValues,
              type: 'bar',
              marker: {
                color: stats.uniqueValues.map((_, index) => 
                  [
                    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
                    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
                  ][index % 8]
                ),
              }
            },
          ]}
          layout={{ 
            title: `تحليل البيانات حسب ${selectedField}`,
            autosize: true,
            responsive: true,
            showlegend: false,
            margin: { t: 50, l: 150, r: 50, b: 50 },
          }}
          config={{ displayModeBar: true }}
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
        />
      </div>*/}

      {/* Participation Analysis Table */}
      <div className="overflow-x-auto mb-8">
        <table className={`min-w-full ${isDarkMode ? 'table-dark' : ''}`}>
          <thead>
            <tr className={`bg-gray-50 ${isDarkMode ? 'dark-mode' : ''}`}>
              <th className={`px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider ${isDarkMode ? 'button-dark bg-gray-800' : ''}`}>القسم</th>
              <th className={`px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider ${isDarkMode ? 'button-dark bg-gray-800' : ''}`}>إجمالي المشاركين</th>
              <th className={`px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider ${isDarkMode ? 'button-dark bg-gray-800' : ''}`}>عدد غير المكتملين</th>
              <th className={`px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider ${isDarkMode ? 'button-dark bg-gray-800' : ''}`}>النسبة المئوية</th>
            </tr>
          </thead>
          <tbody>
            {sectionStats.map(({ section, totalParticipants, incompleteCount, percentage }) => (
              <tr key={section} className="bg-white">
                <td className={`px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 ${isDarkMode ? 'dark-mode' : ''}`}>{section}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 ${isDarkMode ? 'dark-mode' : ''}`}>{totalParticipants}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 ${isDarkMode ? 'dark-mode' : ''}`}>{incompleteCount}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 ${isDarkMode ? 'dark-mode' : ''}`}>{percentage.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white z-60">
            <h3 className="text-lg font-medium text-gray-900 mb-4">اختر السؤال</h3>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="block w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              {analysisFields.map(field => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
            <div className="mt-4 flex justify-end">
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
      )}

      <div className="container mx-auto px-4 py-8">
      {Object.keys(allFields).map((section) => (
        <div key={section} className="mb-8">
          <h3 className="text-xl font-bold mb-4">{section}</h3>
          {allFields[section].map((field) => {
            const { crossTabulatedData, totalCounts } = generateCrossTabulatedData(groupedData, field);
            return <div key={field}>{renderCrossTabulatedTable(crossTabulatedData, totalCounts, field)}</div>;
          })}
        </div>
      ))}
    </div>


    </div>
  );

}