"use client";

import { useState, useMemo, useCallback } from "react";
import { TriageMachine, type QuestionState, type Option } from "@/lib/triage";

export const useTriage = () => {
  const machine = useMemo(() => new TriageMachine(), []);

  const [currentState, setCurrentState] = useState<QuestionState | null>(() =>
    machine.getState()
  );
  const [sku, setSku] = useState<string | null>(null);
  const [finalProduct, setFinalProduct] = useState<Option | null>(null);
  const [fullProductName, setFullProductName] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);

  const selectOption = useCallback(
    (index: number) => {
      if (!currentState) return;
      
      const selectedOption = currentState.options[index];
      
      let labelForHistory = selectedOption.label;
      if (
        currentState.stateID === "askJanelaCorrerPersiana" ||
        currentState.stateID === "askPortaCorrerPersiana"
      ) {
        if (selectedOption.value === "sim") {
          labelForHistory = "Persiana";
        } else if (selectedOption.value === "nao") {
          labelForHistory = "";
        }
      }

      const newHistory = [...history, labelForHistory].filter(Boolean);
      setHistory(newHistory);
      const result = machine.triage(index);

      if (result && "sku" in result) {
        setSku(result.sku);
        setFinalProduct(selectedOption);
        setFullProductName(newHistory.join(" "));
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
    setFullProductName("");
  }, [machine]);

  return { currentState, sku, history, selectOption, reset, finalProduct, fullProductName };
};
