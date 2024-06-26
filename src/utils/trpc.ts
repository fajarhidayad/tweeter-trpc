import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '~/server/routers/_app';

function getBaseURL() {
  if (typeof window !== undefined)
    // browser should use relative path
    return '';

  if (process.env.VERCEL_URL)
    // reference for vercel
    return `https://${process.env.VERCEL_URL}`;

  // for development using localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config(opts) {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseURL()}/api/trpc`,
          // You can pass any HTTP headers you wish here
          async headers() {
            return {};
          },
        }),
      ],
    };
  },
  ssr: false,
});
