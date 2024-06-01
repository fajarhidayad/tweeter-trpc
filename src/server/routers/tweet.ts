import { z } from 'zod';
import { prisma } from '../prisma';
import { authProcedure, procedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';
import { Session } from 'next-auth';
import { Visibility } from '@prisma/client';

const LIMIT_DATA = 10;

const tweetIncludeFilter = (ctx: { session: Session | null }) => ({
  _count: true,
  author: true,
  bookmarks: ctx.session
    ? {
        select: {
          userId: true,
        },
        where: {
          userId: ctx.session.user.id,
        },
      }
    : false,
  likes: ctx.session
    ? {
        select: {
          userId: true,
        },
        where: {
          userId: ctx.session.user.id,
        },
      }
    : false,
});

async function getAllTweet(ctx: { session: Session | null }) {
  const followingId = ctx.session
    ? await prisma.follower
        .findMany({
          where: { followerId: ctx.session?.user.id },
          select: { followingId: true },
        })
        .then((followers) => followers.map((f) => f.followingId))
    : [];

  const retweets = ctx.session
    ? await prisma.retweet.findMany({
        take: LIMIT_DATA,
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          OR: [
            { userId: { in: followingId } },
            ctx.session ? { userId: ctx.session.user.id } : {},
          ],
        },
        include: {
          tweet: {
            include: tweetIncludeFilter(ctx),
          },
          user: {
            select: {
              name: true,
            },
          },
        },
      })
    : [];

  const tweets = await prisma.tweet.findMany({
    take: LIMIT_DATA,
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      OR: [
        {
          visibility: 'PUBLIC',
        },
        ctx.session
          ? {
              AND: [
                { visibility: 'FOLLOWERS_ONLY' },
                { authorId: { in: followingId } },
              ],
            }
          : {},
        ctx.session
          ? {
              AND: [
                { visibility: 'FOLLOWERS_ONLY' },
                { authorId: ctx.session?.user.id },
              ],
            }
          : {},
      ],
    },
    include: tweetIncludeFilter(ctx),
  });

  const feed = [
    ...tweets.map((tweet) => ({ ...tweet, type: 'TWEET' })),
    ...retweets.map((retweet) => ({
      ...retweet.tweet,
      retweetedBy: retweet.user.name,
      createdAtRetweet: retweet.createdAt,
      type: 'RETWEET',
    })),
  ].sort(
    (a, b) =>
      //@ts-ignore
      (b.createdAtRetweet ? b.createdAtRetweet : b.createdAt.getTime()) -
      //@ts-ignore
      (a.createdAtRetweet ? a.createdAtRetweet : a.createdAt.getTime())
  );

  return feed;
}

export const tweetRouter = router({
  showAll: procedure.query(async ({ ctx }) => {
    const tweets = await getAllTweet(ctx);
    return tweets;
  }),
  create: authProcedure
    .input(
      z.object({
        body: z.string().min(1).max(255),
        visibility: z.nativeEnum(Visibility),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const newTweet = await prisma.tweet.create({
        data: {
          body: input.body,
          authorId: ctx.user.id,
          visibility: input.visibility,
        },
      });

      return newTweet;
    }),
  userTweets: procedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await prisma.user.findUnique({
        where: { username: input.username },
      });

      if (!user)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

      const followingId = ctx.session
        ? await prisma.follower
            .findMany({
              where: { followerId: ctx.session?.user.id },
              select: { followingId: true },
            })
            .then((followers) => followers.map((f) => f.followingId))
        : [];

      const tweets = await prisma.tweet.findMany({
        where: {
          authorId: user.id,
          OR: [
            {
              visibility: 'PUBLIC',
            },
            ctx.session
              ? {
                  AND: [
                    { visibility: 'FOLLOWERS_ONLY' },
                    { authorId: { in: followingId } },
                  ],
                }
              : {},
            ctx.session
              ? {
                  AND: [
                    { visibility: 'FOLLOWERS_ONLY' },
                    { authorId: ctx.session?.user.id },
                  ],
                }
              : {},
          ],
        },
        include: {
          _count: true,
          author: true,
          bookmarks: ctx.session
            ? {
                select: {
                  userId: true,
                },
                where: {
                  userId: ctx.session.user.id,
                },
              }
            : false,
          likes: ctx.session
            ? {
                select: {
                  userId: true,
                },
                where: {
                  userId: ctx.session.user.id,
                },
              }
            : false,
        },
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return tweets;
    }),
  like: authProcedure
    .input(z.object({ tweetId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const checkLiked = await prisma.like.findUnique({
        where: {
          userId_tweetId: {
            userId: ctx.user.id,
            tweetId: input.tweetId,
          },
        },
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
            likes: {
              select: {
                userId: true,
              },
              where: {
                userId: ctx.user.id,
              },
            },
            author: {
              select: {
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return bookmarks;
  }),
  comment: authProcedure
    .input(
      z.object({ comment: z.string().min(1).max(255), tweetId: z.number() })
    )
    .mutation(async ({ ctx, input }) => {
      const tweet = await prisma.tweet.findUnique({
        where: { id: input.tweetId },
      });

      if (!tweet)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Tweet not found' });

      if (tweet.visibility === 'FOLLOWERS_ONLY') {
        const isUserFollower = await prisma.follower.findUnique({
          where: {
            followerId_followingId: {
              followerId: ctx.user.id,
              followingId: tweet.authorId,
            },
          },
        });

        if (!isUserFollower && ctx.user.id !== tweet.authorId)
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Tweet is private only follower',
          });
      }

      const newComment = await prisma.comment.create({
        data: {
          comment: input.comment,
          tweetId: input.tweetId,
          userId: ctx.user.id,
        },
      });

      return newComment;
    }),
  showComment: procedure
    .input(z.object({ tweetId: z.number() }))
    .query(async ({ input, ctx }) => {
      const comments = await prisma.comment.findMany({
        where: {
          tweetId: input.tweetId,
        },
        include: {
          user: {
            select: {
              image: true,
              name: true,
              username: true,
            },
          },
          like: ctx.session
            ? {
                where: {
                  userId: ctx.session.user.id,
                },
              }
            : false,
          _count: true,
        },
        take: 10,
      });

      return comments;
    }),
  likeComment: authProcedure
    .input(z.object({ commentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const checkLike = await prisma.likeComment.findFirst({
        where: {
          userId: ctx.user.id,
          commentId: input.commentId,
        },
      });

      if (checkLike) {
        return await prisma.likeComment.delete({ where: { id: checkLike.id } });
      }

      return await prisma.likeComment.create({
        data: {
          commentId: input.commentId,
          userId: ctx.user.id,
        },
      });
    }),
  retweet: authProcedure
    .input(z.object({ tweetId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const checkRetweet = await prisma.retweet.findFirst({
        where: { tweetId: input.tweetId, userId: ctx.user.id },
      });

      if (checkRetweet) {
        return await prisma.retweet.delete({ where: { id: checkRetweet.id } });
      }

      return await prisma.retweet.create({
        data: {
          tweetId: input.tweetId,
          userId: ctx.user.id,
        },
      });
    }),
  search: procedure
    .input(z.object({ search: z.string().max(100) }))
    .query(async ({ input, ctx }) => {
      if (!input.search) {
        return await getAllTweet(ctx);
      }

      const tweets = await prisma.tweet.findMany({
        where: {
          body: {
            contains: input.search,
          },
        },
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          _count: true,
          author: true,
          bookmarks: ctx.session
            ? {
                select: {
                  userId: true,
                },
                where: {
                  userId: ctx.session.user.id,
                },
              }
            : false,
          likes: ctx.session
            ? {
                select: {
                  userId: true,
                },
                where: {
                  userId: ctx.session.user.id,
                },
              }
            : false,
        },
      });

      return tweets;
    }),
});
