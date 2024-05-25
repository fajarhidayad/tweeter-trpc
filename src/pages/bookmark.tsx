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
import { trpc } from '~/utils/trpc';
import Loading from '~/components/Loading';

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
  const bookmarks = trpc.tweet.showUserBookmarks.useQuery();

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
          {bookmarks.data ? (
            <TweetContainer>
              {bookmarks.data.map((bookmark) => (
                <TweetBox
                  key={bookmark.id}
                  id={bookmark.id}
                  body={bookmark.tweet.body}
                  username={bookmark.user.username!}
                  authorImg={bookmark.user.image!}
                  authorName={bookmark.user.name!}
                  bookmarkCount={bookmark.tweet._count.bookmarks}
                  createdAt={bookmark.tweet.createdAt}
                  isBookmarked={bookmark.userId === user.id}
                />
              ))}
            </TweetContainer>
          ) : (
            <Loading />
          )}
        </section>
      </Grid>
    </Main>
  );
}
