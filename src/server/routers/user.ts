import { z } from 'zod';
import { prisma } from '../prisma';
import { authProcedure, procedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';

export const profileSchema = z.object({
  name: z.string().min(1).max(30),
  username: z.string().min(1).max(30),
  bio: z.string().max(255).optional(),
});

export const userRouter = router({
  profile: procedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await prisma.user.findUnique({
        where: { username: input.username },
        select: {
          id: true,
          name: true,
          bio: true,
          username: true,
          image: true,
          _count: {
            select: {
              following: true,
              followers: true,
            },
          },
          following: ctx.session
            ? {
                where: {
                  followerId: ctx.session.user.id,
                },
                select: {
                  id: true,
                },
              }
            : false,
        },
      });

      if (!user) throw new TRPCError({ code: 'NOT_FOUND' });

      return user;
    }),
  updateProfile: authProcedure
    .input(profileSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.findUnique({ where: { id: ctx.user.id } });

      if (!user) throw new TRPCError({ code: 'NOT_FOUND' });

      const checkUsername = await prisma.user.findUnique({
        where: { username: input.username },
      });

      if (checkUsername && checkUsername.id !== user.id)
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Username already exist',
        });

      const updateUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: input.name,
          username: input.username,
          bio: input.bio,
        },
      });

      return updateUser;
    }),
  follow: authProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.id === input.userId)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot follow yourself',
        });
      const checkFollow = await prisma.follower.findFirst({
        where: {
          followerId: ctx.user.id,
          followingId: input.userId,
        },
      });

      if (checkFollow) {
        return await prisma.follower.delete({
          where: {
            id: checkFollow.id,
          },
        });
      }

      return await prisma.follower.create({
        data: {
          followerId: ctx.user.id,
          followingId: input.userId,
        },
      });
    }),
  showFollowing: procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
        },
      });

      if (!user)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

      const following = await prisma.follower.findMany({
        where: {
          followerId: user.id,
        },
        take: 10,
        include: {
          following: {
            select: {
              image: true,
              name: true,
              _count: true,
              username: true,
              following: ctx.session
                ? {
                    where: {
                      followerId: ctx.session.user.id,
                    },
                    select: {
                      followerId: true,
                    },
                  }
                : false,
            },
          },
        },
      });

      return following;
    }),
});
