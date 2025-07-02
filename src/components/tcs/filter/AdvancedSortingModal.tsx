import React, { useMemo, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { ListRestart, Plus, X, GripVertical, SortAsc, SortDesc, Type, Hash, Calendar} from 'lucide-react';
import Select from 'react-select';
import CustomModal from '../Modal';

export type SortRule = {
  id: string;
  column: string;
  type: 'string' | 'number' | 'date';
  direction: 'asc' | 'desc';
};

interface AdvancedSortingModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: string[];
  data: any[];
  onApplySorting: (rules: Omit<SortRule, 'id'>[]) => void;
  isDarkMode: boolean;
  initialRules?: Omit<SortRule, 'id'>[];
}

// Helper to detect column type (string, number, date)
const detectColumnType = (column: string, data: any[]): 'string' | 'number' | 'date' => {
  if (!data.length) return 'string';
  const sampleValues = data
    .map(row => row[column])
    .filter(val => val !== null && val !== undefined && val !== '')
    .slice(0, 10);
  if (sampleValues.length === 0) return 'string';
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (sampleValues.some(val => datePattern.test(String(val)))) return 'date';
  if (sampleValues.every(val => !isNaN(Number(val)) && val !== '')) return 'number';
  return 'string';
};

const directionOptions = [
  { value: 'asc', label: 'تصاعدي', icon: <SortAsc className="w-4 h-4 inline" /> },
  { value: 'desc', label: 'تنازلي', icon: <SortDesc className="w-4 h-4 inline" /> },
];

export const AdvancedSortingModal: React.FC<AdvancedSortingModalProps> = ({
  isOpen,
  onClose,
  columns,
  data,
  onApplySorting,
  isDarkMode,
  initialRules = [],
}) => {
  const [sortRules, setSortRules] = React.useState<SortRule[]>([]);

  // Sync sortRules with initialRules when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSortRules(
        initialRules.map(rule => ({
          ...rule,
          id: rule.column + '-' + rule.direction // deterministic id for rehydration
        }))
      );
    }
  }, [isOpen, initialRules]);

  // Memoize column types
  const columnTypes = useMemo(() => {
    const types: Record<string, 'string' | 'number' | 'date'> = {};
    columns.forEach(col => {
      types[col] = detectColumnType(col, data);
    });
    return types;
  }, [columns, data]);

  // react-select styles
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

  // Add a new sort rule
  const addSortRule = useCallback(() => {
    const availableColumns = columns.filter(col => !sortRules.some(rule => rule.column === col));
    setSortRules(prev => [
      ...prev,
      {
        id: Date.now().toString() + Math.random(),
        column: availableColumns[0] || columns[0] || '',
        type: 'string',
        direction: 'asc',
      },
    ]);
  }, [columns, sortRules]);

  // Remove a sort rule
  const removeSortRule = useCallback((id: string) => {
    setSortRules(prev => prev.filter(rule => rule.id !== id));
  }, []);

  // Update a sort rule
  const updateSortRule = useCallback((id: string, updates: Partial<SortRule>) => {
    setSortRules(prev => prev.map(rule => rule.id === id ? { ...rule, ...updates } : rule));
  }, []);

  // Reset all sort rules
  const resetSorting = useCallback(() => {
    setSortRules([]);
    onApplySorting([]);
    onClose();
  }, [onApplySorting, onClose]);

  // Apply sorting
  const applySorting = useCallback(() => {
    onApplySorting(sortRules.map(({ id, ...rest }) => rest));
    onClose();
  }, [sortRules, onApplySorting, onClose]);

  // Drag-and-drop reordering
  const handleReorder = (newOrder: SortRule[]) => {
    setSortRules(newOrder);
  };

  // Prevent duplicate columns in rules
  const getAvailableColumns = (currentId: string) => {
    return columns.filter(col =>
      !sortRules.some(rule => rule.column === col && rule.id !== currentId)
    );
  };

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
  

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="الفرز المتقدم"
      isDarkMode={isDarkMode}
    >
      <motion.div className="space-y-4">
        <AnimatePresence>
          <Reorder.Group
            axis="y"
            values={sortRules}
            onReorder={handleReorder}
            className="space-y-3"
          >
            {sortRules.map((rule, index) => (
              <Reorder.Item
                key={rule.id}
                value={rule}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={`p-4 border rounded-lg shadow-sm ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}
              >
                {/* Header Row: Label on right, remove button on left */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(rule.type)}
                    <span className="text-sm font-medium">المرشح {index + 1}</span>
                  </div>
                  <button
                    onClick={() => removeSortRule(rule.id)}
                    className={`p-1 rounded-md ${
                      isDarkMode ? 'hover:bg-red-900' : 'hover:bg-red-100'
                    }`}
                    title="إزالة"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>


                {/* Sorting Rule Controls */}
                <div className="grid grid-cols-1 md:grid-cols-[auto,1fr,1fr] gap-3 items-center">
                  {/* Drag handle */}
                  <span className="flex mt-6 cursor-grab text-gray-400">
                    <GripVertical className="w-5 h-5" />
                  </span>
       
                  {/* Column select */}
                  <div>
                    <label className="block text-sm font-medium mb-1">العمود</label>
                    <Select
                      value={{ value: rule.column, label: rule.column }}
                      onChange={(option) =>
                        updateSortRule(rule.id, { column: option?.value || '' })
                      }
                      options={getAvailableColumns(rule.id).map((col) => ({
                        value: col,
                        label: col,
                      }))}
                      styles={selectStyles}
                      placeholder="اختر العمود"
                    />
                  </div>

                  {/* Direction select */}
                  <div>
                    <label className="block text-sm font-medium mb-1">الاتجاه</label>
                    <Select
                      value={directionOptions.find((opt) => opt.value === rule.direction)}
                      onChange={(option) =>
                        updateSortRule(rule.id, {
                          direction: option?.value as 'asc' | 'desc',
                        })
                      }
                      options={directionOptions}
                      styles={selectStyles}
                      formatOptionLabel={(opt) => (
                        <span className="flex items-center gap-1">
                          {opt.icon}
                          {opt.label}
                        </span>
                      )}
                      placeholder="الاتجاه"
                    />
                  </div>
                  
                </div>
              </Reorder.Item>
            ))}

          </Reorder.Group>
        </AnimatePresence>
        
        <div className="flex gap-2">
          {/* Add Sorting Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addSortRule}
            className={`w-full p-3 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 transition-colors ${
              isDarkMode 
                ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span>إضافة فرز جديد</span>
          </motion.button>
        </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetSorting}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >  
                مسح الكل
                <ListRestart className="w-4 h-4" />
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
                onClick={applySorting}
                disabled={sortRules.length === 0}
                className={`px-4 py-2 rounded-md transition-colors ${
                  sortRules.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                تطبيق الفرز ({sortRules.length})
              </motion.button>
            </div>
          </div>
      </motion.div>
    </CustomModal>
  );
};

export default AdvancedSortingModal; 