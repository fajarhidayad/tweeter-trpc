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
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { username: input.username },
      });

      if (!user) throw new TRPCError({ code: 'NOT_FOUND' });

      return user;
    }),
  updateProfile: authProcedure
    .input(profileSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.findUnique({ where: { id: ctx.user.id } });

      if (!user) throw new TRPCError({ code: 'NOT_FOUND' });

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
});
