import React, { useMemo, useCallback, useState } from 'react';
import Select from 'react-select';
import CustomModal from '../Modal';
import { useFilterStore } from '../../../lib/filterStore';
import type { Student } from '../BEMAnalysis';
import { Filter, FilterX } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  isDarkMode: boolean;
};

const getUniqueOptions = (students: Student[], key: keyof Student) =>
  Array.from(new Set(students.map((s) => s[key]).filter(Boolean))).map((v) => ({ value: v, label: v }));

export const FilterModal: React.FC<Props> = ({ isOpen, onClose, students, isDarkMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  // Call useFilterStore only once and destructure all needed values
  const {
    gender, 
    repeat, 
    directorate, 
    school, 
    department, 
    decision, 
    profile,
    setFilter, 
    clearFilters
  } = useFilterStore();

  // Dynamic options - memoized to prevent unnecessary recalculations
  const directorateOptions = useMemo(() => getUniqueOptions(students, 'المديرية'), [students]);
  const schoolOptions = useMemo(() => getUniqueOptions(students, 'المؤسسة'), [students]);
  const departmentOptions = useMemo(() => getUniqueOptions(students, 'القسم'), [students]);

  // Memoize select styles to prevent recreation on every render
  const selectStyles = useMemo(() => ({
    control: (provided: any) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#374151' : 'white',
      borderColor: isDarkMode ? '#6B7280' : '#D1D5DB',
      color: isDarkMode ? 'white' : 'black',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#374151' : 'white',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused 
        ? (isDarkMode ? '#4B5563' : '#F3F4F6') 
        : 'transparent',
      color: isDarkMode ? 'white' : 'black',
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#4B5563' : '#E5E7EB',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: isDarkMode ? 'white' : 'black',
    }),
    input: (provided: any) => ({
      ...provided,
      color: isDarkMode ? 'white' : 'black',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: isDarkMode ? 'white' : 'black',
    }),
  }), [isDarkMode]);

  // Memoize onChange handlers to prevent unnecessary re-renders
  const handleGenderChange = useCallback((vals: any) => {
    setFilter('gender', vals.map((v: any) => v.value as 'ذكر' | 'أنثى'));
  }, [setFilter]);

  const handleRepeatChange = useCallback((vals: any) => {
    setFilter('repeat', vals.map((v: any) => v.value as 'نعم' | 'لا'));
  }, [setFilter]);

  const handleDirectorateChange = useCallback((vals: any) => {
    setFilter('directorate', vals.map((v: any) => v.value as string));
  }, [setFilter]);

  const handleSchoolChange = useCallback((vals: any) => {
    setFilter('school', vals.map((v: any) => v.value as string));
  }, [setFilter]);

  const handleDepartmentChange = useCallback((vals: any) => {
    setFilter('department', vals.map((v: any) => v.value as string));
  }, [setFilter]);

  const handleDecisionChange = useCallback((vals: any) => {
    setFilter('decision', vals.map((v: any) => v.value as 'ينتقل إلى قسم أعلى' | 'يعيد السنة' | 'يوجه إلى التكوين المهني'));
  }, [setFilter]);

  const handleProfileChange = useCallback((vals: any) => {
    setFilter('profile', vals.map((v: any) => v.value as 'جذع مشترك علوم وتكنولوجيا' | 'جذع مشترك آداب وفلسفة'));
  }, [setFilter]);

  // Don't render if modal is not open
  if (!isOpen) {
    return null;
  }

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      isDarkMode={isDarkMode}
      title="تصفية البيانات"
    >

      <div className={`p-6 w-full max-w-4xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        
        <div className="space-y-4">
          <div className="flex flex-wrap grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">

              <div>
                <label className="block text-ms font-bold mb-2">الجنس</label>
                <Select
                  isMulti
                  options={[{ value: 'ذكر', label: 'ذكر' }, { value: 'أنثى', label: 'أنثى' }]}
                  value={gender.map((g: 'ذكر' | 'أنثى') => ({ value: g, label: g }))}
                  onChange={handleGenderChange}
                  placeholder="اختر الجنس"
                  styles={selectStyles}
                  isClearable
                />
              </div>

              <div>
                <label className="block text-ms font-bold mb-2">الإعادة</label>
                <Select
                  isMulti
                  options={[{ value: 'نعم', label: 'نعم' }, { value: 'لا', label: 'لا' }]}
                  value={repeat.map((g: 'نعم' | 'لا') => ({ value: g, label: g }))}
                  onChange={handleRepeatChange}
                  placeholder="اختر الإعادة"
                  styles={selectStyles}
                  isClearable
                />
              </div>
          </div>

          <div className="flex flex-wrap grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div>
              <label className="block text-ms font-bold mb-2">المديرية</label>
              <Select
                isMulti
                options={directorateOptions}
                value={directorate.map((g: string) => ({ value: g, label: g }))}
                onChange={handleDirectorateChange}
                placeholder="اختر المديرية"
                styles={selectStyles}
                isClearable
              />
            </div>

            <div>
              <label className="block text-ms font-bold mb-2">المؤسسة</label>
              <Select
                isMulti
                options={schoolOptions}
                value={school.map((g: string) => ({ value: g, label: g }))}
                onChange={handleSchoolChange}
                placeholder="اختر المؤسسة"
                styles={selectStyles}
                isClearable
              />
            </div>
          </div>

          <div>
            <label className="block text-ms font-bold mb-2">القسم</label>
            <Select
              isMulti
              options={departmentOptions}
              value={department.map((g: string) => ({ value: g, label: g }))}
              onChange={handleDepartmentChange}
              placeholder="اختر القسم"
              styles={selectStyles}
              isClearable
            />
          </div>

          <div>
            <label className="block text-ms font-bold mb-2">القرار</label>
            <Select
              isMulti
              options={[
                { value: 'ينتقل إلى قسم أعلى', label: 'ينتقل إلى قسم أعلى' },
                { value: 'يعيد السنة', label: 'يعيد السنة' },
                { value: 'يوجه إلى التكوين المهني', label: 'يوجه إلى التكوين المهني' }
              ]}
              value={decision.map((g: 'ينتقل إلى قسم أعلى' | 'يعيد السنة' | 'يوجه إلى التكوين المهني') => ({ value: g, label: g }))}
              onChange={handleDecisionChange}
              placeholder="اختر القرار"
              styles={selectStyles}
              isClearable
            />
          </div>

          <div>
            <label className="block text-ms font-bold mb-2">الملمح</label>
            <Select
              isMulti
              options={[
                { value: 'جذع مشترك علوم وتكنولوجيا', label: 'جذع مشترك علوم وتكنولوجيا' },
                { value: 'جذع مشترك آداب وفلسفة', label: 'جذع مشترك آداب وفلسفة' }
              ]}
              value={profile.map((g: 'جذع مشترك علوم وتكنولوجيا' | 'جذع مشترك آداب وفلسفة') => ({ value: g, label: g }))}
              onChange={handleProfileChange}
              placeholder="اختر الملمح"
              styles={selectStyles}
              isClearable
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 justify-end" dir="rtl">
          <button
            className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            onClick={clearFilters}
            type="button"
          >
            مسح الكل
            <FilterX className="w-5 h-5 mr-4" />
          </button>
          
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                onClose();
                setIsLoading(false);
              }, 1500);
            }}
            type="button"
            disabled={isLoading}
          >
            <span>تطبيق</span>
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="12"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              <Filter className="w-5 h-5" />
            )}
          </button>


        </div>
      </div>
    </CustomModal>
  );
}; 