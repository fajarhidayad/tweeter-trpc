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
      include: {
        author: true,
      },
    });

    return tweet;
  }),
  create: procedure
    .input(
      z.object({
        body: z.string().min(1).max(255),
        authorId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const newTweet = await prisma.tweet.create({
        data: {
          body: input.body,
          authorId: input.authorId,
        },
      });

      return newTweet;
    }),
});
