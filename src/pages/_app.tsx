import '~/styles/globals.css';
import type { AppType } from 'next/app';
import { trpc } from '~/utils/trpc';
import { Poppins } from 'next/font/google';
import Navbar from '~/components/Navbar';
import { SessionProvider } from 'next-auth/react';
import { type Session } from 'next-auth';
import Auth from '~/components/layouts/Auth';
import { Toaster } from '~/components/ui/toaster';
import MobileNav from '~/components/layouts/MobileNav';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '600', '700'],
});

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Auth>
        <main className={poppins.className + ' bg-gray-100 min-h-screen'}>
          <Navbar />
          <Component {...pageProps} />
          <MobileNav />
          <Toaster />
        </main>
      </Auth>
    </SessionProvider>
  );
};

export default trpc.withTRPC(App);
