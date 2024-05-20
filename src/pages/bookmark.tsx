import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import React from 'react';
import {
  FilterTweetContainer,
  FilterTweetLink,
} from '~/components/FilterTweetContainer';
import { TweetBox, TweetContainer } from '~/components/TweetBox';
import Grid from '~/components/layouts/Grid';
import Main from '~/components/layouts/Main';
import StickyTopContainer from '~/components/layouts/StickyTopContainer';
import { UserServerSessionProps } from '../../types/user-session';
import { auth } from '~/server/auth';

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

export default function BookmarkPage({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Main>
      <Head>
        <title>Bookmarks | Tweeter</title>
      </Head>

      <Grid>
        <StickyTopContainer>
          <FilterTweetContainer>
            <FilterTweetLink isActive>Tweets</FilterTweetLink>
            <FilterTweetLink>Tweets & replies</FilterTweetLink>
            <FilterTweetLink>Media</FilterTweetLink>
            <FilterTweetLink>Likes</FilterTweetLink>
          </FilterTweetContainer>
        </StickyTopContainer>

        <section className="col-span-2">
          <TweetContainer>
            <></>
          </TweetContainer>
        </section>
      </Grid>
    </Main>
  );
}
