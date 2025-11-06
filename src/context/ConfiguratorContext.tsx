'use client';

import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { TriageMachine, type QuestionState, type Option } from '@/lib/triage';

// Define the shape of the context data
interface ConfiguratorContextType {
  currentState: QuestionState | null;
  sku: string | null;
  history: string[];
  finalProduct: Option | null;
  fullProductName: string;
  selectOption: (index: number) => void;
  reset: () => void;
}

// Create the context with a default value
const ConfiguratorContext = createContext<ConfiguratorContextType | undefined>(undefined);

// Create a custom hook to use the configurator context
export function useConfiguratorContext() {
  const context = useContext(ConfiguratorContext);
  if (!context) {
    throw new Error('useConfiguratorContext must be used within a ConfiguratorProvider');
  }
  return context;
}

// Create the provider component
export function ConfiguratorProvider({ children }: { children: ReactNode }) {
  const machine = useMemo(() => new TriageMachine(), []);

  const [currentState, setCurrentState] = useState<QuestionState | null>(() => machine.getState());
  const [sku, setSku] = useState<string | null>(null);
  const [finalProduct, setFinalProduct] = useState<Option | null>(null);
  const [fullProductName, setFullProductName] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);

  const selectOption = useCallback(
    (index: number) => {
      if (!currentState) return;

      const selectedOption = currentState.options[index];

      let labelForHistory = selectedOption.label;
      if (
        currentState.stateID === 'askJanelaCorrerPersiana' ||
        currentState.stateID === 'askPortaCorrerPersiana'
      ) {
        if (selectedOption.value === 'sim') {
          labelForHistory = 'Persiana';
        } else if (selectedOption.value === 'nao') {
          labelForHistory = '';
        }
      }

      const newHistory = [...history, labelForHistory].filter(Boolean);
      setHistory(newHistory);
      const result = machine.triage(index);

      if (result && 'sku' in result) {
        setSku(result.sku);
        setFinalProduct(selectedOption);
        setFullProductName(newHistory.join(' '));
        setCurrentState(null);
      } else if (result) {
        setCurrentState(result as QuestionState);
      }
    },
    [machine, currentState, history]
  );

  const reset = useCallback(() => {
    const initialState = machine.reset();
    setCurrentState(initialState);
    setSku(null);
    setFinalProduct(null);
    setHistory([]);
    setFullProductName('');
  }, [machine]);

  const value = {
    currentState,
    sku,
    history,
    finalProduct,
    fullProductName,
    selectOption,
    reset,
  };

  return (
    <ConfiguratorContext.Provider value={value}>
      {children}
    </ConfiguratorContext.Provider>
  );
}
