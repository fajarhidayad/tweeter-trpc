import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Main(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge('container max-w-6xl py-5 lg:py-11', props.className)}
    >
      {props.children}
    </div>
  );
}
