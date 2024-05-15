import React, { ReactNode } from 'react';

export default function Grid(props: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6">
      {props.children}
    </div>
  );
}
