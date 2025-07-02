import React, { useMemo, useCallback, useState } from 'react';
import Select from 'react-select';
import CustomModal from '../Modal';
import { useFilterStore } from '../../../lib/DiffrencefilterStore';
import type { Student } from '../DiffrenceAnalysis';
import { Filter, FilterX } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  isDarkMode: boolean;
};

const getUniqueOptions = (students: Student[], key: keyof Student) =>
  Array.from(new Set(students.map((s) => s[key]).filter(Boolean))).map((v) => ({ value: v, label: v }));

const subjectTermOptions = [
  { value: 'الفصل الأول', label: 'الفصل الأول' },
  { value: 'الفصل الثاني', label: 'الفصل الثاني' },
  { value: 'الفصل الثالث', label: 'الفصل الثالث' },
  { value: 'المعدلات السنوية', label: 'المعدلات السنوية' },
  { value: 'معدلات الشهادة', label: 'معدلات الشهادة' },
];

/*const subjectsByTerm: Record<string, { value: string; label: string }[]> = {
  'الفصل الأول': [
    { value: 'اللغة العربية ف 1', label: 'اللغة العربية ف 1' },
    { value: 'اللغة الأمازيغية ف 1', label: 'اللغة الأمازيغية ف 1' },
    { value: 'اللغة الفرنسية ف 1', label: 'اللغة الفرنسية ف 1' },
    { value: 'اللغة الإنجليزية ف 1', label: 'اللغة الإنجليزية ف 1' },
    { value: 'التربية الإسلامية ف 1', label: 'التربية الإسلامية ف 1' },
    { value: 'التربية المدنية ف 1', label: 'التربية المدنية ف 1' },
    { value: 'التاريخ والجغرافيا ف 1', label: 'التاريخ والجغرافيا ف 1' },
    { value: 'الرياضيات ف 1', label: 'الرياضيات ف 1' },
    { value: 'ع الطبيعة و الحياة ف 1', label: 'ع الطبيعة و الحياة ف 1' },
    { value: 'ع الفيزيائية والتكنولوجيا ف 1', label: 'ع الفيزيائية والتكنولوجيا ف 1' },
    { value: 'المعلوماتية ف 1', label: 'المعلوماتية ف 1' },
    { value: 'التربية التشكيلية ف 1', label: 'التربية التشكيلية ف 1' },
    { value: 'التربية الموسيقية ف 1', label: 'التربية الموسيقية ف 1' },
    { value: 'ت البدنية و الرياضية ف 1', label: 'ت البدنية و الرياضية ف 1' },
    { value: 'المعدل السنوي', label: 'المعدل السنوي' },
    { value: 'معدل ش ت م', label: 'معدل ش ت م' },
    { value: 'معدل الإنتقال', label: 'معدل الإنتقال' },
  ],
  'الفصل الثاني': [
    { value: 'اللغة العربية ف 2', label: 'اللغة العربية ف 2' },
    { value: 'اللغة الأمازيغية ف 2', label: 'اللغة الأمازيغية ف 2' },
    { value: 'اللغة الفرنسية ف 2', label: 'اللغة الفرنسية ف 2' },
    { value: 'اللغة الإنجليزية ف 2', label: 'اللغة الإنجليزية ف 2' },
    { value: 'التربية الإسلامية ف 2', label: 'التربية الإسلامية ف 2' },
    { value: 'التربية المدنية ف 2', label: 'التربية المدنية ف 2' },
    { value: 'التاريخ والجغرافيا ف 2', label: 'التاريخ والجغرافيا ف 2' },
    { value: 'الرياضيات ف 2', label: 'الرياضيات ف 2' },
    { value: 'ع الطبيعة و الحياة ف 2', label: 'ع الطبيعة و الحياة ف 2' },
    { value: 'ع الفيزيائية والتكنولوجيا ف 2', label: 'ع الفيزيائية والتكنولوجيا ف 2' },
    { value: 'المعلوماتية ف 2', label: 'المعلوماتية ف 2' },
    { value: 'التربية التشكيلية ف 2', label: 'التربية التشكيلية ف 2' },
    { value: 'التربية الموسيقية ف 2', label: 'التربية الموسيقية ف 2' },
    { value: 'ت البدنية و الرياضية ف 2', label: 'ت البدنية و الرياضية ف 2' },
    { value: 'المعدل السنوي', label: 'المعدل السنوي' },
    { value: 'معدل ش ت م', label: 'معدل ش ت م' },
    { value: 'معدل الإنتقال', label: 'معدل الإنتقال' },
  ],
  'الفصل الثالث': [
    { value: 'اللغة العربية ف 3', label: 'اللغة العربية ف 3' },
    { value: 'اللغة الأمازيغية ف 3', label: 'اللغة الأمازيغية ف 3' },
    { value: 'اللغة الفرنسية ف 3', label: 'اللغة الفرنسية ف 3' },
    { value: 'اللغة الإنجليزية ف 3', label: 'اللغة الإنجليزية ف 3' },
    { value: 'التربية الإسلامية ف 3', label: 'التربية الإسلامية ف 3' },
    { value: 'التربية المدنية ف 3', label: 'التربية المدنية ف 3' },
    { value: 'التاريخ والجغرافيا ف 3', label: 'التاريخ والجغرافيا ف 3' },
    { value: 'الرياضيات ف 3', label: 'الرياضيات ف 3' },
    { value: 'ع الطبيعة و الحياة ف 3', label: 'ع الطبيعة و الحياة ف 3' },
    { value: 'ع الفيزيائية والتكنولوجيا ف 3', label: 'ع الفيزيائية والتكنولوجيا ف 3' },
    { value: 'المعلوماتية ف 3', label: 'المعلوماتية ف 3' },
    { value: 'التربية التشكيلية ف 3', label: 'التربية التشكيلية ف 3' },
    { value: 'التربية الموسيقية ف 3', label: 'التربية الموسيقية ف 3' },
    { value: 'ت البدنية و الرياضية ف 3', label: 'ت البدنية و الرياضية ف 3' },
    { value: 'المعدل السنوي', label: 'المعدل السنوي' },
    { value: 'معدل ش ت م', label: 'معدل ش ت م' },
    { value: 'معدل الإنتقال', label: 'معدل الإنتقال' },
  ],
  'المعدلات السنوية': [
    { value: 'اللغة العربية م س', label: 'اللغة العربية م س' },
    { value: 'اللغة الأمازيغية م س', label: 'اللغة الأمازيغية م س' },
    { value: 'اللغة الفرنسية م س', label: 'اللغة الفرنسية م س' },
    { value: 'اللغة الإنجليزية م س', label: 'اللغة الإنجليزية م س' },
    { value: 'التربية الإسلامية م س', label: 'التربية الإسلامية م س' },
    { value: 'التربية المدنية م س', label: 'التربية المدنية م س' },
    { value: 'التاريخ والجغرافيا م س', label: 'التاريخ والجغرافيا م س' },
    { value: 'الرياضيات م س', label: 'الرياضيات م س' },
    { value: 'ع الطبيعة و الحياة م س', label: 'ع الطبيعة و الحياة م س' },
    { value: 'ع الفيزيائية والتكنولوجيا م س', label: 'ع الفيزيائية والتكنولوجيا م س' },
    { value: 'المعلوماتية م س', label: 'المعلوماتية م س' },
    { value: 'التربية التشكيلية م س', label: 'التربية التشكيلية م س' },
    { value: 'التربية الموسيقية م س', label: 'التربية الموسيقية م س' },
    { value: 'ت البدنية و الرياضية م س', label: 'ت البدنية و الرياضية م س' },
    { value: 'المعدل السنوي', label: 'المعدل السنوي' },
    { value: 'معدل ش ت م', label: 'معدل ش ت م' },
    { value: 'معدل الإنتقال', label: 'معدل الإنتقال' },
  ],
  'معدلات الشهادة': [
    { value: 'العربية ش ت م', label: 'العربية ش ت م' },
    { value: 'الأمازيغية ش ت م', label: 'الأمازيغية ش ت م' },
    { value: 'الفرنسية ش ت م', label: 'الفرنسية ش ت م' },
    { value: 'الإنجليزية ش ت م', label: 'الإنجليزية ش ت م' },
    { value: 'ت إسلامية ش ت م', label: 'ت إسلامية ش ت م' },
    { value: 'ت مدنية ش ت م', label: 'ت مدنية ش ت م' },
    { value: 'تاريخ وجغرافيا ش ت م', label: 'تاريخ وجغرافيا ش ت م' },
    { value: 'رياضيات ش ت م', label: 'رياضيات ش ت م' },
    { value: 'علوم ط ش ت م', label: 'علوم ط ش ت م' },
    { value: 'فيزياء ش ت م', label: 'فيزياء ش ت م' },
    { value: 'معلوماتية ش ت م', label: 'معلوماتية ش ت م' },
    { value: 'ت تشكيلية ش ت م', label: 'ت تشكيلية ش ت م' },
    { value: 'ت موسيقية ش ت م', label: 'ت موسيقية ش ت م' },
    { value: 'ت بدنية ش ت م', label: 'ت بدنية ش ت م' },
    { value: 'المعدل السنوي', label: 'المعدل السنوي' },
    { value: 'معدل ش ت م', label: 'معدل ش ت م' },
    { value: 'معدل الإنتقال', label: 'معدل الإنتقال' },
  ],
};*/

export const FilterModal: React.FC<Props> = ({ isOpen, onClose, students, isDarkMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    gender, 
    repeat, 
    directorate, 
    school, 
    department, 
    decision, 
    profile,
    subjectTermA,
    subjectTermB,
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
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-1">الفترة الأولى للمقارنة</label>
              <Select
                options={subjectTermOptions}
                value={subjectTermOptions.find(opt => opt.value === subjectTermA) || subjectTermOptions[0]}
                onChange={val => {
                  if (val && typeof val.value === 'string') {
                    setFilter('subjectTermA', val.value as 'الفصل الأول' | 'الفصل الثاني' | 'الفصل الثالث' | 'المعدلات السنوية');
                  }
                }}
                styles={selectStyles}
                isClearable={false}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1">الفترة الثانية للمقارنة</label>
              <Select
                options={subjectTermOptions}
                value={subjectTermOptions.find(opt => opt.value === subjectTermB) || subjectTermOptions[1]}
                onChange={val => {
                  if (val && typeof val.value === 'string') {
                    setFilter('subjectTermB', val.value as 'الفصل الأول' | 'الفصل الثاني' | 'الفصل الثالث' | 'المعدلات السنوية');
                  }
                }}
                styles={selectStyles}
                isClearable={false}
              />
            </div>
          </div>
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