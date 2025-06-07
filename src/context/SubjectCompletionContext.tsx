import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SubjectCompletionState {
  [subjectId: string]: boolean;
}

interface SubjectCompletionContextType {
  completionState: SubjectCompletionState;
  setSubjectCompleted: (subjectId: string, completed: boolean) => void;
  isSubjectCompleted: (subjectId: string) => boolean;
  getCompletedSubjectsCount: () => number;
  getTotalSubjectsCount: () => number;
  clearCompletionState: () => void;
}

const SubjectCompletionContext = createContext<SubjectCompletionContextType | undefined>(undefined);

interface SubjectCompletionProviderProps {
  children: ReactNode;
}

export function SubjectCompletionProvider({ children }: SubjectCompletionProviderProps) {
  const [completionState, setCompletionState] = useLocalStorage<SubjectCompletionState>(
    'subject-completion-state',
    {}
  );

  const setSubjectCompleted = (subjectId: string, completed: boolean) => {
    setCompletionState(prev => ({
      ...prev,
      [subjectId]: completed
    }));
  };

  const isSubjectCompleted = (subjectId: string): boolean => {
    return completionState[subjectId] || false;
  };

  const getCompletedSubjectsCount = (): number => {
    return Object.values(completionState).filter(Boolean).length;
  };

  const getTotalSubjectsCount = (): number => {
    return Object.keys(completionState).length;
  };

  const clearCompletionState = () => {
    setCompletionState({});
  };

  const value: SubjectCompletionContextType = {
    completionState,
    setSubjectCompleted,
    isSubjectCompleted,
    getCompletedSubjectsCount,
    getTotalSubjectsCount,
    clearCompletionState,
  };

  return (
    <SubjectCompletionContext.Provider value={value}>
      {children}
    </SubjectCompletionContext.Provider>
  );
}

export function useSubjectCompletion(): SubjectCompletionContextType {
  const context = useContext(SubjectCompletionContext);
  if (context === undefined) {
    throw new Error('useSubjectCompletion must be used within a SubjectCompletionProvider');
  }
  return context;
} 