import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { X, Save, ArrowLeft, FilePlus2 } from 'lucide-react';
import Select from 'react-select';
import { useState } from "react";

interface EditFormProps {
  data: any;
  onSubmit: (data: any) => void;
  onClose: () => void;
  columns: string[];
  isDarkMode: boolean; // Accept dark mode state as a prop
}

interface FieldConfig {
  name: string;
  type?: 'text' | 'number' | 'select' | 'multiselect';
  options?: string[];
  isMulti?: boolean;
}

interface SelectValue {
  value: string;
  label: string;
}

export function EditForm({ data, onSubmit, onClose, isDarkMode }: EditFormProps) {
  const defaultValues = {
    ...data
  };

  const { register, handleSubmit, control, watch, reset } = useForm({ defaultValues: data });

  // Add this useEffect to verify the form values
  React.useEffect(() => {
    console.log('Current form values:', watch());
  }, [watch()]);

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
                border: `1px solid ${isDarkMode ? '#4B5563' : '#ffffff'}`, // Dark mode border
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
            onChange={(newValue) => {
              // For single select, pass just the value
              field.onChange(isMulti ? newValue : newValue?.value || newValue);
            }}
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
                    : '#F1F5F9'
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
            className={`mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-200 p-2 transition-all ${isDarkMode ? 'dark-mode border-gray-600 focus:ring-bleu-900 focus:border-bleu-900' : ''}`}
          />
        ) : (
          <input
            {...register(name)}
            type={type}
            className={`mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-200 p-2 transition-all ${isDarkMode ? 'dark-mode border-gray-600 focus:ring-bleu-900 focus:border-bleu-900' : ''}`}
          />
        )}
      </div>
    );
  };

  // Function to determine options based on 'المؤسسة' field
  const getOptionsForInstitution = (institution: string) => {
    if (institution.startsWith('متوسطة')) {
      return [
        'جذع مشترك آداب',
        'جذع مشترك علوم وتكنولوجيا'
      ];
    } else if (institution.startsWith('ثانوية')) {
      return [
        'آداب وفلسفة',
        'لغات اجنبية',
        'فنون',
        'رياضيات',
        'علوم تجريبسة',
        'تقني رياضي',
        'تسيير واقتصاد'
      ];
    }
    return [];
  };

  const getOptionsForSubjects = (subjects: string) => {
    if (subjects.startsWith('متوسطة')) {
      return [
        'الرياضيات',
        'العلوم الفيزيائية',
        'العلوم الطبيعية',
        'اللغة العربية',
        'اللغة الفرنسية',
        'اللغة الإنجليزية',
        'اللغة الأمازيغية',
        'التاريخ والجغرافيا',
        'التربية الإسلامية',
        'التربية المدنية'
      ];
    } else if (subjects.startsWith('ثانوية')) {
      return [
        
        'الرياضيات',
        'العلوم الفيزيائية',
        'علوم الطبيعة والحياة',
        'العلوم الإسلامية',
        'التاريخ والجغرافيا',
        'اللغة العربية وآدابها',
        'اللغة الفرنسية',
        'اللغة الإنجليزية',
        'المعلوماتية',
        'التربية الفنية',
        'تكنولوجيا',
        'اللغة الأمازيغية',
      ];
    }
    return [];
  };
  
  const getOptionsForFeaturedSubjects = (subjects: string) => {
    if (subjects.startsWith('متوسطة')) {
      return [
        'الرياضيات',
        'العلوم الفيزيائية',
        'علوم الطبيعة والحياة',
        'العلوم الإسلامية',
        'التاريخ والجغرافيا',
        'اللغة العربية وآدابها',
        'اللغة الفرنسية',
        'اللغة الإنجليزية',
        'اللغة الأمازيغية',
        'المعلوماتية',
        'التربية الفنية',
        'تكنولوجيا',
      ];
    } else if (subjects.startsWith('ثانوية')) {
      return [
        
        'الرياضيات',
        'العلوم الفيزيائية',
        'علوم الطبيعة والحياة',
        'التكنولوجيا',
        'هندسة الكهربائية',
        'هندسة الطرائق',
        'هندسة المكانيكية',
        'ت. المحاسبي و المالي',
        'الاقتصاد والمناجمنت',
        'القانون',
        'الفلسفة',
        'العلوم الإسلامية',
        'التاريخ والجغرافيا',
        'اللغة العربية وآدابها',
        'اللغة الفرنسية',
        'اللغة الإنجليزية',
        'اللغة الإسبانية',
        'اللغة الألمانية',
        'اللغة الإيطالية',
        'اللغة الأمازيغية',
        'المعلوماتية',
        'التربية الفنية', 
      ];
    }
    return [];
  };

  // Watch the 'المؤسسة' field to dynamically update options
  const institution = watch('المؤسسة');

  const sections: Record<string, FieldConfig[]> = {
    'معلومات المؤسسة': [
      { name: 'المديرية', type: 'text'},
      { name: 'المؤسسة', type: 'text'},
    ],

    'المعلومات العامة': [
      { name: 'اللقب و الاسم', type: 'text' },
      { name: 'الجنس', type: 'select', options: ['ذكر', 'أنثى'] },
      { name: 'الإعادة', type: 'select', options: ['نعم', 'لا'] },
      { name: 'القسم', type: 'text' },
      { name: 'المؤسسة', type: 'text'},
      { name: 'المديرية', type: 'text'},
    ],

    'جانب التقييم الأكاديمي': [
      { name: 'معدل الفصل 1', type: 'text'},
      { name: 'معدل القبول (الفصل الأول)', type: 'select', options: ['مقبول', 'غير مقبول'] },
      { name: 'معدل الفصل 2', type: 'text'},
      { name: 'معدل الفصلين (الأول والثاني)', type: 'text'},
      { name: 'معدل القبول (الفصل الثاني)', type: 'select', options: ['مقبول', 'غير مقبول'] },
      { name: 'معدل الفصل 3', type: 'text'},
      { name: 'المعدل السنوي', type: 'text'},
      { name: 'معدل القبول (المعدل السنوي)', type: 'select', options: ['مقبول', 'غير مقبول'] },
    ],

    'مراحل ضبط الرغبات الأكاديمية': [
      { name: 'رغبة التلميذ (إستبيان الميول والإهتمامات) - الفصل الأول', type: 'select', options: ['آداب وفلسفة', 'اللغات الأجنبية', 'فنون'] },
      { name: 'رغبة التلميذ (بطاقة الرغبات الأولية) - الفصل الثاني', type: 'select', options: ['آداب وفلسفة', 'اللغات الأجنبية', 'فنون'] },
      { name: 'تصحيح الرغبة', type: 'select', options: ['آداب وفلسفة', 'اللغات الأجنبية', 'فنون'] },
      { name: 'الرغبة النهائية للتلميذ - الفصل الثالث', type: 'select', options: ['آداب وفلسفة', 'اللغات الأجنبية', 'فنون'] },
    ],

    'معدلات المواد المسندة للتوجيه': [
      { name: 'اللغة العربية وآدابها', type: 'text' },
      { name: 'اللغة العربية وآدابها ف 2', type: 'text' },
      { name: 'متوسط المعدلين (اللغة العربية)', type: 'text' },
      { name: 'اللغة العربية وآدابها ف 3', type: 'text' },
      { name: 'المعدل السنوي (اللغة العربية)', type: 'text' },
      { name: 'التاريخ والجغرافيا', type: 'text' },
      { name: 'التاريخ والجغرافيا ف 2', type: 'text' },
      { name: 'متوسط المعدلين (التاريخ والجغرافيا)', type: 'text' },
      { name: 'التاريخ والجغرافيا ف 3', type: 'text' },
      { name: 'المعدل السنوي (التاريخ والجغرافيا)', type: 'text' },
      { name: 'اللغة الفرنسية', type: 'text' },
      { name: 'اللغة الفرنسية ف 2', type: 'text' },
      { name: 'متوسط المعدلين (اللغة الفرنسية)', type: 'text' },
      { name: 'اللغة الفرنسية ف 3', type: 'text' },
      { name: 'المعدل السنوي (اللغة الفرنسية)', type: 'text' },
      { name: 'اللغة الانجليزية', type: 'text' },
      { name: 'اللغة الانجليزية ف 2', type: 'text' },
      { name: 'متوسط المعدلين (اللغة الانجليزية)', type: 'text' },
      { name: 'اللغة الانجليزية ف 3', type: 'text' },
      { name: 'المعدل السنوي (اللغة الانجليزية)', type: 'text' },
    ],

    'مجموعات التوجيه التدريجي': [
      { name: 'شعبة آداب وفلسفة (ت.ت)', type: 'text' },
      { name: 'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.ت)', type: 'text' },
      { name: 'شعبة اللغات الأجنبية (ت.ت)', type: 'text' },
      { name: 'ترتيب التلميذ (اللغات الأجنبية) (ت.ت)', type: 'text' },
      { name: 'التوجيه التدريجي (ت.ت)', type: 'select', options: ['آداب وفلسفة', 'اللغات الأجنبية', 'فنون'] },
      { name: 'التوافق مع الرغبة (ت.ت)', type: 'select', options: ['تتفق ورغبة التلميذ', 'لا تتفق ورغبة التلميذ'] }
    ],

    'مجموعات التوجيه المسبق': [
      { name: 'شعبة آداب وفلسفة (ت.م)', type: 'text' },
      { name: 'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.م)', type: 'text' },
      { name: 'شعبة اللغات الأجنبية (ت.م)', type: 'text' },
      { name: 'ترتيب التلميذ (اللغات الأجنبية) (ت.م)', type: 'text' },
      { name: 'التوجيه المسبق (ت.م)', type: 'select', options: ['آداب وفلسفة', 'اللغات الأجنبية', 'فنون'] },
      { name: 'التوافق مع الرغبة (ت.م)', type: 'select', options: ['تتفق ورغبة التلميذ', 'لا تتفق ورغبة التلميذ'] },
      { name: 'ثبات الرغبة (ت.م)', type: 'select', options: ['ثبات الرغبة', 'تغير الرغبة'] }
    ],

    'مجموعات التوجيه النهائي': [
      { name: 'شعبة آداب وفلسفة (ت.ن)', type: 'text' },
      { name: 'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.ن)', type: 'text' },
      { name: 'شعبة اللغات الأجنبية (ت.ن)', type: 'text' },
      { name: 'ترتيب التلميذ (اللغات الأجنبية) (ت.ن)', type: 'text' },
      { name: 'التوجيه النهائي (ت.ن)', type: 'select', options: ['آداب وفلسفة', 'اللغات الأجنبية', 'فنون'] },
      { name: 'التوافق مع الرغبة (ت.ن)', type: 'select', options: ['تتفق ورغبة التلميذ', 'لا تتفق ورغبة التلميذ'] },
      { name: 'ثبات الرغبة (ت.ن)', type: 'select', options: ['ثبات الرغبة', 'تغير الرغبة'] }
    ],

    'الإجراءات والقرارات المتخذة': [
      { name: 'إقتراح مستشار التوجيه', type: 'select', options: ['آداب وفلسفة', 'اللغات الأجنبية', 'الفنون', 'يعيد السنة', 'يوجه إلى التكوين المهني', 'يوجه إلى التعليم المهني'] },
      { name: 'إقتراح الأساتذة', type: 'select', options: ['آداب وفلسفة', 'اللغات الأجنبية', 'الفنون', 'يعيد السنة', 'يوجه إلى التكوين المهني', 'يوجه إلى التعليم المهني'] },
      { name: 'قرار مجلس القبول والتوجيه', type: 'select', options: ['آداب وفلسفة', 'اللغات الأجنبية', 'الفنون', 'يعيد السنة', 'يوجه إلى التكوين المهني', 'يوجه إلى التعليم المهني'] },
      { name: 'حالة الطعن', type: 'select', options: ['مقبول', 'مرفوض', 'قيد الدراسة'] },
      { name: 'تأسيس الطعن', type: 'select', options: ['نعم', 'لا'] },
      { name: 'قرار الطعن', type: 'select', options: ['مقبول', 'مرفوض', 'قيد الدراسة'] },
      { name: 'الشعبة المطعون فيها', type: 'select', options: ['آداب وفلسفة', 'اللغات الأجنبية', 'فنون'] },
      { name: 'الشعبة المرغوب فيها', type: 'select', options: ['آداب وفلسفة', 'اللغات الأجنبية', 'فنون'] },
      { name: 'قرار اللجنة الولائية للطعن', type: 'select', options: ['مقبول', 'مرفوض', 'قيد الدراسة'] }
    ]
  };

  const handleFormSubmit = handleSubmit((formData) => {
    // Process the form data before submitting
    const processedData = Object.entries(formData).reduce((acc, [key, value]) => {
      // Handle select fields
      if (value && typeof value === 'object') {
        if (Array.isArray(value)) {
          // Handle multi-select
          acc[key] = value.map(v => (v as SelectValue).value || v).join(', ');
        } else {
          // Handle single select
          acc[key] = (value as SelectValue).value || value;
        }
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    onSubmit(processedData);
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${isDarkMode ? 'nav-dark' : ''}`}>
      <div className="flex items-center">
          <FilePlus2 className="ml-4" />
          <h3 className={`text-xl font-semibold text-gray-800 text-left ${isDarkMode ? 'dark-mode' : ''}`}>سجل المتابعة</h3>
        </div>
        <button
          onClick={onClose}
          className={`text-gray-500 hover:text-gray-700 transition-colors ${isDarkMode ? 'dark-mode' : ''}`}>
          <X className="w-6 h-6" />
        </button>
      </div>

        <form onSubmit={handleFormSubmit} className={`p-6 overflow-y-auto max-h-[calc(90vh-8rem)] ${isDarkMode ? 'dark-mode' : ''}`} dir="rtl">
          <div className="space-y-8">
            {Object.entries(sections).map(([sectionTitle, fields]) => (
              <div key={sectionTitle} className={`border rounded-xl p-6 bg-gray-50 ${isDarkMode ? 'columnMenu-dark' : ''}`}>
                <h4 className={`text-lg font-semibold text-gray-700 mb-6 ${isDarkMode ? 'dark-mode' : ''}`}>{sectionTitle}</h4>
                <div className={`grid grid-cols-1 gap-4 ${isDarkMode ? 'columnMenu-dark' : ''}`}>

                  {/*-------------- المعلومات المؤسسة --------------*/}
                  {sectionTitle === 'معلومات المؤسسة' ? (
                  <>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'المديرية' ||
                            field.name === 'المؤسسة'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options)}
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
                            field.name === 'القسم'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>

                  </>
                  ) : null}

                  {/*-------------- جانب التقييم الأكاديمي --------------*/}
                  {sectionTitle === 'جانب التقييم الأكاديمي' ? (
                  <>
                    
                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'معدل الفصل 1' ||
                            field.name === 'معدل الفصل 2' ||
                            field.name === 'معدل الفصلين (الأول والثاني)' ||
                            field.name === 'معدل الفصل 3' ||
                            field.name === 'المعدل السنوي'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>
                    
                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'معدل القبول (الفصل الأول)' ||
                            field.name === 'معدل القبول (الفصل الثاني)' ||
                            field.name === 'معدل القبول (المعدل السنوي)'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>
                  </>
                  ) : null}

                  {/*-------------- مراحل ضبط الرغبات الأكاديمية --------------*/}
                  {sectionTitle === 'مراحل ضبط الرغبات الأكاديمية' ? (
                  <>
                    
                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'رغبة التلميذ (إستبيان الميول والإهتمامات) - الفصل الأول' ||
                            field.name === 'رغبة التلميذ (بطاقة الرغبات الأولية) - الفصل الثاني'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>
                    
                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'تصحيح الرغبة' ||
                            field.name === 'الرغبة النهائية للتلميذ - الفصل الثالث'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>
                  </>
                  ) : null}

                  {/*-------------- معدلات المواد المسندة للتوجيه --------------*/}
                  {sectionTitle === 'معدلات المواد المسندة للتوجيه' ? (
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        ['اللغة العربية وآدابها', 'اللغة العربية وآدابها ف 2', 'متوسط المعدلين (اللغة العربية)', 'اللغة العربية وآدابها ف 3', 'المعدل السنوي (اللغة العربية)'],
                        ['التاريخ والجغرافيا', 'التاريخ والجغرافيا ف 2', 'متوسط المعدلين (التاريخ والجغرافيا)', 'التاريخ والجغرافيا ف 3', 'المعدل السنوي (التاريخ والجغرافيا)'],
                        ['اللغة الفرنسية', 'اللغة الفرنسية ف 2', 'متوسط المعدلين (اللغة الفرنسية)', 'اللغة الفرنسية ف 3', 'المعدل السنوي (اللغة الفرنسية)'],
                        ['اللغة الانجليزية', 'اللغة الانجليزية ف 2', 'متوسط المعدلين (اللغة الانجليزية)', 'اللغة الانجليزية ف 3', 'المعدل السنوي (اللغة الانجليزية)']
                      ].map((fieldsGroup, index) => (
                        <div key={index} className="border border-gray-300 rounded-lg p-4 shadow-sm">
                          <div className="flex flex-col gap-4">
                            {fields
                              .filter((field) => fieldsGroup.includes(field.name))
                              .map((field) => (
                                <div key={field.name} className="w-full">
                                  {renderField(field.name, field.type, field.options)}
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {/*-------------- مجموعات التوجيه التدريجي --------------*/}
                  {sectionTitle === 'مجموعات التوجيه التدريجي' ? (
                  <>
                    
                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'شعبة آداب وفلسفة (ت.ت)' ||
                            field.name === 'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.ت)'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'شعبة اللغات الأجنبية (ت.ت)' ||
                            field.name === 'ترتيب التلميذ (اللغات الأجنبية) (ت.ت)'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'التوجيه التدريجي (ت.ت)' ||
                            field.name === 'التوافق مع الرغبة (ت.ت)'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>
                  </>
                  ) : null}

                  {/*-------------- مجموعات التوجيه المسبق --------------*/}
                  {sectionTitle === 'مجموعات التوجيه المسبق' ? (
                    <>        
                      <div className="flex gap-4 col-span-2">
                        {fields
                          .filter(
                            (field) =>
                              field.name === 'شعبة آداب وفلسفة (ت.م)' ||
                              field.name === 'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.م)'
                          )
                          .map((field) => (
                            <div key={field.name} className="flex-1">
                              {renderField(field.name, field.type, field.options)}
                            </div>
                          ))}
                      </div>
  
                      <div className="flex gap-4 col-span-2">
                        {fields
                          .filter(
                            (field) =>
                              field.name === 'شعبة اللغات الأجنبية (ت.م)' ||
                              field.name === 'ترتيب التلميذ (اللغات الأجنبية) (ت.م)'
                          )
                          .map((field) => (
                            <div key={field.name} className="flex-1">
                              {renderField(field.name, field.type, field.options)}
                            </div>
                          ))}
                      </div>
  
                      <div className="flex gap-4 col-span-2">
                        {fields
                          .filter(
                            (field) =>
                              field.name === 'التوجيه المسبق (ت.م)' ||
                              field.name === 'التوافق مع الرغبة (ت.م)' ||
                              field.name === 'ثبات الرغبة (ت.م)'
                          )
                          .map((field) => (
                            <div key={field.name} className="flex-1">
                              {renderField(field.name, field.type, field.options)}
                            </div>
                          ))}
                      </div>
                    </>
                  ) : null}

                  {/*-------------- مجموعات التوجيه النهائي --------------*/}
                  {sectionTitle === 'مجموعات التوجيه النهائي' ? (
                    <>        
                      <div className="flex gap-4 col-span-2">
                        {fields
                          .filter(
                            (field) =>
                              field.name === 'شعبة آداب وفلسفة (ت.ن)' ||
                              field.name === 'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.ن)'
                          )
                          .map((field) => (
                            <div key={field.name} className="flex-1">
                              {renderField(field.name, field.type, field.options)}
                            </div>
                          ))}
                      </div>
  
                      <div className="flex gap-4 col-span-2">
                        {fields
                          .filter(
                            (field) =>
                              field.name === 'شعبة اللغات الأجنبية (ت.ن)' ||
                              field.name === 'ترتيب التلميذ (اللغات الأجنبية) (ت.ن)'
                          )
                          .map((field) => (
                            <div key={field.name} className="flex-1">
                              {renderField(field.name, field.type, field.options)}
                            </div>
                          ))}
                      </div>
  
                      <div className="flex gap-4 col-span-2">
                        {fields
                          .filter(
                            (field) =>
                              field.name === 'التوجيه النهائي (ت.ن)' ||
                              field.name === 'التوافق مع الرغبة (ت.ن)' ||
                              field.name === 'ثبات الرغبة (ت.ن)'
                          )
                          .map((field) => (
                            <div key={field.name} className="flex-1">
                              {renderField(field.name, field.type, field.options)}
                            </div>
                          ))}
                      </div>
                    </>
                  ) : null}

                  {/*-------------- الإجراءات والقرارات المتخذة --------------*/}
                  {sectionTitle === 'الإجراءات والقرارات المتخذة' ? (
                    <>        
                      <div className="flex gap-4 col-span-2">
                        {fields
                          .filter(
                            (field) =>
                              field.name === 'إقتراح مستشار التوجيه' ||
                              field.name === 'إقتراح الأساتذة' ||
                              field.name === 'قرار مجلس القبول والتوجيه'
                          )
                          .map((field) => (
                            <div key={field.name} className="flex-1">
                              {renderField(field.name, field.type, field.options)}
                            </div>
                          ))}
                      </div>
  
                      <div className="flex gap-4 col-span-2">
                        {fields
                          .filter(
                            (field) =>
                              field.name === 'حالة الطعن' ||
                              field.name === 'تأسيس الطعن' ||
                              field.name === 'قرار الطعن'
                          )
                          .map((field) => (
                            <div key={field.name} className="flex-1">
                              {renderField(field.name, field.type, field.options)}
                            </div>
                          ))}
                      </div>
  
                      <div className="flex gap-4 col-span-2">
                        {fields
                          .filter(
                            (field) =>
                              field.name === 'الشعبة المطعون فيها' ||
                              field.name === 'الشعبة المرغوب فيها' ||
                              field.name === 'قرار اللجنة الولائية للطعن'
                          )
                          .map((field) => (
                            <div key={field.name} className="flex-1">
                              {renderField(field.name, field.type, field.options)}
                            </div>
                          ))}
                      </div>
                    </>
                  ) : null}

                  {/* Render the rest of the fields normally */}
                  {fields
                    .filter(
                      (field) =>
                        field.name !== 'المديرية' &&
                        field.name !== 'المؤسسة' &&
                        field.name !== 'اللقب و الاسم' &&
                        field.name !== 'الجنس' &&
                        field.name !== 'الإعادة' &&
                        field.name !== 'القسم' &&
                        field.name !== 'معدل الفصل 1' &&
                        field.name !== 'معدل القبول (الفصل الأول)' &&
                        field.name !== 'معدل الفصل 2' &&
                        field.name !== 'معدل الفصلين (الأول والثاني)' &&
                        field.name !== 'معدل القبول (الفصل الثاني)' &&
                        field.name !== 'معدل الفصل 3' &&
                        field.name !== 'المعدل السنوي' &&
                        field.name !== 'معدل القبول (المعدل السنوي)' &&
                        field.name !== 'رغبة التلميذ (إستبيان الميول والإهتمامات) - الفصل الأول' &&
                        field.name !== 'رغبة التلميذ (بطاقة الرغبات الأولية) - الفصل الثاني' &&
                        field.name !== 'تصحيح الرغبة' &&
                        field.name !== 'الرغبة النهائية للتلميذ - الفصل الثالث' &&
                        field.name !== 'اللغة العربية وآدابها' &&
                        field.name !== 'اللغة العربية وآدابها ف 2' &&
                        field.name !== 'متوسط المعدلين (اللغة العربية)' &&
                        field.name !== 'اللغة العربية وآدابها ف 3' &&
                        field.name !== 'المعدل السنوي (اللغة العربية)' &&
                        field.name !== 'التاريخ والجغرافيا' &&
                        field.name !== 'التاريخ والجغرافيا ف 2' &&
                        field.name !== 'متوسط المعدلين (التاريخ والجغرافيا)' &&
                        field.name !== 'التاريخ والجغرافيا ف 3' &&
                        field.name !== 'المعدل السنوي (التاريخ والجغرافيا)' &&
                        field.name !== 'اللغة الفرنسية' &&
                        field.name !== 'اللغة الفرنسية ف 2' &&
                        field.name !== 'متوسط المعدلين (اللغة الفرنسية)' &&
                        field.name !== 'اللغة الفرنسية ف 3' &&
                        field.name !== 'المعدل السنوي (اللغة الفرنسية)' &&
                        field.name !== 'اللغة الانجليزية' &&
                        field.name !== 'اللغة الانجليزية ف 2' &&
                        field.name !== 'متوسط المعدلين (اللغة الانجليزية)' &&
                        field.name !== 'اللغة الانجليزية ف 3' &&
                        field.name !== 'المعدل السنوي (اللغة الانجليزية)' &&
                        field.name !== 'شعبة آداب وفلسفة (ت.ت)' &&
                        field.name !== 'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.ت)' &&
                        field.name !== 'شعبة اللغات الأجنبية (ت.ت)' &&
                        field.name !== 'ترتيب التلميذ (اللغات الأجنبية) (ت.ت)' &&
                        field.name !== 'التوجيه التدريجي (ت.ت)' &&
                        field.name !== 'التوافق مع الرغبة (ت.ت)' &&
                        field.name !== 'شعبة آداب وفلسفة (ت.م)' &&
                        field.name !== 'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.م)' &&
                        field.name !== 'شعبة اللغات الأجنبية (ت.م)' &&
                        field.name !== 'ترتيب التلميذ (اللغات الأجنبية) (ت.م)' &&
                        field.name !== 'التوجيه المسبق (ت.م)' &&
                        field.name !== 'التوافق مع الرغبة (ت.م)' &&
                        field.name !== 'ثبات الرغبة (ت.م)' &&
                        field.name !== 'شعبة آداب وفلسفة (ت.ن)' &&
                        field.name !== 'ترتيب التلميذ (شعبة آداب وفلسفة) (ت.ن)' &&
                        field.name !== 'شعبة اللغات الأجنبية (ت.ن)' &&
                        field.name !== 'ترتيب التلميذ (اللغات الأجنبية) (ت.ن)' &&
                        field.name !== 'التوجيه النهائي (ت.ن)' && 
                        field.name !== 'التوافق مع الرغبة (ت.ن)' && 
                        field.name !== 'ثبات الرغبة (ت.ن)' &&
                        field.name !== 'إقتراح مستشار التوجيه' &&
                        field.name !== 'إقتراح الأساتذة' &&
                        field.name !== 'قرار مجلس القبول والتوجيه' &&
                        field.name !== 'حالة الطعن' &&
                        field.name !== 'تأسيس الطعن' &&
                        field.name !== 'قرار الطعن' &&
                        field.name !== 'الشعبة المطعون فيها' &&
                        field.name !== 'الشعبة المرغوب فيها' &&
                        field.name !== 'قرار اللجنة الولائية للطعن'
                    )
                    .map((field) => renderField(field.name, field.type, field.options))}

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