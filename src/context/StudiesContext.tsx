import { createContext, useContext, useState, ReactNode } from 'react';
import { Study, AIFindings } from '@/data/mockData';

interface StudiesContextType {
  studies: Study[];
  addStudy: (study: Study) => void;
  updateStudyStatus: (studyId: string, status: Study['status'], aiFindings?: AIFindings) => void;
}

const StudiesContext = createContext<StudiesContextType | undefined>(undefined);

export function StudiesProvider({ children }: { children: ReactNode }) {
  const [studies, setStudies] = useState<Study[]>([]);

  const addStudy = (study: Study) => {
    setStudies(prev => [study, ...prev]);
  };

  const updateStudyStatus = (studyId: string, status: Study['status'], aiFindings?: AIFindings) => {
    setStudies(prev => prev.map(s => 
      s.id === studyId 
        ? { ...s, status, ...(aiFindings ? { aiFindings } : {}) }
        : s
    ));
  };

  return (
    <StudiesContext.Provider value={{ studies, addStudy, updateStudyStatus }}>
      {children}
    </StudiesContext.Provider>
  );
}

export function useStudies() {
  const context = useContext(StudiesContext);
  if (context === undefined) {
    throw new Error('useStudies must be used within a StudiesProvider');
  }
  return context;
}
