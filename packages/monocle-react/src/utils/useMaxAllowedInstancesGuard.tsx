import React from 'react';

const instanceCounter = new Map<string, number>();

/**
 * A React hook that ensures a component is not instantiated more than a specified number of times.
 * Throws an error if the maximum number of instances is exceeded.
 *
 * @param name - A unique identifier for the component type
 * @param error - The error message to display if the maximum count is exceeded
 * @param maxCount - The maximum number of allowed instances (defaults to 1)
 * @throws Error when the maximum number of instances is exceeded
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   useMaxAllowedInstancesGuard('MyComponent', 'Only one instance of MyComponent is allowed');
 *   return <div>My Component</div>;
 * };
 * ```
 */
export function useMaxAllowedInstancesGuard(
  name: string,
  error: string,
  maxCount = 1
): void {
  React.useEffect(() => {
    const count = instanceCounter.get(name) || 0;
    if (count === maxCount) {
      throw new Error(error);
    }
    instanceCounter.set(name, count + 1);

    return () => {
      instanceCounter.set(name, (instanceCounter.get(name) || 1) - 1);
    };
  }, []);
}

/**
 * A higher-order component that wraps a component with instance count protection.
 * This HOC ensures that the wrapped component cannot be instantiated more than once
 * (or a specified number of times) in the application.
 *
 * @param WrappedComponent - The component to wrap with instance count protection
 * @param name - A unique identifier for the component type
 * @param error - The error message to display if the maximum count is exceeded
 * @returns A new component with instance count protection
 *
 * @example
 * ```tsx
 * const ProtectedComponent = withMaxAllowedInstancesGuard(
 *   MyComponent,
 *   'MyComponent',
 *   'Only one instance of MyComponent is allowed'
 * );
 * ```
 */
export function withMaxAllowedInstancesGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  name: string,
  error: string
): React.ComponentType<P> {
  const displayName =
    WrappedComponent.displayName ||
    WrappedComponent.name ||
    name ||
    'Component';

  const Hoc: React.FC<P> = (props) => {
    useMaxAllowedInstancesGuard(name, error);
    return <WrappedComponent {...props} />;
  };

  Hoc.displayName = `withMaxAllowedInstancesGuard(${displayName})`;
  return Hoc;
}
