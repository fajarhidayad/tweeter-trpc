import { z } from 'zod';
import { procedure, router } from '../trpc';

export const appRouter = router({
  helloworld: procedure.query((opts) => {
    return {
      message: 'hello world',
    };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
