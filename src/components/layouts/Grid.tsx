import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Grid(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        'grid grid-cols-1 lg:grid-cols-3 gap-x-0 gap-y-4 lg:gap-x-6',
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
