import classNames from 'classnames';
import { Url } from 'next/dist/shared/lib/router/router';
import Link from 'next/link';
import React, { ReactNode } from 'react';

export function FilterTweetContainer(props: { children: ReactNode }) {
  return <ul className="bg-white rounded-lg py-5 shadow">{props.children}</ul>;
}

export function FilterTweetLink(props: {
  children: ReactNode;
  isActive?: boolean;
  href: Url;
}) {
  return (
    <li className="flex items-center space-x-4 mb-4 last:mb-0">
      <div
        className={classNames({
          'rounded-r-full w-[3px] h-8': true,
          'bg-transparent': !props.isActive,
          'bg-blue-500': props.isActive,
        })}
      />
      <Link
        href={props.href}
        className={classNames({
          'font-semibold text-sm hover:text-blue-500': true,
          'text-gray-700': !props.isActive,
          'text-blue-500': props.isActive,
        })}
      >
        {props.children}
      </Link>
    </li>
  );
}
