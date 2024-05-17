import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export default function StickyTopContainer(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={twMerge('sticky top-5 self-start', props.className)}>
      {props.children}
    </section>
  );
}
