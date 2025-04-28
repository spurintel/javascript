import React, { createContext, useContext, useEffect, useState } from 'react';
import { withMaxAllowedInstancesGuard } from '../utils';

interface MonocleContextType {
  bundle: string | undefined;
  refresh: () => void;
  isLoading: boolean;
  error: Error | null;
}

const MonocleContext = createContext<MonocleContextType | null>(null);

interface MonocleProviderProps {
  children: React.ReactNode;
  publishableKey: string;
}

const MonocleProviderComponent: React.FC<MonocleProviderProps> = ({
  children,
  publishableKey,
}) => {
  const [bundle, setBundle] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadScript = () => {
    return new Promise<void>((resolve, reject) => {
      const existingScript = document.getElementById('_mcl');
      if (existingScript) {
        // If script exists but hasn't loaded yet, wait for it
        if (!window.MCL) {
          existingScript.onload = () => resolve();
          existingScript.onerror = () =>
            reject(new Error('Failed to load Monocle script'));
        } else {
          resolve();
        }
        return;
      }

      const script = document.createElement('script');
      script.id = '_mcl';
      script.async = true;
      script.src = `https://mcl.spur.us/d/mcl.js?tk=${publishableKey}`;
      script.onload = () => {
        resolve();
      };
      script.onerror = (_e) => {
        console.error('MonocleProvider: Script failed to load');
        reject(new Error('Failed to load Monocle script'));
      };
      document.head.appendChild(script);
    });
  };

  const refresh = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await loadScript();
      if (window.MCL) {
        const newBundle = window.MCL.getBundle();
        setBundle(newBundle);
      } else {
        throw new Error('MCL object not found on window');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Unknown error occurred')
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only refresh if the publishableKey changes and we don't already have a bundle
    if (!bundle) {
      refresh();
    }
  }, [publishableKey]);

  return (
    <MonocleContext.Provider value={{ bundle, refresh, isLoading, error }}>
      {children}
    </MonocleContext.Provider>
  );
};

export const MonocleProvider = withMaxAllowedInstancesGuard(
  MonocleProviderComponent,
  'MonocleProvider',
  'Only one instance of MonocleProvider is allowed'
);

export const useMonocle = () => {
  const context = useContext(MonocleContext);
  if (!context) {
    throw new Error('useMonocle must be used within a MonocleProvider');
  }
  return context;
};
