import { LoaderIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import { ReactNode } from 'react';

export default function Auth(props: { children: ReactNode }) {
  const session = useSession();

  if (session.status === 'loading') {
    return (
      <>
        <Head>
          <title>Tweeter</title>
        </Head>
        <div className="h-screen w-screen bg-gray-100 flex flex-col items-center justify-center p-10">
          {/* <Image
            src={'/tweeter.svg'}
            alt="logo"
            width={200}
            height={100}
            className="my-auto"
          /> */}
          <LoaderIcon className="animate-spin text-blue-500" />
        </div>
      </>
    );
  }

  return <>{props.children}</>;
}
