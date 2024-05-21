import { LoaderIcon } from 'lucide-react';
import React from 'react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center">
      <LoaderIcon className="animate-spin text-blue-500" />
    </div>
  );
}
