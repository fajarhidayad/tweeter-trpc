import { z } from 'zod';
import { prisma } from '../prisma';
import { authProcedure, procedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';

export const tweetRouter = router({
  showAll: procedure.query(async ({ ctx }) => {
    const limit = 10;

    if (ctx.session) {
      return await prisma.tweet.findMany({
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          _count: true,
          author: true,
          bookmarks: {
            select: {
              userId: true,
            },
            where: {
              userId: ctx.session.user.id,
            },
          },
          likes: {
            select: {
              userId: true,
            },
            where: {
              userId: ctx.session.user.id,
            },
          },
        },
      });
    }

    const tweet = await prisma.tweet.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: true,
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
        include: {
          author: true,
          _count: true,
          likes: {
            select: {
              userId: true,
            },
          },
        },
        take: 10,
      });

      return tweets;
    }),
  like: authProcedure
    .input(z.object({ tweetId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const checkLiked = await prisma.like.findFirst({
        where: { tweetId: input.tweetId, userId: ctx.user.id },
      });

      if (checkLiked) {
        return await prisma.like.delete({ where: { id: checkLiked.id } });
      }

      return await prisma.like.create({
        data: { tweetId: input.tweetId, userId: ctx.user.id },
      });
    }),
  bookmark: authProcedure
    .input(z.object({ tweetId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const checkBookmark = await prisma.bookmark.findFirst({
        where: { tweetId: input.tweetId, userId: ctx.user.id },
      });

      if (checkBookmark) {
        return await prisma.bookmark.delete({
          where: { id: checkBookmark.id },
        });
      } else {
        return await prisma.bookmark.create({
          data: { tweetId: input.tweetId, userId: ctx.user.id },
        });
      }
    }),
  showUserBookmarks: authProcedure.query(async ({ ctx }) => {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: ctx.user.id },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      include: {
        tweet: {
          include: {
            _count: true,
          },
        },
        user: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return bookmarks;
  }),
});
