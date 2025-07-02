import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, FilterX, Plus, X, Calendar, Hash, Type } from 'lucide-react';
import Select from 'react-select';

// Types for the filter system
export type FilterOperation = '=' | '>' | '<' | 'between' | 'contains';

export type FilterObject = {
  id: string;
  column: string;
  type: 'string' | 'number' | 'date';
  operation: FilterOperation;
  value: string | number | [number, number] | Date | [Date, Date];
};

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: string[];
  data: any[];
  onApplyFilters: (filters: FilterObject[]) => void;
  isDarkMode: boolean;
}

// Helper function to detect column type
const detectColumnType = (column: string, data: any[]): 'string' | 'number' | 'date' => {
  if (!data.length) return 'string';
  
  const sampleValues = data
    .map(row => row[column])
    .filter(val => val !== null && val !== undefined && val !== '')
    .slice(0, 10);

  if (sampleValues.length === 0) return 'string';

  // Check if it's a date
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (sampleValues.some(val => datePattern.test(String(val)))) {
    return 'date';
  }

  // Check if it's a number
  if (sampleValues.every(val => !isNaN(Number(val)) && val !== '')) {
    return 'number';
  }

  return 'string';
};

// Get available operations based on type
const getOperationsForType = (type: 'string' | 'number' | 'date'): { value: FilterOperation; label: string }[] => {
  switch (type) {
    case 'string':
      return [
        { value: '=', label: 'يساوي' },
        { value: 'contains', label: 'يحتوي على' }
      ];
    case 'number':
      return [
        { value: '=', label: 'يساوي' },
        { value: '>', label: 'أكبر من' },
        { value: '<', label: 'أقل من' },
        { value: 'between', label: 'بين' }
      ];
    case 'date':
      return [
        { value: '=', label: 'يساوي' },
        { value: '>', label: 'بعد' },
        { value: '<', label: 'قبل' },
        { value: 'between', label: 'بين' }
      ];
    default:
      return [];
  }
};

export const AdvancedFiltersModal: React.FC<AdvancedFiltersModalProps> = ({
  isOpen,
  onClose,
  columns,
  data,
  onApplyFilters,
  isDarkMode
}) => {
  const [filters, setFilters] = useState<FilterObject[]>([]);

  // Memoize column types to avoid recalculation
  const columnTypes = useMemo(() => {
    const types: Record<string, 'string' | 'number' | 'date'> = {};
    columns.forEach(col => {
      types[col] = detectColumnType(col, data);
    });
    return types;
  }, [columns, data]);

  // Memoize select styles
  const selectStyles = useMemo(() => ({
    control: (provided: any) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#374151' : 'white',
      borderColor: isDarkMode ? '#6B7280' : '#D1D5DB',
      color: isDarkMode ? 'white' : 'black',
      minHeight: '38px',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#374151' : 'white',
      zIndex: 9999,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused 
        ? (isDarkMode ? '#4B5563' : '#F3F4F6') 
        : 'transparent',
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

  const addFilter = useCallback(() => {
    const newFilter: FilterObject = {
      id: Date.now().toString(),
      column: columns[0] || '',
      type: 'string',
      operation: '=',
      value: ''
    };
    setFilters(prev => [...prev, newFilter]);
  }, [columns]);

  const removeFilter = useCallback((id: string) => {
    setFilters(prev => prev.filter(f => f.id !== id));
  }, []);

  const updateFilter = useCallback((id: string, updates: Partial<FilterObject>) => {
    setFilters(prev => prev.map(f => 
      f.id === id ? { ...f, ...updates } : f
    ));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters([]);
    onApplyFilters([]);
  }, [onApplyFilters]);

  const applyFilters = useCallback(() => {
    onApplyFilters(filters);
    onClose();
  }, [filters, onApplyFilters, onClose]);

  const getTypeIcon = (type: 'string' | 'number' | 'date') => {
    switch (type) {
      case 'string':
        return <Type className="w-4 h-4" />;
      case 'number':
        return <Hash className="w-4 h-4" />;
      case 'date':
        return <Calendar className="w-4 h-4" />;
    }
  };

  const renderValueInput = (filter: FilterObject) => {
    const { type, operation, value } = filter;

    if (operation === 'between') {
      if (type === 'number') {
        const [min, max] = Array.isArray(value) ? value : [0, 0];
        return (
          <div className="flex gap-2">
            <input
              type="number"
              value={min}
              onChange={(e) => updateFilter(filter.id, { 
                value: [Number(e.target.value), max] as [number, number] 
              })}
              className={`flex-1 px-3 py-2 border rounded-md text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="الحد الأدنى"
            />
            <input
              type="number"
              value={max}
              onChange={(e) => updateFilter(filter.id, { 
                value: [min, Number(e.target.value)] as [number, number] 
              })}
              className={`flex-1 px-3 py-2 border rounded-md text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="الحد الأقصى"
            />
          </div>
        );
      } else if (type === 'date') {
        const [start, end] = Array.isArray(value) ? value : [new Date(), new Date()];
        return (
          <div className="flex gap-2">
            <input
              type="date"
              value={start instanceof Date ? start.toISOString().split('T')[0] : ''}
              onChange={(e) => updateFilter(filter.id, { 
                value: [new Date(e.target.value), end] as [Date, Date] 
              })}
              className={`flex-1 px-3 py-2 border rounded-md text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            <input
              type="date"
              value={end instanceof Date ? end.toISOString().split('T')[0] : ''}
              onChange={(e) => updateFilter(filter.id, { 
                value: [start, new Date(e.target.value)] as [Date, Date] 
              })}
              className={`flex-1 px-3 py-2 border rounded-md text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        );
      }
    }

    // Single value inputs
    if (type === 'number') {
      return (
        <input
          type="number"
          value={typeof value === 'number' ? value : ''}
          onChange={(e) => updateFilter(filter.id, { value: Number(e.target.value) })}
          className={`w-full px-3 py-2 border rounded-md text-sm ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          placeholder="أدخل القيمة"
        />
      );
    } else if (type === 'date') {
      return (
        <input
          type="date"
          value={value instanceof Date ? value.toISOString().split('T')[0] : ''}
          onChange={(e) => updateFilter(filter.id, { value: new Date(e.target.value) })}
          className={`w-full px-3 py-2 border rounded-md text-sm ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
      );
    } else {
      return (
        <input
          type="text"
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md text-sm ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          placeholder="أدخل النص"
        />
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Filter className="w-6 h-6" />
              المرشحات المتقدمة
            </h3>
            <button 
              onClick={onClose}
              className={`p-2 rounded-md hover:bg-gray-100 ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {/* Filters List */}
              <AnimatePresence>
                {filters.map((filter, index) => (
                  <motion.div
                    key={filter.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className={`p-4 border rounded-lg ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(filter.type)}
                        <span className="text-sm font-medium">المرشح {index + 1}</span>
                      </div>
                      <button
                        onClick={() => removeFilter(filter.id)}
                        className={`p-1 rounded-md hover:bg-red-100 ${
                          isDarkMode ? 'hover:bg-red-900' : 'hover:bg-red-100'
                        }`}
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      {/* Column Select */}
                      <div>
                        <label className="block text-sm font-medium mb-1">العمود</label>
                        <Select
                          value={{ value: filter.column, label: filter.column }}
                          onChange={(option) => {
                            const newType = columnTypes[option?.value || ''];
                            updateFilter(filter.id, { 
                              column: option?.value || '', 
                              type: newType,
                              operation: getOperationsForType(newType)[0]?.value || '=',
                              value: ''
                            });
                          }}
                          options={columns.map(col => ({ value: col, label: col }))}
                          styles={selectStyles}
                          placeholder="اختر العمود"
                        />
                      </div>

                      {/* Operation Select */}
                      <div>
                        <label className="block text-sm font-medium mb-1">العملية</label>
                        <Select
                          value={{ 
                            value: filter.operation, 
                            label: getOperationsForType(filter.type).find(op => op.value === filter.operation)?.label || ''
                          }}
                          onChange={(option) => {
                            updateFilter(filter.id, { 
                              operation: option?.value as FilterOperation,
                              value: option?.value === 'between' ? 
                                (filter.type === 'number' ? [0, 0] : [new Date(), new Date()]) : ''
                            });
                          }}
                          options={getOperationsForType(filter.type)}
                          styles={selectStyles}
                          placeholder="اختر العملية"
                        />
                      </div>

                      {/* Value Input */}
                      <div>
                        <label className="block text-sm font-medium mb-1">القيمة</label>
                        {renderValueInput(filter)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add Filter Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addFilter}
                className={`w-full p-3 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <Plus className="w-5 h-5" />
                <span>إضافة مرشح جديد</span>
              </motion.button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAllFilters}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >  
                مسح الكل
                <FilterX className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className={`px-4 py-2 rounded-md transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                إلغاء
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={applyFilters}
                disabled={filters.length === 0}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filters.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                تطبيق المرشحات ({filters.length})
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 