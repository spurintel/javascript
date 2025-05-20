import React, { createContext, useContext, useEffect, useState } from 'react';
import { withMaxAllowedInstancesGuard } from '../utils';
import { MonocleProviderProps } from '../types';
import { DOMAIN } from '../constants';
interface MonocleContextType {
  assessment: string | undefined;
  refresh: () => void;
  isLoading: boolean;
  error: Error | null;
}

const MonocleContext = createContext<MonocleContextType | null>(null);

const MonocleProviderComponent: React.FC<MonocleProviderProps> = ({
  children,
  publishableKey,
  domain = DOMAIN,
}) => {
  const [assessment, setAssessment] = useState<string | undefined>(undefined);
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
      script.src = `https://${domain}/d/mcl.js?tk=${publishableKey}`;
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
        const newAssessment = window.MCL.getAssessment();
        setAssessment(newAssessment);
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
    // Only refresh if the publishableKey changes and we don't already have an assessment
    if (!assessment) {
      refresh();
    }
  }, [publishableKey]);

  return (
    <MonocleContext.Provider value={{ assessment, refresh, isLoading, error }}>
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
