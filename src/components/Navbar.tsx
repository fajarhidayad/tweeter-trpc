import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import classNames from 'classnames';

export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="container max-w-7xl flex justify-between items-center">
        <Link href={'/'} className="font-semibold text-lg">
          Tweeter
        </Link>

        <ul className="flex items-center space-x-14 pt-6">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/explore">Explore</NavLink>
          <NavLink href="/bookmark">Bookmarks</NavLink>
        </ul>

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-gray-200"></div>
          <p className="font-semibold">User Name</p>
        </div>
      </div>
    </nav>
  );
}

function NavLink(props: { children: ReactNode; href: string }) {
  const router = useRouter();
  const isActive = router.asPath === props.href;
  return (
    <li className="group">
      <Link
        href={props.href}
        className={classNames({
          'group-hover:text-blue-500 px-5 pb-5 text-sm transition-all duration-200':
            true,
          'text-gray-700 font-medium': !isActive,
          'text-blue-500 font-semibold': isActive,
        })}
      >
        {props.children}
      </Link>
      <div
        className={classNames({
          'w-full group-hover:bg-blue-500 rounded-t-full h-[3px] transition-all duration-200 mt-5':
            true,
          'bg-blue-500': isActive,
          'bg-transparent': !isActive,
        })}
      />
    </li>
  );
}
