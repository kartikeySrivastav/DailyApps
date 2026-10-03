import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { AppStorage, createAppStorage } from './AppStorage';
import { StorageBackend } from './backend';

const StorageContext = createContext<AppStorage | null>(null);

export interface StorageProviderProps {
  appId: string;
  backend?: StorageBackend;
  children: ReactNode;
}

export const StorageProvider: React.FC<StorageProviderProps> = ({
  appId,
  backend,
  children,
}) => {
  const storage = useMemo(() => createAppStorage(appId, backend), [appId, backend]);

  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
};

export function useAppStorage(): AppStorage {
  const storage = useContext(StorageContext);
  if (!storage) {
    throw new Error('useAppStorage must be used within a StorageProvider');
  }
  return storage;
}
