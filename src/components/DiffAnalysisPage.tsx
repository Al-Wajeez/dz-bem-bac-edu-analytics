import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { BarChart, Printer, FileSpreadsheet } from 'lucide-react';
import Plot from 'react-plotly.js';
import CustomModal from './Modal';

interface DiffAnalysisPageProps {
  data: any[];
}

export function DiffAnalysisPage({ data }: DiffAnalysisPageProps) {
  const [showChartModal, setShowChartModal] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartTitle, setChartTitle] = useState<string>('');
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });
  const modalContentRef = useRef<HTMLDivElement>(null);

  const allFields = {
    'المعلومات العامة': ['الجنس', 'الإعادة', 'السوابق الصحية'],
    'الجانب العائلي': ['مهنة الاب', 'المستوى الدراسي للأب'],
    'الجانب الدراسي': ['المواد المفضلة', 'المواد الصعبة'],
    'الجانب المهني': ['المهنة التي يتمناها في المستقبل'],
    'الجانب الترفيهي': ['هل لديه نشاط ترفيهي'],
    'الجانب الإعلامي': ['هل لديه معلومات كافية حول مشروعه المستقبلي'],
    'الجانب النفسي البيداغوجي': ['هل يعاني من صعوبات دراسية'],
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
      totalCounts[section] = 0;

      groupedData[section].forEach((item) => {
        const value = item[field] || 'غير محدد';
        crossTabulatedData[section][value] = (crossTabulatedData[section][value] || 0) + 1;
        totalCounts[section] += 1;
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
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">تحليل {field} حسب القسم</h3>
          <div className="flex space-x-2">
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
          <table id={tableId} className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
              <th colSpan={2} rowSpan={3} className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                {field}
              </th>
              <th colSpan={numberOfSections * 2} className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                الأقسام
                </th>
            </tr>
            <tr className="bg-gray-50">
              {sections.map((section) => (
                <th key={section} colSpan={2} className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {section}
                  </th>
                ))}
              </tr>
              <tr className="bg-gray-50">
              {sections.map((section) => (
                <React.Fragment key={section}>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      التعداد
                    </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      النسبة
                    </th>
                </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {Array.from(categories).map((category) => (
              <tr key={category}>
                <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-center">
                  {category}
                </td>
                {sections.map((section) => {
                  const count = crossTabulatedData[section][category] || 0;
                  const total = totalCounts[section] || 1;
                  const percentage = ((count / total) * 100).toFixed(2);
                    return (
                    <React.Fragment key={`${section}-${category}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-center">{count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">{percentage} %</td>
                    </React.Fragment>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-bold">
              <td colSpan={2} className="px-6 py-4 text-center">
                المجموع
              </td>
              {sections.map((section) => {
                const totalCount = totalCounts[section] || 0;
                const totalPercentage = ((totalCount / data.length) * 100).toFixed(2);
                  return (
                  <React.Fragment key={section}>
                    <td className="px-6 py-4 text-center">{totalCount}</td>
                    <td className="px-6 py-4 text-center">{totalPercentage} %</td>
                  </React.Fragment>
                  );
                })}
              </tr>
            </tfoot>
          </table>

        {/* Chart Modal */}
        <CustomModal isOpen={showChartModal} onClose={() => setShowChartModal(false)}>
          <div ref={modalContentRef} className="w-full h-full">
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
              }}
            />
          </div>
        </CustomModal>
      </div>
    );
  };

  const groupedData = groupDataBySection(data);

  return (
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
  );
}