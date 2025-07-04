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

  const renderGreadField = (name: string, type: string = 'text', options?: string[], isMulti = false) => {
    return (
      <div key={name} className="space-y-2">
        <label className={`block text-sm font-medium text-gray-700 ${isDarkMode ? 'dark-mode' : ''}`}>{}</label>
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

  const renderTitleField = (name: string) => {
    return (
      <div key={name} className="space-y-2 mt-4">
        <label className={`block text-sm text-center font-medium text-gray-700 ${isDarkMode ? 'dark-mode' : ''}`}>{name}</label>
      </div>
    );
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
    ],

    'جانب معدلات المواد': [
      { name: 'معدل الفصل الأول', type: 'number'},
      { name: 'معدل الفصل الثاني', type: 'number'},
      { name: 'معدل الفصل الثالث', type: 'number'},
      { name: 'المعدل سنوي', type: 'number'},
      { name: 'معدل ش ت م', type: 'number'},

      { name: 'اللغة العربية ف 1', type: 'number'},
      { name: 'اللغة العربية ف 2', type: 'number'},
      { name: 'اللغة العربية ف 3', type: 'number'},
      { name: 'اللغة العربية م س', type: 'number'},
      { name: 'العربية ش ت م', type: 'number'},

      { name: 'اللغة اﻷمازيغية ف 1', type: 'number'},
      { name: 'اللغة اﻷمازيغية ف 2', type: 'number'},
      { name: 'اللغة اﻷمازيغية ف 3', type: 'number'},
      { name: 'اللغة اﻷمازيغية م س', type: 'number'},
      { name: 'اﻷمازيغية ش ت م', type: 'number'},

      { name: 'اللغة الفرنسية ف 1', type: 'number'},
      { name: 'اللغة الفرنسية ف 2', type: 'number'},
      { name: 'اللغة الفرنسية ف 3', type: 'number'},
      { name: 'اللغة الفرنسية م س', type: 'number'},
      { name: 'الفرنسية ش ت م', type: 'number'},

      { name: 'اللغة الإنجليزية ف 1', type: 'number'},
      { name: 'اللغة الإنجليزية ف 2', type: 'number'},
      { name: 'اللغة الإنجليزية ف 3', type: 'number'},
      { name: 'اللغة الإنجليزية م س', type: 'number'},
      { name: 'الإنجليزية ش ت م', type: 'number'},

      { name: 'التربية الإسلامية ف 1', type: 'number'},
      { name: 'التربية الإسلامية ف 2', type: 'number'},
      { name: 'التربية الإسلامية ف 3', type: 'number'},
      { name: 'التربية الإسلامية م س', type: 'number'},
      { name: 'ت إسلامية ش ت م', type: 'number'},

      { name: 'التربية المدنية ف 1', type: 'number'},
      { name: 'التربية المدنية ف 2', type: 'number'},
      { name: 'التربية المدنية ف 3', type: 'number'},
      { name: 'التربية المدنية م س', type: 'number'},
      { name: 'ت مدنية ش ت م', type: 'number'},

      { name: 'التاريخ والجغرافيا ف 1', type: 'number'},
      { name: 'التاريخ والجغرافيا ف 2', type: 'number'},
      { name: 'التاريخ والجغرافيا ف 3', type: 'number'},
      { name: 'التاريخ والجغرافيا م س', type: 'number'},
      { name: 'تاريخ جغرافيا ش ت م', type: 'number'},

      { name: 'الرياضيات ف 1', type: 'number'},
      { name: 'الرياضيات ف 2', type: 'number'},
      { name: 'الرياضيات ف 3', type: 'number'},
      { name: 'الرياضيات م س', type: 'number'},
      { name: 'رياضيات ش ت م', type: 'number'},

      { name: 'ع الطبيعة و الحياة ف 1', type: 'number'},
      { name: 'ع الطبيعة و الحياة ف 2', type: 'number'},
      { name: 'ع الطبيعة و الحياة ف 3', type: 'number'},
      { name: 'ع الطبيعة و الحياة م س', type: 'number'},
      { name: 'علوم ط ش ت م', type: 'number'},

      { name: 'ع الفيزيائية والتكنولوجيا ف 1', type: 'number'},
      { name: 'ع الفيزيائية والتكنولوجيا ف 2', type: 'number'},
      { name: 'ع الفيزيائية والتكنولوجيا ف 3', type: 'number'},
      { name: 'ع الفيزيائية والتكنولوجيا م س', type: 'number'},
      { name: 'فيزياء ش ت م', type: 'number'},

      { name: 'المعلوماتية ف 1', type: 'number'},
      { name: 'المعلوماتية ف 2', type: 'number'},
      { name: 'المعلوماتية ف 3', type: 'number'},
      { name: 'المعلوماتية م س', type: 'number'},
      { name: 'معلوماتية ش ت م', type: 'number'},

      { name: 'التربية التشكيلية ف 1', type: 'number'},
      { name: 'التربية التشكيلية ف 2', type: 'number'},
      { name: 'التربية التشكيلية ف 3', type: 'number'},
      { name: 'التربية التشكيلية م س', type: 'number'},
      { name: 'ت تشكيلية ش ت م', type: 'number'},

      { name: 'التربية الموسيقية ف 1', type: 'number'},
      { name: 'التربية الموسيقية ف 2', type: 'number'},
      { name: 'التربية الموسيقية ف 3', type: 'number'},
      { name: 'التربية الموسيقية م س', type: 'number'},
      { name: 'ت موسيقية ش ت م', type: 'number'},

      { name: 'ت البدنية و الرياضية ف 1', type: 'number'},
      { name: 'ت البدنية و الرياضية ف 2', type: 'number'},
      { name: 'ت البدنية و الرياضية ف 3', type: 'number'},
      { name: 'ت البدنية و الرياضية م س', type: 'number'},
      { name: 'ت بدنية ش ت م', type: 'number'},
    ],

    'جانب المعدلات الفصلية': [
      { name: 'معدل الفصل 1', type: 'number'},
      { name: 'معدل الفصل 2', type: 'number'},
      { name: 'معدل الفصل 3', type: 'number'},
      { name: 'المعدل السنوي', type: 'number'},
      { name: 'معدل ش ت م', type: 'number'},
      { name: 'معدل الإنتقال', type: 'number'},
    ],

    'الإجراءات والقرارات المتخذة': [
      { name: 'القرار', type: 'select', options: [
        'ينتقل إلى قسم أعلى',
        'يعيد السنة',] },
      { name: 'الملمح', type: 'select', options: [
        'جذع مشترك علوم وتكنولوجيا',
        'جذع مشترك آداب وفلسفة'] },
      { name: 'الترتيب', type: 'number'},
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
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden ${isDarkMode ? 'dark-mode' : ''}`}>
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

                  {/*-------------- جانب معدلات المواد --------------*/}
                  {sectionTitle === 'جانب معدلات المواد' ? (
                  <>

                  <div className="flex gap-1 col-span-2">
                    <div className="w-[180px] p-4 dark:bg-gray-800">
                      <label className={`block text-sm text-center font-medium text-gray-700 dark:text-gray-200 ${isDarkMode ? 'dark-mode' : ''}`}>-</label>
                    </div>
                      {fields
                        .filter(
                          (field) =>
                          field.name ===  'معدل الفصل الأول' ||
                          field.name ===  'معدل الفصل الثاني' ||
                          field.name ===  'معدل الفصل الثالث' ||
                          field.name ===  'المعدل سنوي' ||
                          field.name ===  'معدل ش ت م'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1 mt-4">
                            {renderTitleField(field.name)}
                          </div>
                        ))}
                    </div>
                    
                    <div className="flex gap-4 col-span-2">
                    <div className="w-[180px] p-4 dark:bg-gray-800">
                      <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${isDarkMode ? 'dark-mode' : ''}`}>
                        اللغة العربية
                      </label>
                    </div>
                      {fields
                        .filter(
                          (field) =>
                          field.name === 'اللغة العربية ف 1' ||
                          field.name === 'اللغة العربية ف 2' ||
                          field.name === 'اللغة العربية ف 3' ||
                          field.name === 'اللغة العربية م س' ||
                          field.name === 'العربية ش ت م'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderGreadField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                    <div className="w-[180px] p-4 dark:bg-gray-800">
                      <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${isDarkMode ? 'dark-mode' : ''}`}>
                        اللغة اﻷمازيغية
                      </label>
                    </div>
                      {fields
                        .filter(
                          (field) =>
                          field.name === 'اللغة اﻷمازيغية ف 1' ||
                          field.name === 'اللغة اﻷمازيغية ف 2' ||
                          field.name === 'اللغة اﻷمازيغية ف 3' ||
                          field.name === 'اللغة اﻷمازيغية م س' ||
                          field.name === 'اﻷمازيغية ش ت م'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderGreadField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                    <div className="w-[180px] p-4 dark:bg-gray-800">
                      <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${isDarkMode ? 'dark-mode' : ''}`}>
                        اللغة الفرنسية
                      </label>
                    </div>
                    
                      {fields
                        .filter(
                          (field) =>
                          field.name === 'اللغة الفرنسية ف 1' ||
                          field.name === 'اللغة الفرنسية ف 2' ||
                          field.name === 'اللغة الفرنسية ف 3' ||
                          field.name === 'اللغة الفرنسية م س' ||
                          field.name === 'الفرنسية ش ت م'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderGreadField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                    <div className="w-[180px] p-4 dark:bg-gray-800">
                      <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${isDarkMode ? 'dark-mode' : ''}`}>
                        اللغة الإنجليزية
                      </label>
                    </div>
                      {fields
                        .filter(
                          (field) =>
                          field.name === 'اللغة الإنجليزية ف 1' ||
                          field.name === 'اللغة الإنجليزية ف 2' ||
                          field.name === 'اللغة الإنجليزية ف 3' ||
                          field.name === 'اللغة الإنجليزية م س' ||
                          field.name === 'الإنجليزية ش ت م'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderGreadField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                    <div className="w-[180px] p-4 dark:bg-gray-800">
                      <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${isDarkMode ? 'dark-mode' : ''}`}>
                        التربية الإسلامية
                      </label>
                    </div>
                      {fields
                        .filter(
                          (field) =>
                          field.name === 'التربية الإسلامية ف 1' ||
                          field.name === 'التربية الإسلامية ف 2' ||
                          field.name === 'التربية الإسلامية ف 3' ||
                          field.name === 'التربية الإسلامية م س' ||
                          field.name === 'ت إسلامية ش ت م'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderGreadField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                    <div className="w-[180px] p-4 dark:bg-gray-800">
                      <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${isDarkMode ? 'dark-mode' : ''}`}>
                        التربية المدنية
                      </label>
                    </div>
                      {fields
                        .filter(
                          (field) =>
                          field.name === 'التربية المدنية ف 1' ||
                          field.name === 'التربية المدنية ف 2' ||
                          field.name === 'التربية المدنية ف 3' ||
                          field.name === 'التربية المدنية م س' ||
                          field.name === 'ت مدنية ش ت م'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderGreadField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                    <div className="w-[180px] p-4 dark:bg-gray-800">
                      <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${isDarkMode ? 'dark-mode' : ''}`}>
                      التاريخ والجغرافيا
                      </label>
                    </div>
                      {fields
                        .filter(
                          (field) =>
                          field.name === 'التاريخ والجغرافيا ف 1' ||
                          field.name === 'التاريخ والجغرافيا ف 2' ||
                          field.name === 'التاريخ والجغرافيا ف 3' ||
                          field.name === 'التاريخ والجغرافيا م س' ||
                          field.name === 'تاريخ جغرافيا ش ت م'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderGreadField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                    <div className="w-[180px] p-4 dark:bg-gray-800">
                      <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${isDarkMode ? 'dark-mode' : ''}`}>
                      الرياضيات
                      </label>
                    </div>
                      {fields
                        .filter(
                          (field) =>
                          field.name === 'الرياضيات ف 1' ||
                          field.name === 'الرياضيات ف 2' ||
                          field.name === 'الرياضيات ف 3' ||
                          field.name === 'الرياضيات م س' ||
                          field.name === 'رياضيات ش ت م'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderGreadField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                    <div className="w-[180px] p-4 dark:bg-gray-800">
                      <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${isDarkMode ? 'dark-mode' : ''}`}>
                      ع الطبيعة و الحياة
                      </label>
                    </div>
                      {fields
                        .filter(
                          (field) =>
                          field.name === 'ع الطبيعة و الحياة ف 1' ||
                          field.name === 'ع الطبيعة و الحياة ف 2' ||
                          field.name === 'ع الطبيعة و الحياة ف 3' ||
                          field.name === 'ع الطبيعة و الحياة م س' ||
                          field.name === 'علوم ط ش ت م'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderGreadField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                    <div className="w-[180px] p-4 dark:bg-gray-800">
                      <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${isDarkMode ? 'dark-mode' : ''}`}>
                      ع الفزيائية والتكنولوجيا
                      </label>
                    </div>
                      {fields
                        .filter(
                          (field) =>
                          field.name === 'ع الفيزيائية والتكنولوجيا ف 1' ||
                          field.name === 'ع الفيزيائية والتكنولوجيا ف 2' ||
                          field.name === 'ع الفيزيائية والتكنولوجيا ف 3' ||
                          field.name === 'ع الفيزيائية والتكنولوجيا م س' ||
                          field.name === 'فيزياء ش ت م'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderGreadField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                    <div className="w-[180px] p-4 dark:bg-gray-800">
                      <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${isDarkMode ? 'dark-mode' : ''}`}>
                      المعلوماتية
                      </label>
                    </div>
                      {fields
                        .filter(
                          (field) =>
                          field.name === 'المعلوماتية ف 1' ||
                          field.name === 'المعلوماتية ف 2' ||
                          field.name === 'المعلوماتية ف 3' ||
                          field.name === 'المعلوماتية م س' ||
                          field.name === 'معلوماتية ش ت م'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderGreadField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                    <div className="w-[180px] p-4 dark:bg-gray-800">
                      <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${isDarkMode ? 'dark-mode' : ''}`}>
                      التربية التشكيلية
                      </label>
                    </div>
                      {fields
                        .filter(
                          (field) =>
                          field.name === 'التربية التشكيلية ف 1' ||
                          field.name === 'التربية التشكيلية ف 2' ||
                          field.name === 'التربية التشكيلية ف 3' ||
                          field.name === 'التربية التشكيلية م س' ||
                          field.name === 'ت تشكيلية ش ت م'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderGreadField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                    <div className="w-[180px] p-4 dark:bg-gray-800">
                      <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${isDarkMode ? 'dark-mode' : ''}`}>
                      التربية الموسيقية
                      </label>
                    </div>
                      {fields
                        .filter(
                          (field) =>
                          field.name === 'التربية الموسيقية ف 1' ||
                          field.name === 'التربية الموسيقية ف 2' ||
                          field.name === 'التربية الموسيقية ف 3' ||
                          field.name === 'التربية الموسيقية م س' ||
                          field.name === 'ت موسيقية ش ت م'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderGreadField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 col-span-2">
                    <div className="w-[180px] p-4 dark:bg-gray-800">
                      <label className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${isDarkMode ? 'dark-mode' : ''}`}>
                      ت البدنية و الرياضية
                      </label>
                    </div>
                      {fields
                        .filter(
                          (field) =>
                          field.name === 'ت البدنية و الرياضية ف 1' ||
                          field.name === 'ت البدنية و الرياضية ف 2' ||
                          field.name === 'ت البدنية و الرياضية ف 3' ||
                          field.name === 'ت البدنية و الرياضية م س' ||
                          field.name === 'ت بدنية ش ت م'
                        )
                        .map((field) => (
                          <div key={field.name} className="flex-1">
                            {renderGreadField(field.name, field.type, field.options)}
                          </div>
                        ))}
                    </div>
                  </>
                  ) : null}

                  {/*-------------- جانب المعدلات الفصلية --------------*/}
                  {sectionTitle === 'جانب المعدلات الفصلية' ? (
                  <>
                    
                    <div className="flex gap-4 col-span-2">
                      {fields
                        .filter(
                          (field) =>
                            field.name === 'معدل الفصل 1' ||
                            field.name === 'معدل الفصل 2' ||
                            field.name === 'معدل الفصل 3'
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
                            field.name === 'المعدل السنوي' ||
                            field.name === 'معدل ش ت م' ||
                            field.name === 'معدل الإنتقال'
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
                    <div className="flex gap-4 col-span-2">
                    {fields
                      .filter(
                        (field) =>
                          field.name === 'القرار' ||
                          field.name === 'الملمح' ||
                          field.name !== 'الترتيب'
                      )
                      .map((field) => (
                        <div key={field.name} className="flex-1">
                          {renderField(field.name, field.type, field.options)}
                        </div>
                      ))}
                  </div>
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

                        field.name !== 'معدل الفصل الأول' &&
                        field.name !== 'معدل الفصل الثاني' &&
                        field.name !== 'معدل الفصل الثالث' &&
                        field.name !== 'المعدل سنوي' &&

                        field.name !== 'اللغة العربية ف 1' &&
                        field.name !== 'اللغة العربية ف 2' &&
                        field.name !== 'اللغة العربية ف 3' &&
                        field.name !== 'اللغة العربية م س' &&
                        field.name !== 'العربية ش ت م' &&

                        field.name !== 'اللغة اﻷمازيغية ف 1' &&
                        field.name !== 'اللغة اﻷمازيغية ف 2' &&
                        field.name !== 'اللغة اﻷمازيغية ف 3' &&
                        field.name !== 'اللغة اﻷمازيغية م س' &&
                        field.name !== 'اﻷمازيغية ش ت م' &&

                        field.name !== 'اللغة الفرنسية ف 1' &&
                        field.name !== 'اللغة الفرنسية ف 2' &&
                        field.name !== 'اللغة الفرنسية ف 3' &&
                        field.name !== 'اللغة الفرنسية م س' &&
                        field.name !== 'الفرنسية ش ت م' &&

                        field.name !== 'اللغة الإنجليزية ف 1' &&
                        field.name !== 'اللغة الإنجليزية ف 2' &&
                        field.name !== 'اللغة الإنجليزية ف 3' &&
                        field.name !== 'اللغة الإنجليزية م س' &&
                        field.name !== 'الإنجليزية ش ت م' &&

                        field.name !== 'التربية الإسلامية ف 1' &&
                        field.name !== 'التربية الإسلامية ف 2' &&
                        field.name !== 'التربية الإسلامية ف 3' &&
                        field.name !== 'التربية الإسلامية م س' &&
                        field.name !== 'ت إسلامية ش ت م' &&

                        field.name !== 'التربية المدنية ف 1' &&
                        field.name !== 'التربية المدنية ف 2' &&
                        field.name !== 'التربية المدنية ف 3' &&
                        field.name !== 'التربية المدنية م س' &&
                        field.name !== 'ت مدنية ش ت م' &&

                        field.name !== 'التاريخ والجغرافيا ف 1' &&
                        field.name !== 'التاريخ والجغرافيا ف 2' &&
                        field.name !== 'التاريخ والجغرافيا ف 3' &&
                        field.name !== 'التاريخ والجغرافيا م س' &&
                        field.name !== 'تاريخ جغرافيا ش ت م' &&

                        field.name !== 'الرياضيات ف 1' &&
                        field.name !== 'الرياضيات ف 2' &&
                        field.name !== 'الرياضيات ف 3' &&
                        field.name !== 'الرياضيات م س' &&
                        field.name !== 'رياضيات ش ت م' &&

                        field.name !== 'ع الطبيعة و الحياة ف 1' &&
                        field.name !== 'ع الطبيعة و الحياة ف 2' &&
                        field.name !== 'ع الطبيعة و الحياة ف 3' &&
                        field.name !== 'ع الطبيعة و الحياة م س' &&
                        field.name !== 'علوم ط ش ت م' &&

                        field.name !== 'ع الفيزيائية والتكنولوجيا ف 1' &&
                        field.name !== 'ع الفيزيائية والتكنولوجيا ف 2' &&
                        field.name !== 'ع الفيزيائية والتكنولوجيا ف 3' &&
                        field.name !== 'ع الفيزيائية والتكنولوجيا م س' &&
                        field.name !== 'فيزياء ش ت م' &&

                        field.name !== 'المعلوماتية ف 1' &&
                        field.name !== 'المعلوماتية ف 2' &&
                        field.name !== 'المعلوماتية ف 3' &&
                        field.name !== 'المعلوماتية م س' &&
                        field.name !== 'معلوماتية ش ت م' &&

                        field.name !== 'التربية التشكيلية ف 1' &&
                        field.name !== 'التربية التشكيلية ف 2' &&
                        field.name !== 'التربية التشكيلية ف 3' &&
                        field.name !== 'التربية التشكيلية م س' &&
                        field.name !== 'ت تشكيلية ش ت م' &&

                        field.name !== 'التربية الموسيقية ف 1' &&
                        field.name !== 'التربية الموسيقية ف 2' &&
                        field.name !== 'التربية الموسيقية ف 3' &&
                        field.name !== 'التربية الموسيقية م س' &&
                        field.name !== 'ت موسيقية ش ت م' &&

                        field.name !== 'ت البدنية و الرياضية ف 1' &&
                        field.name !== 'ت البدنية و الرياضية ف 2' &&
                        field.name !== 'ت البدنية و الرياضية ف 3' &&
                        field.name !== 'ت البدنية و الرياضية م س' &&
                        field.name !== 'ت بدنية ش ت م' &&

                        field.name !== 'معدل الفصل 1' &&
                        field.name !== 'معدل الفصل 2' &&
                        field.name !== 'معدل الفصل 3' &&
                        field.name !== 'المعدل السنوي' &&
                        field.name !== 'معدل ش ت م' &&
                        field.name !== 'معدل الإنتقال' &&

                        field.name !== 'القرار' &&
                        field.name !== 'الملمح' &&
                        field.name !== 'الترتيب'

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