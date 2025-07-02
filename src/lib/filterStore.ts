import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FilterState = {
  gender: ('ذكر' | 'أنثى')[];
  repeat: ('نعم' | 'لا')[];
  directorate: string[];
  school: string[];
  department: string[];
  decision: ('ينتقل إلى قسم أعلى' | 'يعيد السنة' | 'يوجه إلى التكوين المهني')[];
  profile: ('جذع مشترك علوم وتكنولوجيا' | 'جذع مشترك آداب وفلسفة')[];
};

type Actions = {
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  clearFilters: () => void;
};

const defaultState: FilterState = {
  gender: [],
  repeat: [],
  directorate: [],
  school: [],
  department: [],
  decision: [],
  profile: [],
};

export const useFilterStore = create<FilterState & Actions>()(
  persist(
    (set) => ({
      ...defaultState,
      setFilter: (key, value) => set((state) => ({ ...state, [key]: value })),
      clearFilters: () => set(defaultState),
    }),
    { 
      name: 'bem-filters',
      version: 1,
    }
  )
); 