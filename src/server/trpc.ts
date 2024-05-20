import { initTRPC } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { auth } from './auth';

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await auth({ req: opts.req, res: opts.res });

  return {
    session,
  };
};

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<typeof createContext>().create({
  errorFormatter({ shape }) {
    return shape;
  },
});

// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;
