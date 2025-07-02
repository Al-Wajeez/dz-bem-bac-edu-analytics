import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import favicon from '../../images/favicon.png'; // Import the image
import { Upload,
  Filter,
  Columns,
  Trash,
  Download,
  Eye,
  MonitorUp,
  FolderUp,
  Sun,
  Moon
 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { initDB, addData, getAllData, updateData, deleteData, clearAllData } from '../../lib/db';
import { DataTable } from './DataTable';
import { EditForm } from './EditForm';
import { ProgressiveDirectiveAnalysisPage } from './ProgressiveDirective';
import { AdvanceDirectiveAnalysisPage } from './AdvanceDirective';
import { createColumnHelper } from '@tanstack/react-table';
import { FinalGuidanceAnalysisPage } from './FinalGuidance';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [sorting, setSorting] = useState<any[]>([]);
  const [filtering, setFiltering] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showGlobalAnalysis, setShowGlobalAnalysis] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const columnHelper = createColumnHelper<any>();
  const [pageSize, setPageSize] = useState<number>(9999);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // State to track the open dropdown
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any[]>([]);
  const [showClearConfirmationModal, setShowClearConfirmationModal] = useState(false);
  const [showStudentList, setShowStudentList] = useState(false); // Add this state

  useEffect(() => {
    loadData();
    // Set the initial theme based on the state
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]); // Update class when isDarkMode changes

  async function loadData() {
    const storedData = await getAllData();

    if (storedData.length > 0) {
      setData(storedData);

      const allColumns = Object.keys(storedData[0]).filter(key => key !== 'id');
      setColumns(allColumns); // all available columns, if needed elsewhere

      const hiddenColumnNames = [
        'المؤسسة',
        'المديرية',

        'اللغة العربية وآدابها',
        'التاريخ والجغرافيا',
        'اللغة الفرنسية',
        'اللغة الانجليزية',
        'الرياضيات',
        'العلوم الفيزيائية',
        'علوم الطبيعة والحياة',
        'العلوم الإسلامية',
        'المعلوماتية',
        'التربية الفنية',
        'ت البدنية و الرياضية',
        'اللغة اﻷمازيغية',

        'اللغة العربية وآدابها ف 1',
        'التاريخ والجغرافيا ف 1',
        'اللغة الفرنسية ف 1',
        'اللغة الانجليزية ف 1',
        'الرياضيات ف 1',
        'العلوم الفيزيائية ف 1',
        'علوم الطبيعة والحياة ف 1',
        'العلوم الإسلامية ف 1',
        'المعلوماتية ف 1',
        'التربية الفنية ف 1',
        'ت البدنية و الرياضية ف 1',
        'اللغة اﻷمازيغية ف 1',

        'اللغة العربية وآدابها ف 2',
        'التاريخ والجغرافيا ف 2',
        'اللغة الفرنسية ف 2',
        'اللغة الانجليزية ف 2',
        'الرياضيات ف 2',
        'العلوم الفيزيائية ف 2',
        'علوم الطبيعة والحياة ف 2',
        'العلوم الإسلامية ف 2',
        'المعلوماتية ف 2',
        'التربية الفنية ف 2',
        'ت البدنية و الرياضية ف 2',
        'اللغة اﻷمازيغية ف 2',

        'اللغة العربية وآدابها ف 3',
        'التاريخ والجغرافيا ف 3',
        'اللغة الفرنسية ف 3',
        'اللغة الانجليزية ف 3',
        'الرياضيات ف 3',
        'العلوم الفيزيائية ف 3',
        'علوم الطبيعة والحياة ف 3',
        'العلوم الإسلامية ف 3',
        'المعلوماتية ف 3',
        'التربية الفنية ف 3',
        'ت البدنية و الرياضية ف 3',
        'اللغة اﻷمازيغية ف 3',
        
        'معدل الفصل 1',
        'معدل الفصل 2',
        'معدل الفصل 3',
      ]; // 💡 permanent hidden columns

      const visibleCols = allColumns.filter(col => !hiddenColumnNames.includes(col));

      setVisibleColumns(visibleCols);
    } else {
      setData([]);
      setColumns([]);
      setVisibleColumns([]);
    }
  }


  const ConfirmationModal: React.FC<{ data: any[]; onClose: () => void }> = ({ data, onClose }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" dir="rtl">
        <div className={`bg-white p-6 rounded-lg shadow-lg ${isDarkMode ? 'dark-mode' : ''}`}>
          <h2 className="text-xl font-bold mb-4">البيانات المستوردة</h2>
          {/* Add a container with a fixed height and overflow */}
          <div className="max-h-[50vh] overflow-y-auto"> {/* Adjust max-height as needed */}
            <table className={`min-w-full text-center border-collapse border border-gray-200 ${isDarkMode ? 'table-dark' : ''}`}>
              <thead>
                <tr>
                  <th className="border border-gray-600 p-2">الرقم</th>
                  <th className="border border-gray-600 p-2">المديرية</th>
                  <th className="border border-gray-600 p-2">المؤسسة</th>
                  <th className="border border-gray-600 p-2">القسم</th>
                  <th className="border border-gray-600 p-2">عدد التلاميذ</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, index) => (
                  <tr key={index}>
                    <td className="border border-gray-600 p-2">{index + 1}</td>
                    <td className="border border-gray-600 p-2">{entry.strdirectorate}</td>
                    <td className="border border-gray-600 p-2">{entry.strschoolName}</td>
                    <td className="border border-gray-600 p-2">{entry.lastTwoDigits}</td>
                    <td className="border border-gray-600 p-2">{entry.totalRows}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-full text-left">
            <button 
              onClick={onClose} 
              className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded ${isDarkMode ? 'button-dark hover:bg-gray-900' : ''}`}
            >
              غلق
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Clear Confirmation Modal
  const ClearConfirmationModal: React.FC<{ onConfirm: () => void; onClose: () => void }> = ({ onConfirm, onClose }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" dir="rtl">
        <div className={`bg-white p-6 rounded-lg shadow-lg ${isDarkMode ? 'table-dark' : ''}`}>
          <h2 className="text-xl font-bold mb-4">تأكيد المسح</h2>
          <p>هل أنت متأكد أنك تريد مسح جميع البيانات؟ هذه العملية لا يمكن التراجع عنها.</p>
          <div className="mt-4 text-left">
            <button onClick={onConfirm} className={`ml-2 px-4 py-2 bg-red-500 text-white rounded ${isDarkMode ? 'button-failed-dark hover:bg-red-900' : ''}`}>نعم، امسح البيانات</button>
            <button onClick={onClose} className={`px-4 py-2 bg-gray-300 text-black rounded ${isDarkMode ? 'button-dark hover:bg-gray-900' : ''}`}>إلغاء</button>
          </div>
        </div>
      </div>
    );
  };

  const handleClearData = () => {
    setShowClearConfirmationModal(true); // Show the confirmation modal
  };

  const confirmClearData = async () => {
      await clearAllData(); // Clear all data in the database
      await loadData(); // Reload the data to update the UI
  
      // Clear file input to allow re-upload
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = ''; // Reset file input value
      }

    setShowClearConfirmationModal(false); // Close the confirmation modal
  };  

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files; // Get the list of files
    if (!files) return;

    const allJsonData = []; // Array to hold data from all files
    const confirmationEntries = []; // Array to hold confirmation data for each file

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const workbook = XLSX.read(e.target?.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Get the range of the worksheet
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      
            // Initialize variables
            let lastTwoDigits = '';
            let strdirectorate = '';
            let strschoolName = '';
            let strschoolTrunk ='';
            const jsonData = [];

            // Process the data
      for (let R = 6; R <= range.e.r; R++) {
        const row: any = {};
        const cellB = worksheet[XLSX.utils.encode_cell({ r: R, c: 1 })]; // Column B
  
        // Skip if cell B is empty
        if (!cellB || !cellB.v) continue;
        
        // Get data from columns B to the last column
        for (let C = 1; C <= 17; C++) {
          const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
          const header = worksheet[XLSX.utils.encode_cell({ r: 5, c: C })]; // Headers from row 6
          if (cell && typeof cell.v === 'number' && header.v === 'تاريخ الميلاد') {
            const jsDate = XLSX.SSF.parse_date_code(cell.v);
            row[header.v] = `${jsDate.y}-${String(jsDate.m).padStart(2, '0')}-${String(jsDate.d).padStart(2, '0')}`;
          } else {
            row[header.v] = cell ? cell.v : '';
          }
        }
  
        // Determine the section based on the school name

        const cellA4 = worksheet[XLSX.utils.encode_cell({ r: 3, c: 0 })]; // A4
        if (cellA4 && cellA4.v) {
            strschoolName = String(cellA4.v);
            row['المؤسسة'] = strschoolName;
        } else {
            row['المؤسسة'] = '';
        }

        const cellA5 = worksheet[XLSX.utils.encode_cell({ r: 4, c: 0 })]; // A5
        const strschoolTrunk = String(cellA5.v).match(/جدع مشترك (آداب|علوم)/);

        
        if (cellA5 && cellA5.v) {
            lastTwoDigits = String(cellA5.v).slice(-2);
            if (strschoolName.startsWith('متوسطة')) {
                row['القسم'] = 'السنة الرابعة م ' + lastTwoDigits;
            } else if (strschoolName.startsWith('ثانوية')) {
                row['القسم'] = strschoolTrunk ? 'جذع مشترك ' + strschoolTrunk[1]  + ' ' + lastTwoDigits : '';
            } else {
                row['القسم'] = '';
            }
        } else {
            row['القسم'] = '';
        }

        // Get values from A3 and A4
        const cellA3 = worksheet[XLSX.utils.encode_cell({ r: 2, c: 0 })]; // A3
        if (cellA3 && cellA3.v) {
            strdirectorate = String(cellA3.v);
            row['المديرية'] = strdirectorate;
        } else {
            row['المديرية'] = '';
        }
  
        jsonData.push(row);
      }
  
            allJsonData.push(...jsonData); // Accumulate data from each file

            // Push confirmation data for this file
            confirmationEntries.push({
                strdirectorate,
                strschoolName,
                lastTwoDigits,
                totalRows: jsonData.length,
            });
        };
        reader.readAsBinaryString(file); // Read each file
    }

    // Wait for all files to be processed
    await Promise.all(Array.from(files).map(file => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = resolve;
    reader.readAsBinaryString(file);
    })));

    await addData(allJsonData); // Add all accumulated data to the database
    await loadData(); // Reload the data to update the UI

    setConfirmationData(confirmationEntries); // Set the confirmation data for all files
    setShowConfirmationModal(true); // Show the confirmation modal
  };

  const handleSavedFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = async (e) => {
      const workbook = XLSX.read(e.target?.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Get the range of the worksheet
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  
      // Start from row 2 (index 1) to skip the header row
      const jsonData = [];
      for (let R = 1; R <= range.e.r; R++) {
        const row: any = {};
        // Get data from columns A to the last column
        for (let C = 0; C <= range.e.c; C++) { // Start from column A (index 0)
          const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
          const header = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })]; // Headers from the first row
          if (header && header.v) {
            // Directly assign the cell value without parsing
            row[header.v] = cell ? cell.v : '';
          }
        }
        jsonData.push(row);
      }
  
      // Ensure that the data structure matches the expected format for the EditForm
      const formattedData = jsonData.map(item => {
        // Create a whitelist of multi-select fields
        const multiSelectFields = [
          'المواد الصعبة',
          'المواد المفضلة',
          'المواد المميزة للجذع',
          'القطاع المرغوب للعمل فيه',
          'سبب اهتمامه بالدراسة',
          'ممن يطلب المساعدة عند الصعوبة',
          'كيف يقضي أوقات فراغه'
        ];
      
        return Object.entries(item).reduce((acc, [key, value]) => {
          // Handle multi-select fields
          if (multiSelectFields.includes(key)) {
            return {
              ...acc,
              [key]: value
                ? value.split(',').map(v => ({
                    value: v.trim(),
                    label: v.trim()
                  }))
                : []
            };
          }
      
          // Handle regular select fields
          const isSelectField = Object.values(Selection)
            .flat()
            .some(field => field.name === key && field.type === 'select');
      
          if (isSelectField) {
        return {
              ...acc,
              [key]: value ? { value: value.trim(), label: value.trim() } : null
            };
          }
      
          return { ...acc, [key]: value };
        }, {});
      });
  
      await addData(formattedData);
      await loadData();
    };
    reader.readAsBinaryString(file);
  };

  const handleFileUpload2 = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Get existing data first to determine the last column
    const existingData = await getAllData();
    console.log('Existing data:', existingData);
    console.log('Number of existing records:', existingData.length);
    
    const lastColumnIndex = existingData.length > 0 ? Object.keys(existingData[0]).length : 0;
    console.log('Last column index:', lastColumnIndex);

    const allJsonData = [];
    const confirmationEntries = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const workbook = XLSX.read(e.target?.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Debugging: Log worksheet structure
        console.log('Worksheet keys:', Object.keys(worksheet).filter(k => k !== '!ref' && k !== '!margins'));
        
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        
        // Debugging: Log worksheet range
        console.log('Worksheet range:', { 
          startRow: range.s.r, 
          endRow: range.e.r,
          startCol: range.s.c,
          endCol: range.e.c
        });

        let lastTwoDigits = '';
        let strdirectorate = '';
        let strschoolName = '';
        let strschoolTrunk = '';
        const jsonData = [];

        // Debugging: Log headers
        const headers: Record<number, string> = {};
        for (let C = 1; C <= 30; C++) {
          const headerCell = worksheet[XLSX.utils.encode_cell({ r: 5, c: C })];
          headers[C] = headerCell?.v || `Column ${C}`;
        }
        console.log('Detected headers:', headers);

        // Process the data
        for (let R = 6; R <= range.e.r; R++) {
          const row: any = {};
          const cellB = worksheet[XLSX.utils.encode_cell({ r: R, c: 1 })]; // Column B

          // Debugging: Log first row content
          if (R === 6) {
            console.log('First data row content:');
            for (let C = 1; C <= 30; C++) {
              const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
              console.log(`Column ${C} (${headers[C]}):`, cell?.v);
            }
          }

          // Skip if cell B is empty
          if (!cellB || !cellB.v) continue;
          
          // First read the name field (اللقب و الاسم) from column B
          const nameCell = worksheet[XLSX.utils.encode_cell({ r: R, c: 1 })];
          if (nameCell && nameCell.v) {
            row['اللقب و الاسم'] = String(nameCell.v).trim();
            console.log('Processing row with name:', row['اللقب و الاسم']);
          }
          
          // Get data from columns B to AE (30 columns)
          for (let C = 1; C <= 30; C++) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
            const header = worksheet[XLSX.utils.encode_cell({ r: 5, c: C })]; // Headers from row 6
            if (header && header.v) {
              if (cell && typeof cell.v === 'number' && header.v === 'تاريخ الميلاد') {
                const jsDate = XLSX.SSF.parse_date_code(cell.v);
                row[header.v] = `${jsDate.y}-${String(jsDate.m).padStart(2, '0')}-${String(jsDate.d).padStart(2, '0')}`;
              } else {
                row[header.v] = cell ? cell.v : '';
              }
            }
          }

          // Get school information
          const cellA4 = worksheet[XLSX.utils.encode_cell({ r: 3, c: 0 })];
          if (cellA4 && cellA4.v) {
            strschoolName = String(cellA4.v);
            row['المؤسسة'] = strschoolName;
          }

          const cellA5 = worksheet[XLSX.utils.encode_cell({ r: 4, c: 0 })];
          const strschoolTrunk = String(cellA5.v).match(/جدع مشترك (آداب|علوم)/);
          
          if (cellA5 && cellA5.v) {
            lastTwoDigits = String(cellA5.v).slice(-2);
            if (strschoolName.startsWith('متوسطة')) {
              row['القسم'] = 'السنة الرابعة م ' + lastTwoDigits;
            } else if (strschoolName.startsWith('ثانوية')) {
              row['القسم'] = strschoolTrunk ? 'جذع مشترك ' + strschoolTrunk[1] + ' ' + lastTwoDigits : '';
            }
          }

          const cellA3 = worksheet[XLSX.utils.encode_cell({ r: 2, c: 0 })];
          if (cellA3 && cellA3.v) {
            strdirectorate = String(cellA3.v);
            row['المديرية'] = strdirectorate;
          }

          jsonData.push(row);
        }

        console.log('New data to merge:', jsonData);
        console.log('Number of new records:', jsonData.length);

        // Merge with existing data based on name
        const mergedData = existingData.map(existingRow => {
          const matchingRow = jsonData.find(newRow => {
            const existingName = String(existingRow['اللقب و الاسم']).trim();
            const newName = String(newRow['اللقب و الاسم']).trim();
            console.log('Comparing names:', { existingName, newName });
            return existingName === newName;
          });
          
          if (matchingRow) {
            console.log('Found matching row for:', matchingRow['اللقب و الاسم']);
            // Merge the data, keeping existing values if new values are empty
            return {
              ...existingRow,
              ...Object.fromEntries(
                Object.entries(matchingRow).filter(([_, value]) => value !== '')
              )
            };
          }
          return existingRow;
        });

        // Add any new rows that don't have matches
        const newRows = jsonData.filter(newRow => {
          const newName = String(newRow['اللقب و الاسم']).trim();
          const hasMatch = existingData.some(existingRow => 
            String(existingRow['اللقب و الاسم']).trim() === newName
          );
          if (!hasMatch) {
            console.log('Adding new row:', newName);
          }
          return !hasMatch;
        });

        allJsonData.push(...mergedData, ...newRows);
        console.log('Final merged data:', allJsonData);
        console.log('Number of final records:', allJsonData.length);

        confirmationEntries.push({
          strdirectorate,
          strschoolName,
          lastTwoDigits,
          totalRows: jsonData.length,
        });
      };
      reader.readAsBinaryString(file);
    }

    await Promise.all(Array.from(files).map(file => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = resolve;
      reader.readAsBinaryString(file);
    })));

    await clearAllData(); // Clear existing data
    await addData(allJsonData); // Add merged data
    await loadData();

    setConfirmationData(confirmationEntries);
    setShowConfirmationModal(true);
  };

  const handleFileUpload3 = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Get existing data first to determine the last column
    const existingData = await getAllData();
    console.log('Existing data:', existingData);
    console.log('Number of existing records:', existingData.length);
    
    const lastColumnIndex = existingData.length > 0 ? Object.keys(existingData[0]).length : 0;
    console.log('Last column index:', lastColumnIndex);

    const allJsonData = [];
    const confirmationEntries = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const workbook = XLSX.read(e.target?.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Debugging: Log worksheet structure
        console.log('Worksheet keys:', Object.keys(worksheet).filter(k => k !== '!ref' && k !== '!margins'));
        
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        
        // Debugging: Log worksheet range
        console.log('Worksheet range:', { 
          startRow: range.s.r, 
          endRow: range.e.r,
          startCol: range.s.c,
          endCol: range.e.c
        });

        let lastTwoDigits = '';
        let strdirectorate = '';
        let strschoolName = '';
        let strschoolTrunk = '';
        const jsonData = [];

        // Debugging: Log headers
        const headers: Record<number, string> = {};
        for (let C = 1; C <= 43; C++) {
          const headerCell = worksheet[XLSX.utils.encode_cell({ r: 5, c: C })];
          headers[C] = headerCell?.v || `Column ${C}`;
        }
        console.log('Detected headers:', headers);

        // Process the data
        for (let R = 6; R <= range.e.r; R++) {
          const row: any = {};
          const cellB = worksheet[XLSX.utils.encode_cell({ r: R, c: 1 })]; // Column B

          // Debugging: Log first row content
          if (R === 6) {
            console.log('First data row content:');
            for (let C = 1; C <= 43; C++) {
              const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
              console.log(`Column ${C} (${headers[C]}):`, cell?.v);
            }
          }

          // Skip if cell B is empty
          if (!cellB || !cellB.v) continue;
          
          // First read the name field (اللقب و الاسم) from column B
          const nameCell = worksheet[XLSX.utils.encode_cell({ r: R, c: 1 })];
          if (nameCell && nameCell.v) {
            row['اللقب و الاسم'] = String(nameCell.v).trim();
            console.log('Processing row with name:', row['اللقب و الاسم']);
          }
          
          // Get data from columns B to AE (30 columns)
          for (let C = 1; C <= 43; C++) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
            const header = worksheet[XLSX.utils.encode_cell({ r: 5, c: C })]; // Headers from row 6
            if (header && header.v) {
              if (cell && typeof cell.v === 'number' && header.v === 'تاريخ الميلاد') {
                const jsDate = XLSX.SSF.parse_date_code(cell.v);
                row[header.v] = `${jsDate.y}-${String(jsDate.m).padStart(2, '0')}-${String(jsDate.d).padStart(2, '0')}`;
              } else {
                row[header.v] = cell ? cell.v : '';
              }
            }
          }

          // Get school information
          const cellA4 = worksheet[XLSX.utils.encode_cell({ r: 3, c: 0 })];
          if (cellA4 && cellA4.v) {
            strschoolName = String(cellA4.v);
            row['المؤسسة'] = strschoolName;
          }

          const cellA5 = worksheet[XLSX.utils.encode_cell({ r: 4, c: 0 })];
          const strschoolTrunk = String(cellA5.v).match(/جدع مشترك (آداب|علوم)/);
          
          if (cellA5 && cellA5.v) {
            lastTwoDigits = String(cellA5.v).slice(-2);
            if (strschoolName.startsWith('متوسطة')) {
              row['القسم'] = 'السنة الرابعة م ' + lastTwoDigits;
            } else if (strschoolName.startsWith('ثانوية')) {
              row['القسم'] = strschoolTrunk ? 'جذع مشترك ' + strschoolTrunk[1] + ' ' + lastTwoDigits : '';
            }
          }

          const cellA3 = worksheet[XLSX.utils.encode_cell({ r: 2, c: 0 })];
          if (cellA3 && cellA3.v) {
            strdirectorate = String(cellA3.v);
            row['المديرية'] = strdirectorate;
          }

          jsonData.push(row);
        }

        console.log('New data to merge:', jsonData);
        console.log('Number of new records:', jsonData.length);

        // Merge with existing data based on name
        const mergedData = existingData.map(existingRow => {
          const matchingRow = jsonData.find(newRow => {
            const existingName = String(existingRow['اللقب و الاسم']).trim();
            const newName = String(newRow['اللقب و الاسم']).trim();
            console.log('Comparing names:', { existingName, newName });
            return existingName === newName;
          });
          
          if (matchingRow) {
            console.log('Found matching row for:', matchingRow['اللقب و الاسم']);
            // Merge the data, keeping existing values if new values are empty
            return {
              ...existingRow,
              ...Object.fromEntries(
                Object.entries(matchingRow).filter(([_, value]) => value !== '')
              )
            };
          }
          return existingRow;
        });

        // Add any new rows that don't have matches
        const newRows = jsonData.filter(newRow => {
          const newName = String(newRow['اللقب و الاسم']).trim();
          const hasMatch = existingData.some(existingRow => 
            String(existingRow['اللقب و الاسم']).trim() === newName
          );
          if (!hasMatch) {
            console.log('Adding new row:', newName);
          }
          return !hasMatch;
        });

        allJsonData.push(...mergedData, ...newRows);
        console.log('Final merged data:', allJsonData);
        console.log('Number of final records:', allJsonData.length);

        confirmationEntries.push({
          strdirectorate,
          strschoolName,
          lastTwoDigits,
          totalRows: jsonData.length,
        });
      };
      reader.readAsBinaryString(file);
    }

    await Promise.all(Array.from(files).map(file => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = resolve;
      reader.readAsBinaryString(file);
    })));

    await clearAllData(); // Clear existing data
    await addData(allJsonData); // Add merged data
    await loadData();

    setConfirmationData(confirmationEntries);
    setShowConfirmationModal(true);
  };

  const handleEdit = (row: any) => {
    setEditingRow(row);
  };

  const handleDelete = async (row: any) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await deleteData(row.id);
      await loadData();
    }
  };

  const handleSubmitEdit = async (formData: any) => {
    await updateData(editingRow.id, formData);
    setEditingRow(null);
    await loadData();
  };

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev =>
      prev.includes(column)
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };

  // Define tableColumns here, before it's used
  const tableColumns = visibleColumns.map(col => 
    columnHelper.accessor(col, {
      header: col,
      cell: info => info.getValue(),
      enableSorting: true, // Enable sorting for each column
    })
  );

  const exportDataToXLSX = async () => {
    const workbook = XLSX.utils.book_new();
    
    // Define the order of columns as per your form
    const columnOrder = [    
      'اللقب و الاسم',
      'الجنس',
      'الإعادة',
      'القسم',
      'المديرية',
      'المؤسسة',
      'معدل الفصل 1',
      'معدل القبول (الفصل الأول)',
      'معدل الفصل 2',
      'معدل الفصلين (الأول والثاني)',
      'معدل القبول (الفصل الثاني)',
      'معدل الفصل 3',
      'المعدل السنوي',
      'معدل القبول (المعدل السنوي)',
      'رغبة التلميذ (إستبيان الميول والإهتمامات) - الفصل الأول',
      'رغبة التلميذ (بطاقة الرغبات الأولية) - الفصل الثاني',
      'تصحيح الرغبة',
      'الرغبة النهائية للتلميذ - الفصل الثالث',
      'اللغة العربية وآدابها',
      'اللغة العربية وآدابها ف 2',
      'متوسط المعدلين (اللغة العربية)',
      'اللغة العربية وآدابها ف 3',
      'المعدل السنوي (اللغة العربية)',
      'التاريخ والجغرافيا',
      'التاريخ والجغرافيا ف 2',
      'متوسط المعدلين (التاريخ والجغرافيا)',
      'التاريخ والجغرافيا ف 3',
      'المعدل السنوي (التاريخ والجغرافيا)',
      'اللغة الفرنسية',
      'اللغة الفرنسية ف 2',
      'متوسط المعدلين (اللغة الفرنسية)',
      'اللغة الفرنسية ف 3',
      'المعدل السنوي (اللغة الفرنسية)',
      'اللغة الانجليزية',
      'اللغة الانجليزية ف 2',
      'متوسط المعدلين (اللغة الانجليزية)',
      'اللغة الانجليزية ف 3',
      'المعدل السنوي (اللغة الانجليزية)',
      'شعبة آداب وفلسفة (ت.ت)',
      'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.ت)',
      'شعبة اللغات الأجنبية (ت.ت)',
      'ترتيب التلميذ (اللغات الأجنبية) (ت.ت)',
      'التوجيه التدريجي (ت.ت)',
      'التوافق مع الرغبة (ت.ت)',
      'شعبة آداب وفلسفة (ت.م)',
      'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.م)',
      'شعبة اللغات الأجنبية (ت.م)',
      'ترتيب التلميذ (اللغات الأجنبية) (ت.م)',
      'التوجيه المسبق (ت.م)',
      'التوافق مع الرغبة (ت.م)',
      'ثبات الرغبة (ت.م)',
      'شعبة آداب وفلسفة (ت.ن)',
      'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.ن)',
      'شعبة اللغات الأجنبية (ت.ن)',
      'ترتيب التلميذ (اللغات الأجنبية) (ت.ن)',
      'التوجيه النهائي (ت.ن)', 
      'التوافق مع الرغبة (ت.ن)', 
      'ثبات الرغبة (ت.ن)',
      'إقتراح مستشار التوجيه',
      'إقتراح الأساتذة',
      'قرار مجلس القبول والتوجيه',
      'حالة الطعن',
      'تأسيس الطعن',
      'قرار الطعن',
      'الشعبة المطعون فيها',
      'الشعبة المرغوب فيها',
      'قرار اللجنة الولائية للطعن'
    ];
  
    // Define select fields and their types
    const selectFieldsConfig: Record<string, 'single' | 'multi'> = {
      'الجنس': 'single',
      'الإعادة': 'single',
      'معدل القبول (الفصل الأول)': 'single',
      'معدل الفصلين (الأول والثاني)': 'single',
      'معدل القبول (الفصل الثاني)': 'single',
      'معدل القبول (المعدل السنوي)': 'single',
      'رغبة التلميذ (إستبيان الميول والإهتمامات) - الفصل الأول': 'single',
      'رغبة التلميذ (بطاقة الرغبات الأولية) - الفصل الثاني': 'single',
      'تصحيح الرغبة': 'single',
      'الرغبة النهائية للتلميذ - الفصل الثالث': 'single',
      'التوجيه التدريجي (ت.ت)': 'single',
      'التوافق مع الرغبة (ت.ت)': 'single',
      'التوجيه المسبق (ت.م)': 'single',
      'التوافق مع الرغبة (ت.م)': 'single',
      'ثبات الرغبة (ت.م)': 'single',
      'التوجيه النهائي (ت.ن)': 'single', 
      'التوافق مع الرغبة (ت.ن)': 'single', 
      'ثبات الرغبة (ت.ن)': 'single',
      'إقتراح مستشار التوجيه': 'single',
      'إقتراح الأساتذة': 'single',
      'قرار مجلس القبول والتوجيه': 'single',
      'حالة الطعن': 'single',
      'تأسيس الطعن': 'single',
      'قرار الطعن': 'single',
      'الشعبة المطعون فيها': 'single',
      'الشعبة المرغوب فيها': 'single',
      'قرار اللجنة الولائية للطعن': 'single',

    };

    // Prepare data for export
    const exportData = data.map(row => {
      return columnOrder.reduce((acc, column) => {
        const value = row[column];
        
        // Handle select fields
        if (selectFieldsConfig[column]) {
          if (selectFieldsConfig[column] === 'multi') {
            // Handle multi-select arrays
            if (Array.isArray(value)) {
              // If it's an array of objects with value/label properties
              acc[column] = value.map(v => v?.label || v?.value || v).join(',');
            } else if (typeof value === 'string') {
              // If it's a string, split by comma and join with Arabic comma
              acc[column] = value.split(',').map(v => v.trim()).join(',');
            } else {
              acc[column] = '';
            }
        } else {
            // Handle single select objects
            acc[column] = value?.label || value?.value || value || '';
          }
        }
        // Handle date field
        else if (column === 'تاريخ الميلاد' && value) {
          const date = new Date(value);
          acc[column] = `${String(date.getDate()).padStart(2, '0')}-${
            String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
        }
        // Handle other fields
        else {
          acc[column] = value || '';
        }
        
        return acc;
      }, {} as Record<string, any>);
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, 'الوجيز_التوجيه المدرسي(آداب).xlsx');
  };
    
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const hiddenColumn = [
    'اللغة العربية وآدابها',
    'التاريخ والجغرافيا',
    'اللغة الفرنسية',
    'اللغة الانجليزية',
    'الرياضيات',
    'العلوم الفيزيائية',
    'علوم الطبيعة والحياة',
    'العلوم الإسلامية',
    'المعلوماتية',
    'التربية الفنية',
    'ت البدنية و الرياضية',
    'اللغة اﻷمازيغية',

    'اللغة العربية وآدابها ف 1',
    'التاريخ والجغرافيا ف 1',
    'اللغة الفرنسية ف 1',
    'اللغة الانجليزية ف 1',
    'الرياضيات ف 1',
    'العلوم الفيزيائية ف 1',
    'علوم الطبيعة والحياة ف 1',
    'العلوم الإسلامية ف 1',
    'المعلوماتية ف 1',
    'التربية الفنية ف 1',
    'ت البدنية و الرياضية ف 1',
    'اللغة اﻷمازيغية ف 1',

    'اللغة العربية وآدابها ف 2',
    'التاريخ والجغرافيا ف 2',
    'اللغة الفرنسية ف 2',
    'اللغة الانجليزية ف 2',
    'الرياضيات ف 2',
    'العلوم الفيزيائية ف 2',
    'علوم الطبيعة والحياة ف 2',
    'العلوم الإسلامية ف 2',
    'المعلوماتية ف 2',
    'التربية الفنية ف 2',
    'ت البدنية و الرياضية ف 2',
    'اللغة اﻷمازيغية ف 2',

    'اللغة العربية وآدابها ف 3',
    'التاريخ والجغرافيا ف 3',
    'اللغة الفرنسية ف 3',
    'اللغة الانجليزية ف 3',
    'الرياضيات ف 3',
    'العلوم الفيزيائية ف 3',
    'علوم الطبيعة والحياة ف 3',
    'العلوم الإسلامية ف 3',
    'المعلوماتية ف 3',
    'التربية الفنية ف 3',
    'ت البدنية و الرياضية ف 3',
    'اللغة اﻷمازيغية ف 3',
    
    'معدل الفصل 1',
    'معدل الفصل 2',
    'معدل الفصل 3',
  ]; // 💡 permanent hidden columns

  return (
    <div className={`max-h-screen ${isDarkMode ? 'dark-mode' : 'light-mode'}`} dir="rtl">
      {/* Top Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-10 py-2 ${isDarkMode ? 'nav-dark' : 'nav-light'}`}>
        <div className="max-w-full mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center">
                  <img
                    src={favicon} // Use the imported image
                    alt="Hero Image"
                    onClick={() => navigate('/')}
                    className="w-10 h-10 md:w-10 md:h-10 ml-2 rounded-lg transition-transform duration-300 hover:scale-110 hover:rotate-12"
                  />
              <span className="text-grey-600 font-semibold text-lg ml-8">برنامج الوجيز - التوجيه المدرسي (آداب)</span>
                  <div className="ml-10 flex space-x-4 gap-4">
                <button
                  onClick={() => {
                    setShowAnalysis(false);
                    setShowGlobalAnalysis(false);
                    setShowStudentList(false);
                      }}
                      disabled={data.length === 0}
                      className={`px-3 py-2 text-sm font-medium 
                        ${!showAnalysis && !showGlobalAnalysis && !showStudentList
                          ? `text-blue-600 hover:text-blue-800 bg-blue-50 rounded-lg ${isDarkMode ? 'text-bleu-400 hover:text-bleu-500 bg-gray-900' : ''}` 
                          : 'text-gray-500 hover:text-gray-700'} 
                        ${isDarkMode && (showAnalysis || showGlobalAnalysis || showStudentList) ? 'text-gray-400 hover:text-gray-300' : ''}`}
                >
                  قاعدة البيانات
                </button>
                  
                <button
                  onClick={() => {
                    setShowAnalysis(true);
                    setShowGlobalAnalysis(false);
                    setShowStudentList(false);
                      }}
                      disabled={data.length === 0}
                      className={`px-3 py-2 text-sm font-medium 
                        ${showAnalysis 
                          ? `text-green-600 hover:text-green-800 bg-green-50 rounded-lg ${isDarkMode ? 'text-green-400 hover:text-green-500 bg-green-900' : ''}`
                          : 'text-gray-500 hover:text-gray-700'} 
                        ${isDarkMode && !showAnalysis ? 'text-gray-400 hover:text-gray-300' : ''}`}
                    >
                      محضر التوجيه التدريجي
                </button>

                <button
                  onClick={() => {
                    setShowGlobalAnalysis(true);
                    setShowAnalysis(false);
                    setShowStudentList(false);
                  }}
                  disabled={data.length === 0}
                  className={`px-3 py-2 text-sm font-medium 
                    ${showGlobalAnalysis 
                      ? `text-orange-600 hover:text-orange-800 bg-orange-50 rounded-lg ${isDarkMode ? 'text-orange-400 hover:text-orange-500 bg-orange-900' : ''}`
                      : 'text-gray-500 hover:text-gray-700'} 
                    ${isDarkMode && !showGlobalAnalysis ? 'text-gray-400 hover:text-gray-300' : ''}`}
                >
                  محضر التوجيه المسبق
                  </button>

                  <button
                    onClick={() => {
                      setShowStudentList(true);
                      setShowGlobalAnalysis(false);
                      setShowAnalysis(false);
                    }}
                    disabled={data.length === 0}
                    className={`px-3 py-2 text-sm font-medium 
                      ${showStudentList 
                        ? `text-purple-600 hover:text-purple-800 bg-purple-50 rounded-lg ${isDarkMode ? 'text-purple-400 hover:text-purple-500 bg-purple-900' : ''}`
                        : 'text-gray-500 hover:text-gray-700'} 
                      ${isDarkMode && !showStudentList ? 'text-gray-400 hover:text-gray-300' : ''}`}
                  >
                    محضر التوجيه النهائي
                  </button>

                    {/* Dark/Light Mode Toggle */}
                    <button
                      onClick={toggleDarkMode}
                      className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {showGlobalAnalysis ? (
        <AdvanceDirectiveAnalysisPage data={data} isDarkMode={isDarkMode}/>
      ) : showAnalysis ? (
        <ProgressiveDirectiveAnalysisPage data={data} isDarkMode={isDarkMode}/>
      ) : showStudentList ? (
        <FinalGuidanceAnalysisPage data={data} isDarkMode={isDarkMode}/>
      ) : (
        <>
          {/* Toolbar */}
          <div className={`border-b border-gray-200 bg-white py-6 mt-16 ${isDarkMode ? 'nav-dark' : 'nav-light'}`}>
                <div className="max-w-full mx-auto px-4">
                  <div className="flex items-center space-x-4 py-2">
                <span className="font-medium">الادوات |</span>

                {/* columns button */}
                <div className="relative">
                  <button 
                        onClick={() => setOpenDropdown(openDropdown === 'columnMenu' ? null : 'columnMenu')}
                        disabled={data.length === 5}
                        className={`inline-flex items-center px-3 py-1.5 mr-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 ${isDarkMode ? 'button-dark text-gray-50 hover:bg-gray-900' : 'button-light'}`}
                  >
                    الأعمدة
                    <Columns className="w-4 h-4 mr-2" />
                  </button>
                  <div id="columnMenu" className={`absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 max-h-80 overflow-y-auto ${isDarkMode ? 'columnMenu-dark' : 'columnMenu-light'} ${openDropdown === 'columnMenu' ? '' : 'hidden'}`}>
                    <div className="py-1">
                      {columns
                      .filter(column => !hiddenColumn.includes(column))
                      .map((column, index) => (
                        <label key={column} className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isDarkMode ? 'columnMenu-dark hover:bg-gray-800' : 'columnMenu-light'}`}>
                          <input
                            type="checkbox"
                            checked={visibleColumns.includes(column)}
                            onChange={() => toggleColumn(column)}
                            className="ml-2"
                            disabled={index < 1}
                          />
                          {column}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* filters button */}
                <div className="relative">
                  <button 
                        onClick={() => setOpenDropdown(openDropdown === 'filterMenu' ? null : 'filterMenu')}
                        disabled={data.length === 0}
                        className={`inline-flex items-center px-3 py-1.5 mr-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 ${isDarkMode ? 'button-dark text-gray-50 hover:bg-gray-900' : 'button-light'}`}
                  >
                    تصفية
                    <Filter className="w-4 h-4 mr-2" />
                  </button>
                      <div id="filterMenu" className={`absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${isDarkMode ? 'columnMenu-dark' : 'columnMenu-light'} ${openDropdown === 'filterMenu' ? '' : 'hidden'}`}>
                    <div className="p-4">
                      <input
                        type="text"
                        value={filtering}
                        onChange={e => setFiltering(e.target.value)}
                        placeholder="تصفية السجلات..."
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isDarkMode ? 'columnMenu-dark border border-gray-500' : 'columnMenu-light'}`}
                      />
                    </div>
                  </div>
                </div>

                {/* page size button */}
                <div className="relative">
                  <button 
                        onClick={() => setOpenDropdown(openDropdown === 'pageSizeMenu' ? null : 'pageSizeMenu')}
                        disabled={data.length === 0}
                        className={`inline-flex items-center px-3 py-1.5 mr-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 ${isDarkMode ? 'button-dark hover:bg-gray-900' : 'button-light'}`}
                  >
                    عدد الصفوف
                    <Eye className="w-4 h-4 mr-2" />
                  </button>
                      {openDropdown === 'pageSizeMenu' && (
                        <div id="pageSizeMenu" className={`absolute z-10 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${isDarkMode ? 'columnMenu-dark' : 'columnMenu-light'}`}>
                    <div className="py-1">
                      {[10, 25, 50, -1].map(size => (
                        <button
                          key={size}
                          onClick={() => {
                            setPageSize(size === -1 ? data.length : size);
                                  setOpenDropdown(null);
                          }}
                                className={`block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right ${isDarkMode ? 'columnMenu-dark hover:bg-gray-800' : 'columnMenu-light'}`}
                        >
                          {size === -1 ? 'الكل' : size}
                        </button>
                      ))}
                    </div>
                  </div>
                      )}
                </div>

                <span className="font-medium"> | </span>

                {/* import button */}
                <div className="relative">
                  <button 
                    onClick={() => setShowImportMenu(!showImportMenu)}
                        className={`inline-flex items-center px-3 py-1.5 border border-green-300 text-sm font-medium rounded text-green-700 bg-white hover:bg-green-50 ${isDarkMode ? 'button-dark hover:bg-gray-900' : 'button-light'}`}
                  >
                    استيراد التلاميذ
                    <Upload className="w-4 h-4 mr-2" />
                  </button>
                  {showImportMenu && (
                        <div className= {`absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 rtl:space-x-reverse ${isDarkMode ? 'columnMenu-dark' : 'columnMenu-light'}`}>
                      <div className="py-1">
                        <label className={`inline-flex items-center px-3 py-2 w-56 text-sm text-gray-700 cursor-pointer ${isDarkMode ? 'columnMenu-dark hover:bg-gray-800' : 'columnMenu-light'}`}>
                        <MonitorUp className="w-4 h-4 ml-2" />
                          استيراد نتائج الفصل الاول
                          <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileUpload}
                            className="hidden"
                            multiple
                          />
                        </label>

                        <div className={`border-t border-gray-200 ${isDarkMode ? 'border-dark border-t border-gray-500' : 'border-light'}`}></div>

                        <label className={`inline-flex items-center px-3 py-2 w-56 text-sm text-gray-700 cursor-pointer ${isDarkMode ? 'columnMenu-dark hover:bg-gray-800' : 'columnMenu-light'}`}>
                          <MonitorUp className="w-4 h-4 ml-2" />
                          استيراد نتائج الفصل الثاني
                          <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileUpload2}
                            className="hidden"
                            multiple
                          />
                        </label>

                        <div className={`border-t border-gray-200 ${isDarkMode ? 'border-dark border-t border-gray-500' : 'border-light'}`}></div>

                        <label className={`inline-flex items-center px-3 py-2 w-56 text-sm text-gray-700 cursor-pointer ${isDarkMode ? 'columnMenu-dark hover:bg-gray-800' : 'columnMenu-light'}`}>
                          <MonitorUp className="w-4 h-4 ml-2" />
                          استيراد نتائج الفصل الثالث
                          <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileUpload3}
                            className="hidden"
                            multiple
                          />
                        </label>

                        <div className={`border-t border-gray-200 ${isDarkMode ? 'border-dark border-t border-gray-500' : 'border-light'}`}></div>

                        <label className={`inline-flex items-center px-3 py-2 w-56 text-sm text-gray-700 cursor-pointer ${isDarkMode ? 'columnMenu-dark hover:bg-gray-800' : 'columnMenu-light'}`}>
                        <FolderUp className="w-4 h-4 ml-2" />
                          استيراد من ملف محفوظ
                          <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleSavedFileUpload}
                            className="hidden"
                          />
                         </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* export button */}
                <button
                  onClick={exportDataToXLSX}
                      disabled={data.length === 0}
                      className={`inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded text-blue-700 bg-white hover:bg-blue-50 ${isDarkMode ? 'button-dark hover:bg-gray-900' : ''}`}
                >
                  تصدير إلى XLSX
                  <Download className="w-4 h-4 mr-2" />
                </button>

                {/* clear data button */}
                <button
                  onClick={handleClearData}
                      disabled={data.length === 0}
                      className={`inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded text-red-700 bg-white hover:bg-red-50 ${isDarkMode ? 'button-failed-dark hover:bg-red-900' : ''}`}
                >
                  مسح البيانات
                  <Trash className="w-4 h-4 mr-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-full mx-auto px-12 py-12">
            {data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-100 text-center text-gray-500">
                    <img 
                      alt="Platform Dashboard"
                      width="320"
                      height="320"
                      className=""
                      loading="lazy" 
                      decoding="async" 
                      src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    />
                    <p className={`text-lg font-semibold text-gray-400 py-4 mt-4 ${isDarkMode ? 'nav-dark' : ''}`}>
                    أين الجميع؟ يبدو أن الفصل فارغ تمامًا!
                </p>
                <p className="text-sm text-gray-400">
                      لا توجد بيانات متاحة حاليًا. الرجاء إضافة تلاميذ إلى قاعدة البيانات لعرض التحليلات.
                    </p>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => document.getElementById("localFileUpload")?.click()}
                        className={`inline-flex items-center px-3 py-1.5 mt-4 ml-2 border border-blue-300 text-sm font-medium rounded text-blue-700 bg-white hover:bg-blue-100 ${isDarkMode ? 'button-dark bg-blue-50 hover:bg-blue-800' : ''}`}
                      >
                        <MonitorUp className="w-4 h-4 ml-2" />
                        استيراد من ملف محلي
                      </button>

                      <input
                        id="localFileUpload"
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                        className="hidden"
                        multiple
                      />

                      <button
                        type="button"
                        onClick={() => document.getElementById("fileUpload")?.click()}
                        className={`inline-flex items-center px-3 py-1.5 mt-4 mr-2 border border-blue-300 text-sm font-medium rounded text-blue-700 bg-white hover:bg-blue-100 ${isDarkMode ? 'button-dark bg-blue-50 hover:bg-blue-800' : ''}`}
                      >
                        <FolderUp className="w-4 h-4 ml-2" />
                        استيراد من ملف محفوظ
                      </button>

                      <input
                        id="fileUpload"
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleSavedFileUpload}
                        className="hidden"
                        multiple
                      />
                    </div>
              </div>
            ) : (
              <DataTable
                data={data}
                columns={tableColumns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                globalFilter={filtering}
                sorting={sorting}
                setSorting={setSorting}
                pageSize={pageSize}
                setPageSize={setPageSize}
                    isDarkMode={isDarkMode}
              />
            )}
          </div>

          {editingRow && (
            <EditForm
              data={editingRow}
              onSubmit={handleSubmitEdit}
              onClose={() => setEditingRow(null)}
              columns={columns}
                  isDarkMode={isDarkMode}
            />
              )}
            </>
          )}

      <Analytics />
      
      {/* Render the confirmation modal */}
      {showConfirmationModal && (
        <ConfirmationModal data={confirmationData} onClose={() => setShowConfirmationModal(false)} />
      )}

      {showClearConfirmationModal && (
        <ClearConfirmationModal 
          onConfirm={confirmClearData} 
          onClose={() => setShowClearConfirmationModal(false)} 
        />
      )}
    </div>
  );
}