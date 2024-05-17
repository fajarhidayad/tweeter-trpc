import '~/styles/globals.css';
import type { AppType } from 'next/app';
import { trpc } from '~/utils/trpc';
import { Poppins } from 'next/font/google';
import Navbar from '~/components/Navbar';
import { SessionProvider } from 'next-auth/react';
import { type Session } from 'next-auth';

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
      <main className={poppins.className + ' bg-gray-100 min-h-screen'}>
        <Navbar />
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
};

export default trpc.withTRPC(App);
