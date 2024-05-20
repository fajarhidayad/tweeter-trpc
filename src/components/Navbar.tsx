import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import {
  ChevronDownIcon,
  CircleUserIcon,
  LogOutIcon,
  SettingsIcon,
} from 'lucide-react';
import { Separator } from './ui/separator';
import { twMerge } from 'tailwind-merge';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Avatar from './Avatar';

export default function Navbar() {
  const session = useSession();

  return (
    <nav className="bg-white shadow">
      <div className="container py-6 lg:py-0 max-w-7xl flex justify-between items-center">
        <Link href={'/'} className="font-semibold text-lg">
          <Image src={'/tweeter.svg'} alt="icon" width={125} height={50} />
        </Link>

        <ul className="hidden lg:flex items-center space-x-14 pt-6">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/explore">Explore</NavLink>
          {session.data && <NavLink href="/bookmark">Bookmarks</NavLink>}
        </ul>

        <div>
          {session.data ? (
            <AccountPopover
              accountName={session.data.user.name as string}
              image={session.data.user.image as string}
            />
          ) : (
            <SignInDialog />
          )}
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

function PopoverLink(props: {
  children: ReactNode;
  href: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={props.href}
      onClick={props.onClick}
      className={twMerge(
        'flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 font-medium text-sm text-gray-700',
        props.className
      )}
    >
      {props.children}
    </Link>
  );
}

function AccountPopover(props: { accountName: string; image: string }) {
  return (
    <Popover>
      <PopoverTrigger className="flex items-center space-x-3">
        <Avatar image={props.image} alt={props.accountName} />
        <p className="font-semibold">{props.accountName}</p>
        <ChevronDownIcon size={20} />
      </PopoverTrigger>
      <PopoverContent className="bg-white flex flex-col shadow rounded-xl w-[192px] px-3 py-4 right-0">
        <PopoverLink href="/user">
          <CircleUserIcon size={20} className="mr-2.5" />
          My Profile
        </PopoverLink>
        <PopoverLink href="/settings">
          <SettingsIcon size={20} className="mr-2.5" />
          Settings
        </PopoverLink>
        <Separator className="my-2" />
        <PopoverLink onClick={() => signOut()} href="" className="text-red-500">
          <LogOutIcon size={20} className="mr-2.5" />
          Logout
        </PopoverLink>
      </PopoverContent>
    </Popover>
  );
}

function SignInDialog() {
  return (
    <Dialog>
      <DialogTrigger className="bg-blue-500 text-white rounded px-6 py-2 text-sm font-semibold">
        Sign in
      </DialogTrigger>
      <DialogContent>
        <h2 className="text-xl font-semibold text-gray-700 mb-5">Sign in</h2>
        <button
          onClick={() => signIn('google')}
          className="bg-blue-500 text-white text-lg font-medium py-3 rounded-lg"
        >
          Sign in with Google
        </button>
      </DialogContent>
    </Dialog>
  );
}
