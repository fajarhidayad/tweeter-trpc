import '~/styles/globals.css';
import type { AppType } from 'next/app';
import { trpc } from '~/utils/trpc';
import { Poppins } from 'next/font/google';
import Navbar from '~/components/Navbar';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '600', '700'],
});

const App: AppType = ({ Component, pageProps }) => {
  return (
    <main className={poppins.className + ' bg-gray-100 min-h-screen'}>
      <Navbar />
      <Component {...pageProps} />
    </main>
  );
};

export default trpc.withTRPC(App);
