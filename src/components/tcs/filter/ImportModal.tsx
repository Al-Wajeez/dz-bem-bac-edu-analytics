import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { addData, getAllData, updateData } from '../../../lib/dbtcs';

interface ImportStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  data?: {
    fileName: string;
    rowsImported: number;
    rowsFailed: number;
    totalRows: number;
  };
  files?: {
    fileName: string;
    rowsImported: number;
    rowsFailed: number;
    totalRows: number;
  }[];
  error?: string;
}

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (data: any[]) => void;
  isDarkMode: boolean;
}

// Import the enrichment function from DashboardTCS
/*const enrichStudentsWithDecisionAndProfile = (students: any[]): any[] => {
  const subjects = [
    'اللغة العربية',
    'اللغة الأمازيغية',
    'اللغة الفرنسية',
    'اللغة الإنجليزية',
    'التربية الإسلامية',
    'التربية المدنية',
    'التاريخ والجغرافيا',
    'الرياضيات',
    'ع الطبيعة و الحياة',
    'ع الفيزيائية والتكنولوجيا',
    'المعلوماتية',
    'التربية التشكيلية',
    'التربية الموسيقية',
    'ت البدنية و الرياضية'
  ];

  return students.map(student => {
    // Calculate semester averages for all subjects
    const semesterAverages: { [key: string]: number } = {};
    
    subjects.forEach((subject) => {
      const g1 = Number(student[`${subject} ف 1`]) || 0;
      const g2 = Number(student[`${subject} ف 2`]) || 0;
      const g3 = Number(student[`${subject} ف 3`]) || 0;

      const isValid = !isNaN(g1) && !isNaN(g2) && !isNaN(g3);
      semesterAverages[`${subject} م س`] = isValid ? Number(((g1 + g2 + g3) / 3).toFixed(2)) : 0;
    });

    // Decision logic
    const mainGrade = Number(student['معدل ش ت م']) || 0;
    const transferGrade = Number(student['معدل الإنتقال']) || 0;
    let decision = '';
    if (mainGrade >= 10) {
      decision = 'ينتقل إلى قسم أعلى';
    } else if (transferGrade >= 10) {
      decision = 'ينتقل إلى قسم أعلى';
    } else {
      decision = 'يعيد السنة';
    }

    // Profile logic
    const arabicGrade = semesterAverages['اللغة العربية م س'] || 0;
    const frenchGrade = semesterAverages['اللغة الفرنسية م س'] || 0;
    const englishGrade = semesterAverages['اللغة الإنجليزية م س'] || 0;
    const historyGrade = semesterAverages['التاريخ والجغرافيا م س'] || 0;
    const mathGrade = semesterAverages['الرياضيات م س'] || 0;
    const scienceGrade = semesterAverages['ع الطبيعة و الحياة م س'] || 0;
    const physicsGrade = semesterAverages['ع الفيزيائية والتكنولوجيا م س'] || 0;
    const tcl = ((arabicGrade * 5) + (frenchGrade * 4) + (englishGrade * 3) + (historyGrade * 2)) / 14;
    const tcs = ((arabicGrade * 2) + (mathGrade * 4) + (scienceGrade * 4) + (physicsGrade * 4)) / 14;
    let profile = '';
    if (tcl < tcs && transferGrade >= 10) {
      profile = 'جذع مشترك علوم وتكنولوجيا';
    } else if (tcl > tcs && transferGrade >= 10) {
      profile = 'جذع مشترك آداب وفلسفة';
    } else {
      profile = 'غير معني';
    }

    return {
      ...student,
      ...semesterAverages,
      'القرار': decision,
      'الملمح': profile,
    };
  });
};*/

const ImportModal: React.FC<ImportModalProps> = ({ 
  isOpen, 
  onClose, 
  onImportComplete, 
  isDarkMode 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<ImportStep[]>([
    {
      id: 1,
      title: 'استيراد نتائج شهادة التعليم المتوسط',
      description: 'قم باختيار ملف Excel يحتوي على نتائج الفصل الأول',
      status: 'pending'
    },
    {
      id: 2,
      title: 'استيراد نتائج الفصل الثالث',
      description: 'قم باختيار ملف Excel يحتوي على نتائج الفصل الثالث',
      status: 'pending'
    }
  ]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const resetModal = useCallback(() => {
    setCurrentStep(1);
    setSteps([
      {
        id: 1,
        title: 'استيراد نتائج شهادة التعليم المتوسط',
        description: 'قم باختيار ملف Excel يحتوي على نتائج الفصل الأول',
        status: 'pending'
      },
      {
        id: 2,
        title: 'استيراد نتائج الفصل الثالث',
        description: 'قم باختيار ملف Excel يحتوي على نتائج الفصل الثالث',
        status: 'pending'
      }
    ]);
    setIsProcessing(false);
  }, []);

  const handleClose = useCallback(() => {
    resetModal();
    onClose();
  }, [resetModal, onClose]);

  const updateStep = useCallback((stepId: number, updates: Partial<ImportStep>) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  }, []);

  // Step 1: handleFileUpload function (exact copy)
  const handleFileUpload = async (files: FileList) => {
    const allJsonData: any[] = [];
    const confirmationEntries: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const workbook = XLSX.read(e.target?.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        
        let lastTwoDigits = '';
        let strdirectorate = '';
        let strschoolName = '';
        //let strschoolTrunk = '';
        const jsonData: any[] = [];

        const excludedHeaders = [31, 29, 27, 25, 23, 21, 19, 17, 15, 13, 11, 9, 7, 5];
        for (let R = 1; R <= range.e.r; R++) {
          const row: any = {};
          const cellB = worksheet[XLSX.utils.encode_cell({ r: R, c: 0 })];
    
          if (!cellB || !cellB.v) continue;
          
          for (let C = 0; C <= 33; C++) {
            const headerCell = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })];
            const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];

            if (!headerCell || !headerCell.v) continue;

            let header = headerCell.v;

            // Normalize header names
            if (header === 'اللقب و الإسم') {
              header = 'اللقب و الاسم';
            }

            if (excludedHeaders.includes(C)) continue;

            if (cell && typeof cell.v === 'number' && header === 'تاريخ الميلاد') {
              const jsDate = XLSX.SSF.parse_date_code(cell.v);
              row[header] = `${jsDate.y}-${String(jsDate.m).padStart(2, '0')}-${String(jsDate.d).padStart(2, '0')}`;
            } else {
              row[header] = cell ? cell.v : '';
            }
          }
    
          jsonData.push(row);
        }

        allJsonData.push(...jsonData);

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

    await addData(allJsonData);
    
    return {
      success: true,
      data: allJsonData,
      stats: confirmationEntries.map(entry => ({
        fileName: 'Step 1 File',
        rowsImported: entry.totalRows,
        rowsFailed: 0,
        totalRows: entry.totalRows
      }))
    };
  };

  // Step 2: handleFileUpload3 function (exact copy)
  const handleFileUpload3 = async (files: FileList) => {
    const existingData = await getAllData();
    console.log('Existing data:', existingData);
    console.log('Number of existing records:', existingData.length);

    const confirmationEntries: { strdirectorate: string, strschoolName: string, lastTwoDigits: string, totalRows: number }[] = [];
    const dataToUpdate: any[] = [];
    const dataToAdd: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const workbook = XLSX.read(e.target?.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        
        let strdirectorate = '';
        let strschoolName = '';
        let lastTwoDigits = '';

        const cellA4 = worksheet[XLSX.utils.encode_cell({ r: 3, c: 0 })];
        if (cellA4 && cellA4.v) {
          strschoolName = String(cellA4.v);
        }

        const cellA3 = worksheet[XLSX.utils.encode_cell({ r: 2, c: 0 })];
        if (cellA3 && cellA3.v) {
          strdirectorate = String(cellA3.v);
        }

        const cellA5 = worksheet[XLSX.utils.encode_cell({ r: 4, c: 0 })];
        if (cellA5 && cellA5.v) {
           lastTwoDigits = String(cellA5.v).slice(-2);
        }

        const jsonData: any[] = [];

        for (let R = 6; R <= range.e.r; R++) {
          const row: any = { 'اللقب و الاسم': '' };
          const cellB = worksheet[XLSX.utils.encode_cell({ r: R, c: 1 })];

          if (!cellB || !cellB.v) continue;
          
          if (cellB && cellB.v) {
            row['اللقب و الاسم'] = String(cellB.v).trim();
          }
          
          for (let C = 1; C <= 49; C++) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
            const headerCell = worksheet[XLSX.utils.encode_cell({ r: 5, c: C })];
            
            if (headerCell && headerCell.v) {
                const header = String(headerCell.v).trim();
                if (header && header !== 'اللقب و الاسم') {
                    if (cell) {
                        if (header === 'تاريخ الميلاد' && typeof cell.v === 'number') {
                            const jsDate = XLSX.SSF.parse_date_code(cell.v);
                            row[header] = `${jsDate.y}-${String(jsDate.m).padStart(2, '0')}-${String(jsDate.d).padStart(2, '0')}`;
                        } else {
                            row[header] = cell.v;
                        }
                    } else {
                        row[header] = '';
                    }
                }
            }
          }

          row['المؤسسة'] = strschoolName;
          row['المديرية'] = strdirectorate;

          const strschoolTrunkMatch = String(cellA5?.v || '').match(/جدع مشترك (آداب|علوم)/);
          if (strschoolName.startsWith('متوسطة')) {
              row['القسم'] = lastTwoDigits;
          } else if (strschoolName.startsWith('ثانوية')) {
              row['القسم'] = strschoolTrunkMatch ? 'جذع مشترك ' + strschoolTrunkMatch[1] + ' ' + lastTwoDigits : '';
          }

          jsonData.push(row);
        }

        for (const newRow of jsonData) {
          const existingRow = existingData.find((exRow: any) => 
            String(exRow['اللقب و الاسم']).trim() === String(newRow['اللقب و الاسم']).trim()
          );

          if (existingRow) {
            const updatedRow: any = { ...existingRow };
            for (const key in newRow) {
              if (Object.prototype.hasOwnProperty.call(newRow, key) && newRow[key] !== '' && key !== 'id') {
                updatedRow[key] = newRow[key];
              }
            }
            dataToUpdate.push(updatedRow);
          } else {
            dataToAdd.push(newRow);
          }
        }

        confirmationEntries.push({
          strdirectorate,
          strschoolName,
          lastTwoDigits,
          totalRows: jsonData.length,
        });
      };
      reader.readAsBinaryString(file);
    }

    await Promise.all(Array.from(files).map(file => new Promise<void>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve();
      reader.readAsBinaryString(file);
    })));

    if (dataToUpdate.length > 0) {
      console.log('Updating records:', dataToUpdate);
      for (const record of dataToUpdate) {
        if (record.id !== undefined) {
           await updateData(record.id, record);
        } else {
            console.error('Attempted to update a record without an ID:', record);
        }
      }
    }

    if (dataToAdd.length > 0) {
      console.log('Adding new records:', dataToAdd);
      await addData(dataToAdd);
    }

    return {
      success: true,
      data: [...dataToUpdate, ...dataToAdd],
      stats: confirmationEntries.map(entry => ({
        fileName: 'Step 2 File',
        rowsImported: entry.totalRows,
        rowsFailed: 0,
        totalRows: entry.totalRows
      }))
    };
  };

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>, stepId: number) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    updateStep(stepId, { status: 'loading' });
    setIsProcessing(true);

    try {
      let result;
      if (stepId === 1) {
        result = await handleFileUpload(files);
      } else {
        result = await handleFileUpload3(files);
      }
      
      if (result.success && result.stats) {
        updateStep(stepId, {
          status: 'success',
          files: result.stats
        });
      } else {
        updateStep(stepId, {
          status: 'error',
          error: 'حدث خطأ غير متوقع'
        });
      }
    } catch (error) {
      updateStep(stepId, {
        status: 'error',
        error: 'حدث خطأ أثناء معالجة الملف'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [updateStep]);

  const handleNextStep = useCallback(() => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleCompleteImport = useCallback(async () => {
    setIsProcessing(true);
    
    try {
      // Get the final data from database
      const finalData = await getAllData();
      
      // Apply enrichment to the data
      //const enrichedData = enrichStudentsWithDecisionAndProfile(finalData);
      
      // Update the database with enriched data
      for (const record of finalData) {
        if (record.id !== undefined) {
          await updateData(record.id, record);
        }
      }
      
      // Call the parent's import complete handler with enriched data
      onImportComplete(finalData);
      
      // Close modal
      handleClose();
    } catch (error) {
      console.error('Error completing import:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [onImportComplete, handleClose]);

  const handleResetFile = useCallback((stepId: number) => {
    updateStep(stepId, {
      status: 'pending',
      data: undefined,
      error: undefined
    });
    
    if (stepId === 1 && fileInputRef1.current) {
      fileInputRef1.current.value = '';
    } else if (stepId === 2 && fileInputRef2.current) {
      fileInputRef2.current.value = '';
    }
  }, [updateStep]);

  const canProceedToNext = steps[currentStep - 1]?.status === 'success';
  const canComplete = steps.every(step => step.status === 'success');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        dir="rtl"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`relative rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
              }`}>
                <Upload className={`w-6 h-6 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <h3 className="text-xl font-bold">استيراد البيانات</h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  اتبع الخطوات لاستيراد بيانات التلاميذ
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step Indicators */}
          <div className="px-12 mt-4 md-2">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  {/* Step Circle and Label */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        step.status === 'success'
                          ? 'bg-green-500 border-green-500 text-white'
                          : step.status === 'error'
                          ? 'bg-red-500 border-red-500 text-white'
                          : step.status === 'loading' || currentStep === step.id
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : isDarkMode
                          ? 'border-gray-600 text-gray-400'
                          : 'border-gray-300 text-gray-500'
                      }`}
                    >
                      {step.status === 'loading' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : step.status === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : step.status === 'error' ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">{step.id}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 text-center max-w-20 ${
                        currentStep === step.id
                          ? isDarkMode
                            ? 'text-blue-400'
                            : 'text-blue-600'
                          : isDarkMode
                          ? 'text-gray-400'
                          : 'text-gray-500'
                      }`}
                    >
                  
                    </span>
                  </div>

                  {/* Line Between Steps */}
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 w-64 sm:w-20 mx-2 sm:mx-4 transition-all duration-300 ${
                        step.status === 'success'
                          ? 'bg-green-500'
                          : isDarkMode
                          ? 'bg-gray-600'
                          : 'bg-gray-300'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>


          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`${
                      currentStep === step.id ? 'block' : 'hidden'
                    }`}
                  >
                    {/* Step Header */}
                    <div className="mb-6">
                      <h4 className="text-ms text-center font-semibold mb-2">{step.title}</h4>
                    </div>

                    {/* File Upload Area */}
                    {step.status === 'pending' && (
                      <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        isDarkMode 
                          ? 'border-gray-600 hover:border-gray-500' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <FileSpreadsheet className={`w-12 h-12 mx-auto mb-4 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <p className="text-sm mb-4">اسحب وأفلت ملفات Excel هنا أو انقر للاختيار (يمكن اختيار عدة ملفات)</p>
                        <input
                          ref={step.id === 1 ? fileInputRef1 : fileInputRef2}
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={(e) => handleFileSelect(e, step.id)}
                          className="hidden"
                          multiple
                        />
                        <button
                          onClick={() => (step.id === 1 ? fileInputRef1 : fileInputRef2)?.current?.click()}
                          disabled={isProcessing}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            isDarkMode
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          اختيار ملفات
                        </button>
                      </div>
                    )}

                    {/* Loading State */}
                    {step.status === 'loading' && (
                      <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                        <p className="text-sm">جاري معالجة الملفات...</p>
                      </div>
                    )}

                    {/* Success State */}
                    {step.status === 'success' && step.files && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-4 rounded-lg border ${
                          isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div>
                              <h5 className="font-medium text-green-800 dark:text-green-400">
                                تم استيراد {step.files.length} ملف بنجاح
                              </h5>
                              <p className="text-sm text-green-600 dark:text-green-300">
                                {step.files.length === 1 ? step.files[0].fileName : `${step.files.length} ملفات`}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleResetFile(step.id)}
                            className={`p-1 rounded hover:bg-red-100 transition-colors ${
                              isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-100'
                            }`}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                        
                        {/* Summary Statistics */}
                        <div className="mt-4 grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                              {step.files.reduce((sum, file) => sum + file.rowsImported, 0)}
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-300">
                              صفوف مستوردة
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                              {step.files.reduce((sum, file) => sum + file.rowsFailed, 0)}
                            </div>
                            <div className="text-xs text-orange-600 dark:text-orange-300">
                              صفوف فشلت
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                              {step.files.reduce((sum, file) => sum + file.totalRows, 0)}
                            </div>
                            <div className="text-xs text-blue-600 dark:text-blue-300">
                              إجمالي الصفوف
                            </div>
                          </div>
                        </div>

                        {/* Individual File Details */}
                        {step.files.length > 1 && (
                          <div className="mt-4 border-t pt-4">
                            <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              تفاصيل الملفات:
                            </h6>
                            <div className="space-y-2 max-h-32 mr-4 ml-4">
                              {step.files.map((file, index) => (
                                <div key={index} className="flex justify-between items-center text-xs">
                                  <span className="text-gray-600 dark:text-gray-400 truncate">
                                    {file.fileName}
                                  </span>
                                  <span className="text-green-600 dark:text-green-400">
                                    {file.rowsImported} صف
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Error State */}
                    {step.status === 'error' && step.error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-4 rounded-lg border ${
                          isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <div>
                              <h5 className="font-medium text-red-800 dark:text-red-400">
                                فشل في استيراد الملفات
                              </h5>
                              <p className="text-sm text-red-600 dark:text-red-300">
                                {step.error}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleResetFile(step.id)}
                            className={`p-1 rounded hover:bg-red-100 transition-colors ${
                              isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-100'
                            }`}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className={`p-6 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <button
                onClick={handlePreviousStep}
                disabled={currentStep === 1 || isProcessing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === 1 || isProcessing
                    ? 'opacity-50 cursor-not-allowed'
                    : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <ArrowRight className="w-4 h-4" />
                السابق
              </button>

              <div className="flex items-center gap-3">
                {currentStep < 2 ? (
                  <button
                    onClick={handleNextStep}
                    disabled={!canProceedToNext || isProcessing}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                      !canProceedToNext || isProcessing
                        ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    التالي
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleCompleteImport}
                    disabled={!canComplete || isProcessing}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                      !canComplete || isProcessing
                        ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جاري الاستيراد...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        إكمال الاستيراد
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImportModal;