import { z } from 'zod';
import { procedure, router } from '../trpc';
import { tweetRouter } from './tweet';

export const appRouter = router({
  helloworld: procedure.query((opts) => {
    return {
      message: 'hello world',
    };
  }),
  tweet: tweetRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
