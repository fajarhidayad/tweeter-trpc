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
import { useRouter } from 'next/router';

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
  const router = useRouter();
  const { filter } = router.query;

  return (
    <Main>
      <Head>
        <title>Bookmarks | Tweeter</title>
      </Head>

      <Grid>
        <StickyTopContainer>
          <FilterTweetContainer>
            <FilterTweetLink
              isActive={filter === 'tweets' || filter === undefined}
              href={{
                query: { filter: 'tweets' },
              }}
            >
              Tweets
            </FilterTweetLink>
            <FilterTweetLink
              isActive={filter === 'replies'}
              href={{
                query: { filter: 'replies' },
              }}
            >
              Tweets & replies
            </FilterTweetLink>
            <FilterTweetLink
              isActive={filter === 'media'}
              href={{
                query: { filter: 'media' },
              }}
            >
              Media
            </FilterTweetLink>
            <FilterTweetLink
              isActive={filter === 'likes'}
              href={{
                query: { filter: 'likes' },
              }}
            >
              Likes
            </FilterTweetLink>
          </FilterTweetContainer>
        </StickyTopContainer>

        <section className="col-span-2">
          {bookmarks.data ? (
            <TweetContainer>
              {bookmarks.data.map((bookmark) => (
                <TweetBox
                  key={bookmark.id}
                  id={bookmark.tweetId}
                  body={bookmark.tweet.body}
                  username={bookmark.tweet.author.username!}
                  authorImg={bookmark.tweet.author.image!}
                  authorName={bookmark.tweet.author.name!}
                  bookmarkCount={bookmark.tweet._count.bookmarks}
                  likeCount={bookmark.tweet._count.likes}
                  commentCount={bookmark.tweet._count.comments}
                  createdAt={bookmark.tweet.createdAt}
                  isLiked={
                    bookmark.tweet.likes && bookmark.tweet.likes.length > 0
                      ? true
                      : false
                  }
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
