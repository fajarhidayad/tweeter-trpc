import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React from 'react';
import { auth } from '~/server/auth';
import type { UserServerSessionProps } from '../../types/user-session';
import Main from '~/components/layouts/Main';
import Head from 'next/head';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { profileSchema } from '~/server/routers/user';
import { trpc } from '~/utils/trpc';
import { useSession } from 'next-auth/react';
import { useToast } from '~/components/ui/use-toast';

type FormProfileSchema = z.infer<typeof profileSchema>;

export const getServerSideProps = (async ({ req, res }) => {
  const session = await auth({ req, res });
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return { props: { user: session.user } };
}) satisfies GetServerSideProps<{ user: UserServerSessionProps }>;

export default function SettingsPage({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const { toast } = useToast();

  const userProfile = trpc.user.profile.useQuery({
    username: user.username ?? '',
  });
  const form = useForm<FormProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name!,
      username: user.username ?? '',
      bio: userProfile.data?.bio ?? '',
    },
  });

  const profileMutation = trpc.user.updateProfile.useMutation({
    onSuccess({ username }) {
      session.update({ username });
      toast({
        description: 'Updated',
      });
    },
  });

  function onSubmitForm(values: FormProfileSchema) {
    profileMutation.mutate(values);
  }

  return (
    <>
      <Head>
        <title>Edit Profile | Tweeter</title>
      </Head>

      <Main className="max-w-3xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitForm)}
            className="rounded-lg bg-white p-5 space-y-3 flex flex-col"
          >
            <h1 className="text-2xl font-semibold text-gray-700">
              Edit Profile
            </h1>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your bio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              className="px-5 py-2 text-white bg-blue-500 rounded-lg font-medium ml-auto"
            >
              Save
            </button>
          </form>
        </Form>
      </Main>
    </>
  );
}
