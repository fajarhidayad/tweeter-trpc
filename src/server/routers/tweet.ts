import { z } from 'zod';
import { prisma } from '../prisma';
import { authProcedure, procedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';

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
  create: authProcedure
    .input(
      z.object({
        body: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const newTweet = await prisma.tweet.create({
        data: {
          body: input.body,
          authorId: ctx.user.id,
        },
      });

      return newTweet;
    }),
  userTweets: procedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { username: input.username },
      });

      if (!user)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

      const tweets = await prisma.tweet.findMany({
        where: {
          authorId: user.id,
        },
        include: { author: true },
        take: 10,
      });

      return tweets;
    }),
});
