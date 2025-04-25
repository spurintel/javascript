import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  useMaxAllowedInstancesGuard,
  withMaxAllowedInstancesGuard,
} from '../useMaxAllowedInstancesGuard';

describe('useMaxAllowedInstancesGuard', () => {
  it('should allow a single instance of a component', () => {
    const TestComponent = () => {
      useMaxAllowedInstancesGuard('TestComponent', 'Only one instance allowed');
      return <div>Test Component</div>;
    };

    expect(() => render(<TestComponent />)).not.toThrow();
  });

  it('should throw an error when exceeding max instances', () => {
    const TestComponent = () => {
      useMaxAllowedInstancesGuard('TestComponent', 'Only one instance allowed');
      return <div>Test Component</div>;
    };

    // First instance should work
    render(<TestComponent />);

    // Second instance should throw
    expect(() => render(<TestComponent />)).toThrow(
      'Only one instance allowed'
    );
  });

  it('should allow multiple instances when maxCount is greater than 1', () => {
    const TestComponent = () => {
      useMaxAllowedInstancesGuard(
        'TestComponent',
        'Only two instances allowed',
        2
      );
      return <div>Test Component</div>;
    };

    // First instance
    render(<TestComponent />);

    // Second instance should work
    expect(() => render(<TestComponent />)).not.toThrow();

    // Third instance should throw
    expect(() => render(<TestComponent />)).toThrow(
      'Only two instances allowed'
    );
  });

  it('should decrement count when component unmounts', () => {
    const TestComponent = () => {
      useMaxAllowedInstancesGuard('TestComponent', 'Only one instance allowed');
      return <div>Test Component</div>;
    };

    const { unmount } = render(<TestComponent />);
    unmount();

    // After unmounting, we should be able to render again
    expect(() => render(<TestComponent />)).not.toThrow();
  });
});

describe('withMaxAllowedInstancesGuard', () => {
  interface TestComponentProps {
    text: string;
  }

  const TestComponent: React.FC<TestComponentProps> = ({ text }) => (
    <div>{text}</div>
  );
  TestComponent.displayName = 'TestComponent';

  it('should wrap a component with instance count protection', () => {
    const ProtectedComponent = withMaxAllowedInstancesGuard(
      TestComponent,
      'TestComponent',
      'Only one instance allowed'
    );

    render(<ProtectedComponent text="First Instance" />);
    expect(screen.getByText('First Instance')).toBeInTheDocument();

    expect(() => render(<ProtectedComponent text="Second Instance" />)).toThrow(
      'Only one instance allowed'
    );
  });

  it('should preserve component props', () => {
    const ProtectedComponent = withMaxAllowedInstancesGuard(
      TestComponent,
      'TestComponent',
      'Only one instance allowed'
    );

    render(<ProtectedComponent text="Test Text" />);
    expect(screen.getByText('Test Text')).toBeInTheDocument();
  });

  it('should use component displayName if available', () => {
    const ProtectedComponent = withMaxAllowedInstancesGuard(
      TestComponent,
      'TestComponent',
      'Only one instance allowed'
    );

    expect(ProtectedComponent.displayName).toBe(
      'withMaxAllowedInstancesGuard(TestComponent)'
    );
  });
});
