/**
 * React component for testing AST parsing
 */

import React, { useState, useEffect } from 'react';
import type { FC, ReactNode } from 'react';

export interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children?: ReactNode;
}

export const Button: FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export function Counter(): JSX.Element {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div>
      <h1>Count: {count}</h1>
      <Button label="Increment" onClick={increment} />
      <Button label="Decrement" onClick={decrement} />
    </div>
  );
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export default Counter;
