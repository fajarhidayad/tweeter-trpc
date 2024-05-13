import React, { ReactNode } from 'react';

export default function Main(props: { children: ReactNode }) {
  return <div className="container max-w-7xl pt-11">{props.children}</div>;
}
