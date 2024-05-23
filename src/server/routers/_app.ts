import { z } from 'zod';
import { procedure, router } from '../trpc';
import { tweetRouter } from './tweet';
import { userRouter } from './user';

export const appRouter = router({
  helloworld: procedure.query((opts) => {
    console.log(opts.ctx);
    return {
      message: 'hello world',
    };
  }),
  tweet: tweetRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
