import * as React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
}

export function Container({ children }: ContainerProps) {
  return <div>{children}</div>;
}
