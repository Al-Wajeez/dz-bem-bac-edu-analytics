import React, { useState, useMemo, useRef, useEffect } from 'react';
import Select from 'react-select';
import { Controller } from 'react-hook-form';
import * as XLSX from 'xlsx';
import { X, BarChart, Printer, FileSpreadsheet, Filter, FilterX, NotebookPen, Search, ArrowDownAZ, ArrowDownZA, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Rows, Columns, Layers } from 'lucide-react';
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

interface AdvanceDirective {
  data: any[];
  isDarkMode: boolean; // Accept dark mode state as a prop

}

interface ColumnConfig {
  key: string;
  label: string;
}

export function AdvanceDirectiveAnalysisPage({ data, isDarkMode }: AdvanceDirective) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showChart, setShowChart] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisContent, setAnalysisContent] = useState<JSX.Element | null>(null);
  
  // New state for interactive table
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' | '' } | null>(null);
  const [tableFilters, setTableFilters] = useState<Record<string, any>>({});
  const [showTableFilterModal, setShowTableFilterModal] = useState(false);
  
  // New state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showPageSizeDropdown, setShowPageSizeDropdown] = useState(false); // State for page size dropdown
  const pageSizeDropdownRef = useRef<HTMLDivElement>(null); // Ref for page size dropdown
  
  // New state for column visibility
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({});
  const [showColumnModal, setShowColumnModal] = useState(false);
  const columnDropdownRef = useRef<HTMLDivElement>(null);

  // New state for grouping
  const [groupingKey, setGroupingKey] = useState<string | null>(null);
  const [showGroupingDropdown, setShowGroupingDropdown] = useState(false);
  const groupingDropdownRef = useRef<HTMLDivElement>(null);

  // Assuming data is an array of objects
  const directorate = data.length > 0 ? data[0]['المديرية'] : ''; // Get the first entry's directorate
  const institution = data.length > 0 ? data[0]['المؤسسة'] : ''; // Get the first entry's institution

  const allFields = {
    'المعلومات العامة': ['الجنس','الإعادة','القسم'],
    'جانب ضبط الرغبات الأكاديمية': ['رغبة التلميذ (بطاقة الرغبات الأولية) - الفصل الثاني'],
    'جانب التوجيه': ['التوجيه المسبق (ت.م)','التوافق مع الرغبة (ت.م)', 'ثبات الرغبة (ت.م)'],
  };

  const filerFields = {
    '': ['الجنس','الإعادة','السوابق الصحية','هل الأب متوفي','هل الأم متوفية','الجذع المشترك المرغوب','هل يعاني من صعوبات دراسية','هل لديه مشكلة يريد مناقشتها']
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
          </div>
        </div>
      </div>
    );
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

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  const printAllTables = (tableId: string) => {
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
          <title>برنامج الوجيز - التوجيه المدرسي</title>
          <style>
            body { direction: rtl; font-family: 'Cairo', sans-serif; }
            table { min-width: 100%; border-collapse: collapse; margin: 1rem 0; }
            th, td { border: 1px solid #e5e7eb; padding: 1rem 0.2rem; text-align: center; }
            thead tr { background-color: #f9fafb; }
            tbody tr { background-color: white; }
            tfoot tr { background-color: #f9fafb; font-weight: 600; }
            @media print {
              .print\\:hidden { 
                display: none !important; 
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
          ${analysisHTML}
        </body>
      </html>
    `);
  
    win.document.close();
    win.print();
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
              title="عرض الرسم البياني"
            >
              <BarChart className="w-5 h-5" />
            </button>
            <button
              onClick={() => printAllTables(tableId)}
              className="p-2 text-gray-600 hover:text-gray-800"
              title="طباعة الجدول"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={() => exportToExcel(tableId)}
              className="p-2 text-green-600 hover:text-green-800"
              title="تصدير إلى ملف إكسل"
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
              title="توليد التحليل النوعي"
            >
              <NotebookPen className="w-5 h-5" />
            </button>
  
          </div>
        </div>
        <div className="overflow-x-auto">
          <table id={tableId} className={`min-w-full ${isDarkMode ? 'dark-mode' : ''}`}>
            <thead>
              <tr className={`bg-gray-50 ${isDarkMode ? 'dark-mode' : ''}`}>
                <th className={`px-6 py-3 text-center text-sm font-bold text-gray-500 uppercase tracking-wider ${isDarkMode ? 'button-dark bg-gray-800' : ''}`}>
                  القيمة
                </th>
                <th className={`px-6 py-3 text-center text-sm font-bold text-gray-500 uppercase tracking-wider ${isDarkMode ? 'button-dark bg-gray-800' : ''}`}>
                  العدد
                </th>
                <th className={`px-6 py-3 text-center text-sm font-bold text-gray-500 uppercase tracking-wider ${isDarkMode ? 'button-dark bg-gray-800' : ''}`}>
                  النسبة المئوية
                </th>
              </tr>
            </thead>
            <tbody className={`bg-white divide-y divide-gray-200 ${isDarkMode ? 'dark-mode' : ''}`}>
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

                  {/* Row 3 */}
                  {fields.slice(5, 6).map((field) => (
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
  
  // New function to handle sorting
  const requestSort = (key: string) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: 'ascending' }; // First click: Ascending
      }
      if (prev.direction === 'ascending') {
        return { key, direction: 'descending' }; // Second click: Descending
      }
      return null; // Third click: Reset (no sorting)
    });
  };
  
  // New function to get sorted and filtered data for the interactive table
  const getFilteredAndSortedData = () => {
    let filteredData = [...data];
    
    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter(item => 
        Object.values(item).some(val => 
          val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Apply column filters
    Object.entries(tableFilters).forEach(([key, value]) => {
      if (value) {
        filteredData = filteredData.filter(item => 
          item[key] && item[key].toString() === value.toString()
        );
      }
    });
    
    // Apply sorting
    if (sortConfig) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === bValue) return 0;
        
        // Handle numeric values
        if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
          return sortConfig.direction === 'ascending' 
            ? Number(aValue) - Number(bValue)
            : Number(bValue) - Number(aValue);
        }
        
        // Handle string values (case-insensitive)
        const strA = String(aValue).toLowerCase();
        const strB = String(bValue).toLowerCase();
        if (strA < strB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (strA > strB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    // Apply grouping sort *after* general sort if grouping is active
    if (groupingKey) {
      filteredData.sort((a, b) => {
        const groupA = a[groupingKey] || '' ; // Handle potential null/undefined
        const groupB = b[groupingKey] || '' ;
        
        // Keep original sort order within the same group
        if (groupA === groupB) return 0; 
        
        // Group sorting logic (case-insensitive strings)
        const strA = String(groupA).toLowerCase();
        const strB = String(groupB).toLowerCase();
        if (strA < strB) return -1;
        if (strA > strB) return 1;
        return 0;
      });
    }
    
    return filteredData;
  };
  
  // Function to get sorted, filtered, and paginated data
  const getPaginatedData = () => {
    const filteredSortedData = getFilteredAndSortedData();
    const startIndex = (currentPage - 1) * pageSize;
    // Return data slice along with original index for stable numbering
    return filteredSortedData.slice(startIndex, startIndex + pageSize).map((row, index) => ({
      row,
      originalIndex: filteredSortedData.findIndex(item => item === row) // Find index in full sorted list
    }));
  };
  
  // Effect to handle clicks outside the page size dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pageSizeDropdownRef.current && !pageSizeDropdownRef.current.contains(event.target as Node)) {
        setShowPageSizeDropdown(false);
      }
    };

    if (showPageSizeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPageSizeDropdown]);

  // Effect to handle clicks outside the grouping dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (groupingDropdownRef.current && !groupingDropdownRef.current.contains(event.target as Node)) {
        setShowGroupingDropdown(false);
      }
    };
    if (showGroupingDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showGroupingDropdown]);

  // New function to handle printing the entire interactive table
  const printFullInteractiveTable = () => {
    const fullData = getFilteredAndSortedData();
    const tableId = 'interactive-table';

    // Define columns again here or pass them if needed (ensure consistency)
    const allColumnsForPrint = [
      { key: 'اللقب و الاسم', label: 'اللقب و الاسم' },
      { key: 'تاريخ الميلاد', label: 'تاريخ الميلاد' },
      { key: 'الجنس', label: 'الجنس' },
      { key: 'الإعادة', label: 'الإعادة' },
      { key: 'القسم', label: 'القسم' },
      { key: 'معدل الفصلين (الأول والثاني)', label: 'معدل الفصلين' },
      { key: 'رغبة التلميذ (بطاقة الرغبات الأولية) - الفصل الثاني', label: 'رغبة التلميذ (بطاقة الرغبات الأولية)' },
      { key: 'شعبة آداب وفلسفة (ت.م)', label: 'شعبة آداب وفلسفة' },
      { key: 'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.م)', label: 'ترتيب التلميذ' },
      { key: 'شعبة اللغات الأجنبية (ت.م)', label: 'شعبة اللغات الأجنبية' },
      { key: 'ترتيب التلميذ (اللغات الأجنبية) (ت.م)', label: 'ترتيب التلميذ (اللغات الأجنبية)' },
      { key: 'التوجيه المسبق (ت.م)', label: 'التوجيه المسبق' },
      { key: 'التوافق مع الرغبة (ت.م)', label: 'التوافق مع الرغبة' },
      { key: 'ثبات الرغبة (ت.م)', label: 'ثبات الرغبة' }
    ];
    const columnsToRender = allColumnsForPrint.filter(col => visibleColumns[col.key]);

    // Generate table header HTML
    const tableHeader = `
      <thead>
        <tr style="background-color: #f9fafb;">
          <th style="border: 1px solid #e5e7eb; padding: 0.5rem; text-align: center;">الرقم</th>
          ${columnsToRender.map(column => `
            <th style="border: 1px solid #e5e7eb; padding: 0.5rem; text-align: center;">${column.label}</th>
          `).join('')}
        </tr>
      </thead>
    `;

    // Generate table body HTML iterating over the FULL data
    const tableBody = `
      <tbody>
        ${fullData.map((row, index) => `
          <tr style="background-color: white;">
            <td style="border: 1px solid #e5e7eb; padding: 0.5rem; text-align: center;">${index + 1}</td>
            ${columnsToRender.map(column => `
              <td style="border: 1px solid #e5e7eb; padding: 0.5rem; text-align: center;">${row[column.key] || '-'}</td>
            `).join('')}
          </tr>
        `).join('')}
      </tbody>
    `;

    const fullTableHTML = `<table id="${tableId}" style="width: 100%; border-collapse: collapse; margin: 1rem 0;">${tableHeader}${tableBody}</table>`;

    // Re-use the header/footer print structure if needed, or simplify
    const firstContent = `
      <table border="0" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <tr>
          <td colspan="2" style="text-align: center; border: 2px solid #ffffff;">
            <strong>الجمهورية الجزائرية الديمقراطية الشعبية</strong><br>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: center; padding-bottom: 10px; border: 2px solid #ffffff;">
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
            <p style="font-size: 2rem; font-weight: bold; margin: 3rem 0 0 0;">حوصلة حول:</p><br>
            <p style="font-size: 3.5rem; font-weight: bold; margin: 1rem;">محضر التوجيه المسبق</p><br>
            <p style="font-size: 2rem; font-weight: bold; margin: 0 0 2rem 0;;">السنة الأولى جدع مشترك آداب</p>
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
            th, td { border: 1px solid #e5e7eb; padding: 1rem 0.2rem; text-align: center; }
            thead tr { background-color: #f9fafb; }
            tbody tr { background-color: white; }
            tfoot tr { background-color: #f9fafb; font-weight: 600; }
            @media print {
              .print\\:hidden { 
                display: none !important; 
              }
            }
          </style>
        </head>
        <body>
          ${firstContent}
          <div style="page-break-before: always;"></div>
          ${fullTableHTML}
        </body>
      </html>
    `);

    win.document.close();
    win.focus(); // Ensure the window gets focus
    // Delay print slightly to allow rendering
    setTimeout(() => {
      win.print();
      win.close();
    }, 500);
  };

  // New function to render the interactive table
  const renderInteractiveTable = () => {
    const allColumns = [
      // { key: 'الرقم', label: 'الرقم' }, // We render index separately
      { key: 'اللقب و الاسم', label: 'اللقب و الاسم' },
      { key: 'تاريخ الميلاد', label: 'تاريخ الميلاد' },
      { key: 'الجنس', label: 'الجنس' },
      { key: 'الإعادة', label: 'الإعادة' },
      { key: 'القسم', label: 'القسم' },
      { key: 'معدل الفصلين (الأول والثاني)', label: 'معدل الفصلين' },
      { key: 'رغبة التلميذ (بطاقة الرغبات الأولية) - الفصل الثاني', label: 'رغبة التلميذ (بطاقة الرغبات الأولية)' },
      { key: 'شعبة آداب وفلسفة (ت.م)', label: 'شعبة آداب وفلسفة' },
      { key: 'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.م)', label: 'ترتيب التلميذ' },
      { key: 'شعبة اللغات الأجنبية (ت.م)', label: 'شعبة اللغات الأجنبية' },
      { key: 'ترتيب التلميذ (اللغات الأجنبية) (ت.م)', label: 'ترتيب التلميذ (اللغات الأجنبية)' },
      { key: 'التوجيه المسبق (ت.م)', label: 'التوجيه المسبق' },
      { key: 'التوافق مع الرغبة (ت.م)', label: 'التوافق مع الرغبة' },
      { key: 'ثبات الرغبة (ت.م)', label: 'ثبات الرغبة' }
    ];
    const excludedKeys = [
      'تاريخ الميلاد',
      'الإعادة',
      'معدل الفصلين (الأول والثاني)',
      'رغبة التلميذ (بطاقة الرغبات الأولية) - الفصل الثاني',
      'شعبة آداب وفلسفة (ت.م)',
      'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.م)',
      'شعبة اللغات الأجنبية (ت.م)',
      'ترتيب التلميذ (اللغات الأجنبية) (ت.م)']
    
    // Initialize visible columns state if not already set
    if (Object.keys(visibleColumns).length === 0) {
      const initialVisibleColumns: Record<string, boolean> = {};
      allColumns.forEach(col => {
        initialVisibleColumns[col.key] = !excludedKeys.includes(col.key);
      });
      setVisibleColumns(initialVisibleColumns);
    }
    
    const columnsToRender = allColumns.filter(col => visibleColumns[col.key]);
    
    const paginatedData = getPaginatedData();
    const filteredTotal = getFilteredAndSortedData().length;
    const totalPages = Math.ceil(filteredTotal / pageSize);
    const tableId = 'interactive-table';

    const goToPage = (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page on page size change
        setShowPageSizeDropdown(false); // Close dropdown after selection
    };

    const handleGroupingChange = (key: string | null) => {
      setGroupingKey(key);
      setCurrentPage(1); // Reset page when grouping changes
      setShowGroupingDropdown(false);
  };
  
  return (
      <div className={`mb-8 bg-white rounded-lg shadow p-6 ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">محضر التوجيه المسبق | {institution}</h3>
          <div className="flex justify-end items-center mb-4 mt-4">
            {/* Search Input */}
            <div className="relative ml-4"> 
              <input
                type="text"
                placeholder="بحث..."
                title="البحث عن أية بيانات في الجدول"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full p-2 border rounded-lg ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white border-gray-300'}`}
              />
              <Search className={`absolute left-2 top-2.5 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
        <button
                onClick={() => setShowTableFilterModal(true)}
                className="p-2 text-blue-600 hover:text-blue-800 ml-2"
                title="تصفية الجدول"
        >
                <Filter className="w-5 h-5" />
        </button>
              
              {/* Grouping Button */} 
              <div className="relative" ref={groupingDropdownRef}>
          <button
                  onClick={() => setShowGroupingDropdown(!showGroupingDropdown)}
                  className='p-2 text-emerald-600 hover:text-emerald-800' // Distinct color
                  title="صفوف مجموعات الجدول"
          >
                  <Layers className="w-5 h-5" />
          </button>
                {showGroupingDropdown && (
                  <GroupingDropdown onChange={handleGroupingChange} currentKey={groupingKey} />
                )}
        </div>
              
              {/* Page Size Button */}
              <div className="relative" ref={pageSizeDropdownRef}>
                <button
                  onClick={() => setShowPageSizeDropdown(!showPageSizeDropdown)}
                  className='p-2 text-fuchsia-600 hover:text-fuchsia-800' // Using the same style as Columns button per user change
                  title="عدد الصفوف في الصفحة"
                >
                  <Rows className="w-5 h-5" /> {/* Using Rows icon */}
                </button>
                {showPageSizeDropdown && (
                  <div className={`absolute left-0 mt-2 w-max rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'}`}>
                    <div className="p-1">
                      {[10, 25, 50, 100].map(size => (
                        <button
                          key={size}
                          onClick={() => handlePageSizeChange(size)}
                          className={`block w-full text-left px-3 py-1 text-sm rounded ${
                            pageSize === size 
                              ? (isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black') 
                              : (isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
                          }`}
                        >
                          {size} صفوف
                        </button>
                      ))}
                    </div>
                  </div>
                )}
      </div>

              {/* Columns Button */}
              <ColumnVisibilityDropdown />
              
              {/* Print Button */}
              <button
                onClick={printFullInteractiveTable}
                className="p-2 text-gray-600 hover:text-gray-800"
                title="طباعة الجدول"
              >
                <Printer className="w-5 h-5" />
              </button>
              
              {/* Excel Button */}
              <button
                onClick={() => exportToExcel(tableId)}
                className="p-2 text-green-600 hover:text-green-800"
                title="تصدير إلى ملف إكسل"
              >
                <FileSpreadsheet className="w-5 h-5" />
          </button>
            </div>
        </div>
      </div>

        <div className="overflow-x-auto">
          <table id={tableId} className={`min-w-full whitespace-nowrap ${isDarkMode ? 'dark-mode' : ''}`}>
            <thead>
              <tr className={`bg-gray-50 ${isDarkMode ? 'dark-mode' : ''}`}>
                <th className={`px-6 py-3 text-center text-sm font-bold text-gray-500 uppercase tracking-wider ${isDarkMode ? 'button-dark bg-gray-800' : ''}`}>
                  الرقم
                </th>
                {columnsToRender.map((column) => (
                  <th 
                    key={column.key}
                    className={`px-6 py-3 text-center text-sm font-bold text-gray-500 uppercase tracking-wider ${isDarkMode ? 'button-dark bg-gray-800' : ''}`}
                    onClick={() => requestSort(column.key)}
                  >
                    <div className="flex items-center justify-center cursor-pointer">
                      {column.label}
                      {sortConfig && sortConfig.key === column.key && (
                      <span className="ml-1">
                        {!sortConfig || sortConfig.key !== column.key ? (
                          // No sorting applied (reset state)
                          <FileSpreadsheet className="w-4 h-4 text-gray-400" />
                        ) : sortConfig.direction === 'ascending' ? (
                          <ArrowDownAZ className="w-4 h-4 mr-2" />
                        ) : (
                          <ArrowDownZA className="w-4 h-4 mr-2" />
                        )}
                      </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`bg-white divide-y divide-gray-200 ${isDarkMode ? 'bg-transparent divide-gray-700' : ''}`}> 
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columnsToRender.length + 1} className="px-6 py-4 text-center text-gray-500">
                    لا توجد بيانات لعرضها.
                  </td>
                </tr>
              ) : (
                paginatedData.map(({ row, originalIndex }, index) => {
                  let groupHeader = null;
                  if (groupingKey) {
                    const currentGroupValue = row[groupingKey] || 'فارغ'; // Handle null/undefined
                    const prevRow = index > 0 ? paginatedData[index - 1]?.row : null;
                    // Check if it's the first row of the page OR group value changed
                    const prevGroupValue = prevRow ? (prevRow[groupingKey] || 'فارغ') : null;

                    if (index === 0 || currentGroupValue !== prevGroupValue) {
                      const groupLabel = groupableColumns.find(c => c.key === groupingKey)?.label || groupingKey;
                      groupHeader = (
                        <tr className={`bg-gray-100 ${isDarkMode ? 'bg-gray-700' : ''}`}>
                          <td 
                            colSpan={columnsToRender.length + 1} 
                            className={`px-4 py-2 text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                          >
                            {groupLabel}: {String(currentGroupValue)}
                          </td>
                        </tr>
                      );
                    }
                  }

                  return (
                    <React.Fragment key={`group-${originalIndex}`}>
                      {groupHeader}
                      <tr key={originalIndex} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          {originalIndex + 1} {/* Use original index for stable numbering */}
                        </td>
                        {columnsToRender.map((column) => {
                          const cellValue = row[column.key];
                          const cellClassName = `px-6 py-4 whitespace-nowrap text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`;
                          let cellContent = cellValue || '-';

                          // Apply conditional styling for 'التوافق مع الرغبة (ت.ت)' column
                          if (column.key === 'التوافق مع الرغبة (ت.م)') {
                            const isMismatch = cellValue === 'لا تتفق ورغبة التلميذ';
                            const isEmpty = cellValue === '-';
                          
                            cellContent = (
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-md ${
                                  isEmpty
                                    ? 'bg-transparent text-gray-500' // Transparent background for empty cells
                                    : isMismatch
                                    ? isDarkMode
                                      ? 'bg-red-700 text-red-100'
                                      : 'bg-red-100 text-red-800'
                                    : isDarkMode
                                    ? 'bg-green-700 text-green-100'
                                    : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {cellValue || '-'}
                              </span>
                            );
                          }                          

                          return (
                            <td
                              key={`${originalIndex}-${column.key}`}
                              className={cellClassName}
                            >
                              {cellContent}
                            </td>
                          );
                        })}
                      </tr>
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            عرض {(currentPage - 1) * pageSize + 1} إلى {Math.min(currentPage * pageSize, filteredTotal)} من {filteredTotal} تلميذ
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="p-1 disabled:opacity-50"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="px-2 py-1 text-sm bg-gray-100 text-gray-500 rounded">
              الصفحة {currentPage} من {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1 disabled:opacity-50"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Define groupable columns
  const groupableColumns = [
    { key: 'الجنس', label: 'الجنس' },
    { key: 'الإعادة', label: 'الإعادة' },
    { key: 'القسم', label: 'القسم' },
    { key: 'رغبة التلميذ (بطاقة الرغبات الأولية) - الفصل الثاني', label: 'الرغبة' },
    { key: 'التوجيه المسبق (ت.م)', label: 'التوجيه المسبق' },
    { key: 'التوافق مع الرغبة (ت.م)', label: 'التوافق مع الرغبة' },
    { key: 'ثبات الرغبة (ت.م)', label: 'ثبات الرغبة' }
  ];

  // New component for Grouping Dropdown
  const GroupingDropdown = ({ onChange, currentKey }: { onChange: (key: string | null) => void, currentKey: string | null }) => {
    return (
      <div className={`absolute left-0 mt-2 w-max rounded-lg shadow-lg z-50 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'}`}>
        <div className="p-1">
          {/* Clear Grouping Option */}
          <button
            onClick={() => onChange(null)}
            className={`block w-full text-right px-3 py-1 text-sm rounded mb-1 border-b ${isDarkMode ? 'text-red-400 hover:bg-gray-700 border-gray-600' : 'text-red-600 hover:bg-gray-100 border-gray-200'}`}
          >
            مسح التجميع
          </button>
          {groupableColumns.map(col => (
            <button
              key={col.key}
              onClick={() => onChange(col.key)}
              className={`block w-full text-right px-3 py-1 text-sm rounded ${
                currentKey === col.key 
                  ? (isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black') 
                  : (isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
              }`}
            >
              {col.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // New component for table filter modal
  const TableFilterModal = () => {
    const columns = [
      { key: 'الجنس', label: 'الجنس' },
      { key: 'الإعادة', label: 'الإعادة' },
      { key: 'القسم', label: 'القسم' },
      { key: 'رغبة التلميذ (بطاقة الرغبات الأولية) - الفصل الثاني', label: 'رغبة التلميذ (بطاقة الرغبات الأولية)' },
      { key: 'التوجيه المسبق (ت.م)', label: 'التوجيه المسبق' },
      { key: 'التوافق مع الرغبة (ت.م)', label: 'التوافق مع الرغبة' },
      { key: 'ثبات الرغبة (ت.م)', label: 'ثبات الرغبة' }
    ];
    
    const renderFilterSelect = (column: { key: string, label: string }) => {
      // Get unique values for this column
      const uniqueValues = Array.from(new Set(data.map(item => item[column.key]).filter(Boolean)));
      
      // Add the "الكل" option to the beginning of the options array
      const allOption = { value: "", label: "الكل" };
      const combinedOptions = [allOption, ...uniqueValues.map(val => ({ value: val, label: val }))];
      
      return (
        <div key={column.key} className="mb-4">
          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {column.label}
          </label>
          <Select
            name={column.key}
            options={combinedOptions}
            className="mt-1"
            classNamePrefix="select"
            placeholder="الكل"
            noOptionsMessage={() => "لا توجد خيارات"}
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: isDarkMode ? '#1E293B' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#4B5563' : '#e2e8f0'}`,
                borderRadius: '8px',
                boxShadow: state.isFocused ? `0 0 0 2px ${isDarkMode ? '#64748B' : '#94a3b8'}` : 'none',
                '&:hover': {
                  borderColor: isDarkMode ? '#64748B' : '#94a3b8',
                },
                color: isDarkMode ? '#F1F5F9' : '#1E293B',
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: isDarkMode ? '#222529' : '#ffffff',
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
                color: isDarkMode ? '#F1F5F9' : '#1E293B',
              }),
            }}
            onChange={(selectedOption) => {
              setTableFilters({ 
                ...tableFilters, 
                [column.key]: selectedOption ? selectedOption.value : "" 
              });
            }}
            value={combinedOptions.find(option => option.value === tableFilters[column.key]) || null}
          />
        </div>
      );
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`bg-white rounded-lg p-6 max-w-md w-full ${isDarkMode ? 'nav-dark' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">تصفية الجدول</h3>
            <button
              onClick={() => setShowTableFilterModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mb-4">
            {columns.map(column => renderFilterSelect(column))}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => {
                setTableFilters({});
                setShowTableFilterModal(false);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
            >
              إعادة تعيين
            </button>
            <button
              onClick={() => setShowTableFilterModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              تطبيق
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Replace the ColumnVisibilityModal component with a new dropdown implementation
  const ColumnVisibilityDropdown = () => {
    const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown container

    const allTableColumns: ColumnConfig[] = [
      { key: 'اللقب و الاسم', label: 'اللقب و الاسم' },
      { key: 'تاريخ الميلاد', label: 'تاريخ الميلاد' },
      { key: 'الجنس', label: 'الجنس' },
      { key: 'الإعادة', label: 'الإعادة' },
      { key: 'القسم', label: 'القسم' },
      { key: 'معدل الفصلين (الأول والثاني)', label: 'معدل الفصل الفصلين' },
      { key: 'رغبة التلميذ (بطاقة الرغبات الأولية) - الفصل الثاني', label: 'رغبة التلميذ (بطاقة الرغبات الأولية)' },
      { key: 'شعبة آداب وفلسفة (ت.م)', label: 'شعبة آداب وفلسفة' },
      { key: 'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.م)', label: 'ترتيب التلميذ' },
      { key: 'شعبة اللغات الأجنبية (ت.م)', label: 'شعبة اللغات الأجنبية' },
      { key: 'ترتيب التلميذ (اللغات الأجنبية) (ت.م)', label: 'ترتيب التلميذ (اللغات الأجنبية)' },
      { key: 'التوجيه المسبق (ت.م)', label: 'التوجيه المسبق' },
      { key: 'التوافق مع الرغبة (ت.م)', label: 'التوافق مع الرغبة' },
      { key: 'ثبات الرغبة (ت.م)', label: 'ثبات الرغبة' }
    ];

    const toggleColumn = (key: string) => {
      setVisibleColumns(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    };

    const toggleAllColumns = (show: boolean) => {
      const newVisibleColumns: Record<string, boolean> = {};
      allTableColumns.forEach(col => {
        newVisibleColumns[col.key] = show;
      });
      setVisibleColumns(newVisibleColumns);
    };
    
    // Effect to handle clicks outside the dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setShowColumnModal(false);
        }
      };

      // Add event listener only when the dropdown is open
      if (showColumnModal) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      // Cleanup function to remove event listener
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showColumnModal]); // Re-run effect when showColumnModal changes

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowColumnModal(!showColumnModal)}
          className='p-2 text-rose-500'
          title="تحديد الأعمدة"
        >
          <Columns className="w-5 h-5" />
        </button>
        
        {showColumnModal && (
          <div className={`absolute left-0 mt-2 w-max rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'}`}>
            <div className="p-2">
              {/* Show/Hide All buttons */}
              <div className="flex justify-between mb-2 pb-2 border-b border-gray-200">
                <button
                  onClick={() => toggleAllColumns(true)}
                  className={`text-sm px-2 py-1 rounded ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  إظهار الكل
                </button>
                <button
                  onClick={() => toggleAllColumns(false)}
                  className={`text-sm px-2 py-1 rounded ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  إخفاء الكل
                </button>
              </div>
              
              {/* Column toggles */}
              <div className="max-h-96 overflow-y-auto">
                {allTableColumns.map(column => (
                  <div
                    key={column.key}
                    className={`flex items-center px-2 py-1 rounded cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    onClick={() => toggleColumn(column.key)}
                  >
                    <input
                      type="checkbox"
                      id={`col-${column.key}`}
                      checked={!!visibleColumns[column.key]}
                      onChange={() => {}}
                      className={`ml-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                    />
                    <label
                      htmlFor={`col-${column.key}`}
                      className={`ml-2 block text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      {column.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">تحليل التوجيه المسبق</h1>
      </div>
      
      {/* Add the interactive table at the top */}
      {renderInteractiveTable()}
      
      {/* Existing content */}
      <div className="gap-4">
      {Object.entries(allFields).map(([section, fields]) => (
        <div key={section} className={`mb-8 ${isDarkMode ? 'dark-mode' : ''}`}>
          <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'table-white' : 'table-black'}`}>{section}</h3>
          {fields.map(field => renderAnalysisTable(field, `توزيع التلاميذ حسب ${field}`))}
        </div>
      ))}
      </div>
      
      {/* Add the table filter modal */}
      {showTableFilterModal && <TableFilterModal />}
      {showFilterModal && <FilterModal />}
      {showChart && renderChart(calculateStats(showChart), `توزيع التلاميذ حسب ${showChart}`)}
      {showAnalysisModal && (
        <Modal isOpen={showAnalysisModal} onClose={() => setShowAnalysisModal(false)} isDarkMode={isDarkMode}>
          {analysisContent}
        </Modal>
      )}
      
    </div>
  );
}