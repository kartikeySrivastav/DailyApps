import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppStorage } from '@dailyapps/storage';
import { CalculationRecord, SaveCalculationParams } from '../types/history.types';

export const GLOBAL_HISTORY_KEY = 'global_calc_history';
export const MAX_GLOBAL_ITEMS = 200;

export function useCalculationHistory(toolId?: string, category?: string) {
  const storage = useAppStorage();
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const lastSavedRef = useRef<string>('');

  const loadHistory = useCallback(async () => {
    try {
      const all = await storage.getJson<CalculationRecord[]>(GLOBAL_HISTORY_KEY, []);
      let filtered = all;
      if (toolId) {
        filtered = all.filter((item) => item.toolId === toolId);
      } else if (category) {
        filtered = all.filter((item) => item.category === category);
      }
      setHistory(filtered);
    } catch (e) {
      console.warn('Failed to load calculation history', e);
    } finally {
      setLoading(false);
    }
  }, [storage, toolId, category]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const saveCalculation = useCallback(
    async (params: SaveCalculationParams) => {
      // Prevent rapid identical duplicate saves
      const signature = `${params.toolId}:${params.title}:${params.result}`;
      if (lastSavedRef.current === signature) return;
      lastSavedRef.current = signature;

      const newRecord: CalculationRecord = {
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
        ...params,
      };

      try {
        const currentAll = await storage.getJson<CalculationRecord[]>(GLOBAL_HISTORY_KEY, []);
        // Prepend new record, filter out any existing with same id, cap at MAX_GLOBAL_ITEMS
        const updatedAll = [newRecord, ...currentAll.filter((item) => item.id !== newRecord.id)].slice(
          0,
          MAX_GLOBAL_ITEMS
        );
        await storage.setJson(GLOBAL_HISTORY_KEY, updatedAll);

        // Update local state
        if (toolId) {
          setHistory(updatedAll.filter((i) => i.toolId === toolId));
        } else if (category) {
          setHistory(updatedAll.filter((i) => i.category === category));
        } else {
          setHistory(updatedAll);
        }
      } catch (e) {
        console.warn('Failed to save calculation record', e);
      }
    },
    [storage, toolId, category]
  );

  const clearHistory = useCallback(async () => {
    try {
      if (toolId) {
        const currentAll = await storage.getJson<CalculationRecord[]>(GLOBAL_HISTORY_KEY, []);
        const remaining = currentAll.filter((item) => item.toolId !== toolId);
        await storage.setJson(GLOBAL_HISTORY_KEY, remaining);
        setHistory([]);
      } else if (category) {
        const currentAll = await storage.getJson<CalculationRecord[]>(GLOBAL_HISTORY_KEY, []);
        const remaining = currentAll.filter((item) => item.category !== category);
        await storage.setJson(GLOBAL_HISTORY_KEY, remaining);
        setHistory([]);
      } else {
        await storage.setJson(GLOBAL_HISTORY_KEY, []);
        setHistory([]);
      }
    } catch (e) {
      console.warn('Failed to clear calculation history', e);
    }
  }, [storage, toolId, category]);

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        const currentAll = await storage.getJson<CalculationRecord[]>(GLOBAL_HISTORY_KEY, []);
        const remaining = currentAll.filter((item) => item.id !== id);
        await storage.setJson(GLOBAL_HISTORY_KEY, remaining);
        setHistory((prev) => prev.filter((item) => item.id !== id));
      } catch (e) {
        console.warn('Failed to delete calculation item', e);
      }
    },
    [storage]
  );

  return {
    history,
    loading,
    saveCalculation,
    clearHistory,
    deleteItem,
    refreshHistory: loadHistory,
  };
}
