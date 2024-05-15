import { UserPlusIcon } from 'lucide-react';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export default function FollowButton(props: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={props.onClick}
      className={twMerge(
        'flex bg-blue-500 text-white text-xs font-medium ml-auto rounded py-1 px-3 space-x-1',
        props.className
      )}
    >
      <UserPlusIcon size={14} />
      <span>Follow</span>
    </button>
  );
}
