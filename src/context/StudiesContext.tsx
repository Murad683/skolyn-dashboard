import { createContext, useContext, useState, ReactNode } from 'react';
import { mockStudies, Study } from '@/data/mockData';

interface StudiesContextValue {
  studies: Study[];
  addStudy: (study: Study) => void;
  updateStudy: (id: string, updater: (study: Study) => Study) => void;
}

const StudiesContext = createContext<StudiesContextValue | undefined>(undefined);

export function StudiesProvider({ children }: { children: ReactNode }) {
  const [studies, setStudies] = useState<Study[]>([]);

  const addStudy = (study: Study) => {
    setStudies((prev) => [study, ...prev]);
  };

  const updateStudy = (id: string, updater: (study: Study) => Study) => {
    setStudies((prev) =>
      prev.map((study) => (study.id === id ? updater(study) : study))
    );
  };

  return (
    <StudiesContext.Provider value={{ studies, addStudy, updateStudy }}>
      {children}
    </StudiesContext.Provider>
  );
}

export const useStudies = () => {
  const context = useContext(StudiesContext);
  if (!context) {
    throw new Error('useStudies must be used within a StudiesProvider');
  }
  return context;
};
