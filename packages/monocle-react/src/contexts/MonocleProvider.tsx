import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { withMaxAllowedInstancesGuard } from '../utils';
import { MonocleProviderProps } from '../types';
import { DOMAIN } from '../constants';

interface MonocleContextType {
  assessment: string | undefined;
  refresh: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const MonocleContext = createContext<MonocleContextType | null>(null);

const MonocleProviderComponent: React.FC<MonocleProviderProps> = ({
  children,
  publishableKey,
  domain = DOMAIN,
  cpd,
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

      let src = `https://${domain}/d/mcl.js?tk=${publishableKey}`;
      if (cpd) {
        src += `&cpd=${cpd}`;
      }
      script.src = src;

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

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (window.MCL) {
        await window.MCL.refresh();
      } else {
        throw new Error('MCL object not found on window');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Unknown error occurred')
      );
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeMCL = async () => {
      try {
        await loadScript();
        if (window.MCL) {
          // Configure MCL with our callback to receive assessment updates
          await window.MCL.configure({
            onAssessment: (assessment: string) => {
              setAssessment(assessment);
              setIsLoading(false);
            },
          });

          // Check if assessment is already available
          const existingAssessment = window.MCL.getAssessment();
          if (existingAssessment) {
            setAssessment(existingAssessment);
            setIsLoading(false);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to initialize MCL')
        );
        setIsLoading(false);
      }
    };

    // Only initialize if we don't already have an assessment
    if (!assessment) {
      initializeMCL();
    }

    // Cleanup function to reset callback on unmount
    return () => {
      if (window.MCL) {
        window.MCL.configure({ onAssessment: undefined });
      }
    };
  }, [publishableKey, domain]);

  const contextValue = useMemo(
    () => ({ assessment, refresh, isLoading, error }),
    [assessment, refresh, isLoading, error]
  );

  return (
    <MonocleContext.Provider value={contextValue}>
      {children}
    </MonocleContext.Provider>
  );
};

export const MonocleProvider = withMaxAllowedInstancesGuard(
  MonocleProviderComponent,
  'MonocleProvider',
  'Only one instance of MonocleProvider is allowed'
);

/**
 * Hook to access the Monocle context.
 *
 * @returns {MonocleContextType} The Monocle context containing assessment data, loading state, and error information
 * @throws {Error} When used outside of a MonocleProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { assessment, isLoading, error, refresh } = useMonocle();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return <div>Assessment: {assessment}</div>;
 * }
 * ```
 */
export const useMonocle = () => {
  const context = useContext(MonocleContext);
  if (!context) {
    throw new Error('useMonocle must be used within a MonocleProvider');
  }
  return context;
};
