import classNames from 'classnames';
import { BookmarkIcon, CompassIcon, HomeIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 w-full lg:hidden bg-white pt-3 px-5 text-gray-600 grid grid-cols-3 gap-x-4">
      <MobileNavButton href="/">
        <HomeIcon size={24} />
      </MobileNavButton>
      <MobileNavButton href="/explore">
        <CompassIcon size={24} />
      </MobileNavButton>
      <MobileNavButton href="/bookmark">
        <BookmarkIcon size={24} />
      </MobileNavButton>
    </nav>
  );
}

function MobileNavButton(props: { children: ReactNode; href: string }) {
  const router = useRouter();
  const isActive = router.asPath === props.href;

  return (
    <div className="flex flex-col">
      <button
        onClick={() => router.push(props.href)}
        className={classNames({
          'py-2 rounded-lg active:bg-gray-100 flex justify-center mb-3': true,
          'text-blue-500': isActive,
        })}
      >
        {props.children}
      </button>
      {isActive && <div className="w-full bg-blue-500 rounded-t-full h-1" />}
    </div>
  );
}
