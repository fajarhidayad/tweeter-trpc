import { z } from 'zod';
import { prisma } from '../prisma';
import { procedure, router } from '../trpc';

export const tweetRouter = router({
  showAll: procedure.query(async () => {
    const limit = 10;
    const tweet = await prisma.tweet.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tweet;
  }),
  create: procedure
    .input(
      z.object({
        body: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ input }) => {
      const newTweet = await prisma.tweet.create({
        data: {
          body: input.body,
        },
      });

      return newTweet;
    }),
});
