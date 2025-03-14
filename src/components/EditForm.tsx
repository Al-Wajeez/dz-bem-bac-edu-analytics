import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { X, Save, ArrowLeft, FilePlus2 } from 'lucide-react';
import Select from 'react-select';

interface EditFormProps {
  data: any;
  onSubmit: (data: any) => void;
  onClose: () => void;
  columns: string[];
  isDarkMode: boolean; // Accept dark mode state as a prop
}

export function EditForm({ data, onSubmit, onClose, isDarkMode }: EditFormProps) {
  const defaultValues = {
    ...data
  };

  const { register, handleSubmit, control, watch, reset } = useForm({ defaultValues: data });
  const watchFields = watch();

  // Add type definitions at the top of your file
  type SelectOption = { value: string; label: string };
  type MultiSelectValue = string | SelectOption | (string | SelectOption)[];

  // Modified renderMultiSelect with proper typing
  const renderMultiSelect = (name: string, options: string[]) => (
    <Controller 
      name={name}
      control={control}
      render={({ field }) => {
        // Handle all possible value formats
        const value = (() => {
          if (Array.isArray(field.value)) {
            return field.value.map(v => ({
              value: typeof v === 'string' ? v.trim() : v?.value?.trim() || '',
              label: typeof v === 'string' ? v.trim() : v?.label?.trim() || ''
            }));
          }
          
          if (typeof field.value === 'string') {
            return field.value.split(',')
              .map(v => ({
                value: v.trim(),
                label: v.trim()
              }));
          }
          
          return [];
        })();

        return (
          <Select
            isMulti
            options={options.map(opt => ({ value: opt, label: opt }))}
            value={value}
            onChange={(newValue) => 
              field.onChange(newValue.map(nv => nv.value))
            }
            className={`mt-1 ${isDarkMode ? 'dark-mode' : ''}`}
            classNamePrefix="select"
            placeholder="اختر..."
            noOptionsMessage={() => "لا توجد خيارات"}
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: isDarkMode ? '' : '#ffffff', // Dark mode background
                border: `1px solid ${isDarkMode ? '#4B5563' : '#e2e8f0'}`, // Dark mode border
                borderRadius: '8px',
                boxShadow: state.isFocused ? `0 0 0 2px ${isDarkMode ? '#64748B' : '#94a3b8'}` : 'none', // Focus border color
                '&:hover': {
                  borderColor: isDarkMode ? '#64748B' : '#94a3b8',
                },
                color: isDarkMode ? '#F1F5F9' : '', // Text color
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: isDarkMode ? '#222529' : '#ffffff', // Dropdown background
                color: isDarkMode ? '#F1F5F9' : '',
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
                color: isDarkMode ? '#F1F5F9' : '',
              }),
              singleValue: (base) => ({
                ...base,
                color: isDarkMode ? '#F1F5F9' : '', // Selected value text color
              }),
            }}
          />
        );
      }}
    />
  );

  // Updated useEffect with type-safe conversion
  React.useEffect(() => {
    if (data) {
      const convertedData = Object.entries(data).reduce((acc, [key, value]) => {
        const fieldConfig = Object.values(sections)
          .flat()
          .find(field => field.name === key);

        // Handle multi-select conversion
        if (fieldConfig?.isMulti) {
          const processedValue = (() => {
            if (Array.isArray(value)) {
              return value.map(v => ({
                value: typeof v === 'string' ? v.trim() : v?.value?.trim() || '',
                label: typeof v === 'string' ? v.trim() : v?.label?.trim() || ''
              }));
            }
            if (typeof value === 'string') {
              return value.split(',')
                .map(v => ({
                  value: v.trim(),
                  label: v.trim()
                }));
            }
            return [];
          })();
          
          return { ...acc, [key]: processedValue };
        }

        // Handle single select conversion
        if (fieldConfig?.type === 'select') {
          return {
            ...acc,
            [key]: typeof value === 'string' 
              ? { value: value.trim(), label: value.trim() }
              : value
          };
        }

        return { ...acc, [key]: value };
      }, {} as Record<string, any>);

      reset(convertedData);
    }
  }, [data, reset]);

  // Update your renderSelect function to handle both formats
  const renderSelect = (name: string, options: string[], isMulti = false) => (
    <Controller 
      name={name}
      control={control}
      render={({ field }) => {
        // Convert string values to {value, label} objects
        const value = typeof field.value === 'string' 
          ? { value: field.value, label: field.value }
          : field.value;

        return (
          <Select
            {...field}
            isMulti={isMulti}
            options={options.map(opt => ({ value: opt, label: opt }))}
            value={value}
            onChange={(newValue) => field.onChange(newValue)}
            getOptionValue={(option) => option.value}
            isOptionSelected={(option) => value?.value === option.value}
            className="mt-1"
            classNamePrefix="select"
            placeholder="اختر..."
            noOptionsMessage={() => "لا توجد خيارات"}
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: isDarkMode ? '' : '#ffffff', // Dark mode background
                border: `1px solid ${isDarkMode ? '#4B5563' : '#e2e8f0'}`, // Dark mode border
                borderRadius: '8px',
                boxShadow: state.isFocused ? `0 0 0 2px ${isDarkMode ? '#64748B' : '#94a3b8'}` : 'none', // Focus border color
                '&:hover': {
                  borderColor: isDarkMode ? '#64748B' : '#94a3b8',
                },
                color: isDarkMode ? '#F1F5F9' : '', // Text color
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: isDarkMode ? '#222529' : '#ffffff', // Dropdown background
                color: isDarkMode ? '#F1F5F9' : '',
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
                color: isDarkMode ? '#F1F5F9' : '',
              }),
              singleValue: (base) => ({
                ...base,
                color: isDarkMode ? '#F1F5F9' : '', // Selected value text color
              }),
            }}
          />
        );
      }}
    />
  );

  const renderField = (name: string, type: string = 'text', options?: string[], isMulti = false) => {
    return (
      <div key={name} className="space-y-2">
        <label className={`block text-sm font-medium text-gray-700 ${isDarkMode ? 'dark-mode' : ''}`}>{name}</label>
        {type === 'select' && isMulti ? (
          renderMultiSelect(name, options || [])
        ) : type === 'select' ? (
          renderSelect(name, options || [])
        ) : type === 'textarea' ? (
          <textarea
            {...register(name)}
            rows={3}
            className={`mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-2 transition-all ${isDarkMode ? 'dark-mode border-gray-600 focus:ring-bleu-900 focus:border-bleu-900' : ''}`}
          />
        ) : (
          <input
            {...register(name)}
            type={type}
            className={`mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-2 transition-all ${isDarkMode ? 'dark-mode border-gray-600 focus:ring-bleu-900 focus:border-bleu-900' : ''}`}
          />
        )}
      </div>
    );
  };

  const sections = {
    'معلومات المؤسسة': [
      { name: 'المديرية'},
      { name: 'المؤسسة'},
    ],

    'المعلومات العامة': [
      { name: 'اللقب و الاسم' },
      { name: 'الجنس' },
      { name: 'الإعادة' },
      { name: 'القسم' },
      { name: 'المؤسسة'},
      { name: 'المديرية'},
      { name: 'السوابق الصحية', type: 'text' },
      { name: 'تاريخ الميلاد' },
      { name: 'مكان الميلاد', type: 'text' },
      { name: 'العنوان', type: 'text' },
      { name: 'عدد الإخوة الذكور', type: 'number' },
      { name: 'عدد الاخوة الاناث', type: 'number' },
      { name: 'رتبته في العائلة', type: 'number' }
    ],
    'الجانب العائلي': [
      { name: 'مهنة الاب', type: 'select', options: ['بدون عمل', 'متقاعد(ة)', 'موظف(ة)'] },
      { name: 'المستوى الدراسي للأب', type: 'select', options: ['أمي', 'إبتدائي', 'متوسط', 'ثانوي', 'جامعي'] },
      { name: 'هل الأب متوفي', type: 'select', options: ['نعم', 'لا'] },
      { name: 'مهنة الأم', type: 'select', options: ['بدون عمل', 'متقاعد(ة)', 'موظف(ة)'] },
      { name: 'المستوى الدراسي للأم', type: 'select', options: ['أمي', 'إبتدائي', 'متوسط', 'ثانوي', 'جامعي'] },
      { name: 'هل الأم متوفية', type: 'select', options: ['نعم', 'لا'] },
      { name: 'هل الأبوين منفصلان', type: 'select', options: ['نعم', 'لا'] },
      { name: 'هل لديه كفيل', type: 'select', options: ['نعم', 'لا'] },
      { name: 'متابعة الأب', type: 'select', options: ['بإستمرار', 'أحيانا', 'نادرا'] },
      { name: 'متابعة الأم', type: 'select', options: ['بإستمرار', 'أحيانا', 'نادرا'] },
      { name: 'متابعة الكفيل', type: 'select', options: ['بإستمرار', 'أحيانا', 'نادرا'] }
    ],
    'الجانب الدراسي': [
      { 
        name: 'المواد المفضلة',
        type: 'select',
        options: [
          'الرياضيات',
          'العلوم الفيزيائية',
          'العلوم الطبيعية',
          'اللغة العربية',
          'اللغة الفرنسية',
          'اللغة الإنجليزية',
          'التاريخ والجغرافيا',
          'العلوم الإسلامية',
          'التربية المدنية'
        ],
        isMulti: true
      },
      { name: 'سبب تفضيلها', type: 'text' },
      { 
        name: 'المواد الصعبة',
        type: 'select',
        options: [
          'الرياضيات',
          'العلوم الفيزيائية',
          'العلوم الطبيعية',
          'اللغة العربية',
          'اللغة الفرنسية',
          'اللغة الإنجليزية',
          'التاريخ والجغرافيا',
          'العلوم الإسلامية',
          'التربية المدنية'
        ],
        isMulti: true
      },
      { name: 'سبب صعوبتها', type: 'text' },
      { 
        name: 'الجذع المشترك المرغوب',
        type: 'select',
        options: ['جذع مشترك آداب', 'جذع مشترك علوم وتكنولوجيا']
      },
      { 
        name: 'المواد المميزة للجذع',
        type: 'select',
        options: [
          'اللغة العربية وآدابها',
          'الرياضيات',
          'العلوم الفيزيائية',
          'علوم الطبيعة والحياة',
          'العلوم الإسلامية',
          'التاريخ والجغرافيا',
          'اللغة الفرنسية',
          'اللغة الإنجليزية',
          'تكنولوجيا'
        ],
        isMulti: true
      },
      {
        name: 'سبب اهتمامه بالدراسة',
        type: 'select',
        options: [
          'تشجيع الأولياء',
          'تشجيع الأساتذة',
          'متابعة دروس خاصة',
          'المنافسة مع الزملاء'
        ],
        isMulti: true
      },
      {
        name: 'ممن يطلب المساعدة عند الصعوبة',
        type: 'select',
        options: [
          'زملاء القسم',
          'الأساتذة',
          'مطالعة الكتب'
        ],
        isMulti: true
      },
      { name: 'وسيلة أخرى لفهم الدروس', type: 'text' },
      { name: 'هل تشجعه معاملة الأستاذ', type: 'select', options: ['نعم', 'لا'] },
      { name: 'هل تحفزه مكافأة والديه', type: 'select', options: ['نعم', 'لا'] },
      { name: 'هل ناقش مشروعه الدراسي مع والديه', type: 'select', options: ['نعم', 'لا'] },
      { name: 'سبب عدم مناقشته لمشروعه الدراسي', type: 'text', dependentOn: 'هل ناقش مشروعه الدراسي مع والديه' },
      {
        name: 'سبب اهتمامه بالدراسة راجع إلى',
        type: 'select',
        options: ['مهنة مستقرة', 'دراسات عليا', 'ثقافة عامة'],
        isMulti: true
      },
      { name: 'أسباب أخرى للاهتمام بالدراسة', type: 'text' }
    ],
    'الجانب المهني': [
      { name: 'المهنة التي يتمناها في المستقبل', type: 'text' },
      { name: 'سبب اختيارها', type: 'text' },
      {
        name: 'المستوى الدراسي الذي تتطلبه المهنة',
        type: 'select',
        options: ['تعليم أساسي', 'تعليم ثانوي', 'تعليم جامعي', 'تعليم أو تكوين مهنيين'],
        isMulti: true
      },
      {
        name: 'القطاع المرغوب للعمل فيه',
        type: 'select',
        options: ['الصناعة', 'الفلاحة', 'التربية', 'الصحة', 'الدفاع الوطني', 'الإدارة'],
        isMulti: true
      },
      { name: 'قطاعات أخرى مهتم بها', type: 'text' }
    ],
    'الجانب الترفيهي': [
      { name: 'هل لديه نشاط ترفيهي', type: 'select', options: ['نعم', 'لا'] },
      {
        name: 'كيف يقضي أوقات فراغه',
        type: 'select',
        options: ['مطالعة الكتب', 'مراجعة الدروس', 'مشاهدة التلفزة', 'ممارسة الرياضة', 'التنزه'],
        isMulti: true
      },
      { name: 'مجالات أخرى للترفيه', type: 'text' }
    ],
    'الجانب الإعلامي': [
      { name: 'هل لديه معلومات كافية حول مشروعه المستقبلي', type: 'select', options: ['نعم', 'لا'] },
      { name: 'ما المعلومات التي يحتاجها', type: 'text' }
    ],
    'الجانب النفسي البيداغوجي': [
      { name: 'هل يعاني من صعوبات دراسية', type: 'select', options: ['نعم', 'لا'] },
      { name: 'ما هي الصعوبات', type: 'text', dependentOn: 'هل يعاني من صعوبات دراسية' },
      { name: 'هل لديه مشكلة يريد مناقشتها', type: 'select', options: ['نعم', 'لا'] },
      { name: 'ما هي المشكلة', type: 'text', dependentOn: 'هل لديه مشكلة يريد مناقشتها' }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${isDarkMode ? 'nav-dark' : ''}`}>
      <div className="flex items-center">
          <FilePlus2 className="ml-4" />
          <h3 className={`text-xl font-semibold text-gray-800 text-left ${isDarkMode ? 'dark-mode' : ''}`}>إستبيان الميول والإهتمامات</h3>
        </div>
        <button
          onClick={onClose}
          className={`text-gray-500 hover:text-gray-700 transition-colors ${isDarkMode ? 'dark-mode' : ''}`}>
          <X className="w-6 h-6" />
        </button>
      </div>

        <form onSubmit={handleSubmit(onSubmit)} className={`p-6 overflow-y-auto max-h-[calc(90vh-8rem)] ${isDarkMode ? 'dark-mode' : ''}`} dir="rtl">
          <div className="space-y-8">
            {Object.entries(sections).map(([sectionTitle, fields]) => (
              <div key={sectionTitle} className={`border rounded-xl p-6 bg-gray-50 ${isDarkMode ? 'columnMenu-dark' : ''}`}>
                <h4 className={`text-lg font-semibold text-gray-700 mb-6 ${isDarkMode ? 'dark-mode' : ''}`}>{sectionTitle}</h4>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isDarkMode ? 'columnMenu-dark' : ''}`}>

                  {/*-------------- المعلومات المؤسسة --------------*/}
                  {sectionTitle === 'معلومات المؤسسة' ? (
                  <>

                    <div className={`flex gap-4 col-span-2 ${isDarkMode ? 'columnMenu-dark' : ''}`}>
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'المديرية' ||
                            field.name === 'المؤسسة'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                  </>
                  ) : null}

                  {/*-------------- المعلومات العامة --------------*/}
                  {sectionTitle === 'المعلومات العامة' ? (
                  <>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'اللقب و الاسم' ||
                            field.name === 'الجنس' ||
                            field.name === 'الإعادة' ||
                            field.name === 'القسم' ||
                            field.name === 'السوابق الصحية'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'تاريخ الميلاد' ||
                            field.name === 'مكان الميلاد'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>
                    
                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'العنوان'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'عدد الإخوة الذكور' ||
                            field.name === 'عدد الاخوة الاناث' ||
                            field.name === 'رتبته في العائلة'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                  </>
                  ) : null}

                  {/*-------------- الجانب العائلي --------------*/}
                  {sectionTitle === 'الجانب العائلي' ? (
                  <>
                    
                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'مهنة الاب' ||
                            field.name === 'المستوى الدراسي للأب' ||
                            field.name === 'هل الأب متوفي'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>
                    
                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'مهنة الأم' ||
                            field.name === 'المستوى الدراسي للأم' ||
                            field.name === 'هل الأم متوفية'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'هل الأبوين منفصلان' ||
                            field.name === 'هل لديه كفيل'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'متابعة الأب' ||
                            field.name === 'متابعة الأم' ||
                            field.name === 'متابعة الكفيل'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>
                    
                  </>
                  ) : null}

                  {/*-------------- الجانب الدراسي --------------*/}
                  {sectionTitle === 'الجانب الدراسي' ? (
                  <>
                    
                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'المواد المفضلة'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'سبب تفضيلها'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'المواد الصعبة'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'سبب صعوبتها'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'الجذع المشترك المرغوب'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'المواد المميزة للجذع'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'سبب اهتمامه بالدراسة'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'ممن يطلب المساعدة عند الصعوبة'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'وسيلة أخرى لفهم الدروس'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'هل تشجعه معاملة الأستاذ' ||
                            field.name === 'هل تحفزه مكافأة والديه'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'هل ناقش مشروعه الدراسي مع والديه' ||
                            field.name === 'سبب عدم مناقشته لمشروعه الدراسي'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'سبب اهتمامه بالدراسة راجع إلى'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'أسباب أخرى للاهتمام بالدراسة'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>     
                  </>
                  ) : null}

                  {/*-------------- الجانب المهني --------------*/}
                  {sectionTitle === 'الجانب المهني' ? (
                  <>
                    
                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'المهنة التي يتمناها في المستقبل' ||
                            field.name === 'سبب اختيارها'

                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'المستوى الدراسي الذي تتطلبه المهنة'

                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'القطاع المرغوب للعمل فيه'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'قطاعات أخرى مهتم بها'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                  </>
                  ) : null}

                  {/*-------------- الجانب الترفيهي --------------*/}
                  {sectionTitle === 'الجانب الترفيهي' ? (
                  <>
                    
                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'هل لديه نشاط ترفيهي'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'كيف يقضي أوقات فراغه'

                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'مجالات أخرى للترفيه'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                  </>
                  ) : null}

                  {/*-------------- الجانب الإعلامي --------------*/}
                  {sectionTitle === 'الجانب الإعلامي' ? (
                  <>
                    
                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'هل لديه معلومات كافية حول مشروعه المستقبلي' ||
                            field.name === 'ما المعلومات التي يحتاجها'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>
                  </>
                  ) : null}

                  {/*-------------- الجانب الإعلامي --------------*/}
                  {sectionTitle === 'الجانب النفسي البيداغوجي' ? (
                  <>
                    
                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'هل يعاني من صعوبات دراسية' ||
                            field.name === 'ما هي الصعوبات'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'هل لديه مشكلة يريد مناقشتها' ||
                            field.name === 'ما هي المشكلة'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options, field.isMulti)}
                          </div>
                        ))}
                    </div>

                  </>
                  ) : null}

                  {/* Render the rest of the fields normally */}
                  {fields
                    .filter(
                      (field) =>
                        field.name !== 'اللقب و الاسم' &&
                        field.name !== 'الجنس' &&
                        field.name !== 'الإعادة' &&
                        field.name !== 'القسم' &&
                        field.name !== 'المديرية' &&
                        field.name !== 'المؤسسة' &&
                        field.name !== 'السوابق الصحية' &&
                        field.name !== 'تاريخ الميلاد' &&
                        field.name !== 'مكان الميلاد' &&
                        field.name !== 'العنوان' &&
                        field.name !== 'عدد الإخوة الذكور' &&
                        field.name !== 'عدد الاخوة الاناث' &&
                        field.name !== 'رتبته في العائلة' &&
                        field.name !== 'مهنة الاب' &&
                        field.name !== 'المستوى الدراسي للأب' &&
                        field.name !== 'هل الأب متوفي' &&
                        field.name !== 'مهنة الأم' &&
                        field.name !== 'المستوى الدراسي للأم' &&
                        field.name !== 'هل الأم متوفية' &&
                        field.name !== 'هل الأبوين منفصلان' &&
                        field.name !== 'هل لديه كفيل' &&
                        field.name !== 'متابعة الأب' &&
                        field.name !== 'متابعة الأم' &&
                        field.name !== 'متابعة الكفيل' &&
                        field.name !== 'المواد المفضلة' &&
                        field.name !== 'سبب تفضيلها' &&
                        field.name !== 'المواد الصعبة' &&
                        field.name !== 'سبب صعوبتها' &&
                        field.name !== 'الجذع المشترك المرغوب' &&
                        field.name !== 'المواد المميزة للجذع' &&
                        field.name !== 'سبب اهتمامه بالدراسة' &&
                        field.name !== 'ممن يطلب المساعدة عند الصعوبة' &&
                        field.name !== 'وسيلة أخرى لفهم الدروس' &&
                        field.name !== 'هل تشجعه معاملة الأستاذ' &&
                        field.name !== 'هل تحفزه مكافأة والديه' &&
                        field.name !== 'هل ناقش مشروعه الدراسي مع والديه' &&
                        field.name !== 'سبب عدم مناقشته لمشروعه الدراسي' &&
                        field.name !== 'سبب اهتمامه بالدراسة راجع إلى' &&
                        field.name !== 'أسباب أخرى للاهتمام بالدراسة' &&
                        field.name !== 'المهنة التي يتمناها في المستقبل' &&
                        field.name !== 'سبب اختيارها' &&
                        field.name !== 'المستوى الدراسي الذي تتطلبه المهنة' &&
                        field.name !== 'القطاع المرغوب للعمل فيه' &&
                        field.name !== 'قطاعات أخرى مهتم بها' &&
                        field.name !== 'هل لديه نشاط ترفيهي' &&
                        field.name !== 'كيف يقضي أوقات فراغه' &&
                        field.name !== 'مجالات أخرى للترفيه' &&
                        field.name !== 'هل لديه معلومات كافية حول مشروعه المستقبلي' &&
                        field.name !== 'ما المعلومات التي يحتاجها' &&
                        field.name !== 'هل يعاني من صعوبات دراسية' &&
                        field.name !== 'ما هي الصعوبات' &&
                        field.name !== 'هل لديه مشكلة يريد مناقشتها' &&
                        field.name !== 'ما هي المشكلة'
                    )
                    .map((field) => renderField(field.name, field.type, field.options, field.isMulti))}

                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end space-x-6 rtl:space-x-reverse">
          <button
              type="submit"
              className="flex items-center px-6 py-2 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              حفظ التغييرات
              <Save className="w-4 h-4 mr-2" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
               إلغاء
              <ArrowLeft className="w-4 h-4 mr-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}