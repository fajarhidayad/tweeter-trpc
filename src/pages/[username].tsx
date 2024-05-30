import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  FilterTweetContainer,
  FilterTweetLink,
} from '~/components/FilterTweetContainer';
import { TweetBox, TweetContainer } from '~/components/TweetBox';
import Grid from '~/components/layouts/Grid';
import Main from '~/components/layouts/Main';
import StickyTopContainer from '~/components/layouts/StickyTopContainer';
import { auth } from '~/server/auth';
import { trpc } from '~/utils/trpc';
import { UserServerSessionProps } from '../../types/user-session';
import UserDescriptionContainer from '~/components/UserDescriptionContainer';

export const getServerSideProps = (async ({ req, res }) => {
  const session = await auth({ req, res });
  if (session && session.user.username === null) {
    return {
      redirect: {
        destination: '/settings',
        permanent: false,
      },
    };
  }
  return { props: { userAuth: session?.user ?? null } };
}) satisfies GetServerSideProps<{ userAuth: UserServerSessionProps }>;

export default function UserPage({
  userAuth,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const session = useSession();
  const router = useRouter();
  const username = router.query.username as string;
  const { data: userProfile, isLoading } = trpc.user.profile.useQuery({
    username,
  });
  const userTweets = trpc.tweet.userTweets.useQuery({ username });
  const isAuthFollowing = userProfile?.following
    ? userProfile.following.length > 0
    : false;

  const { filter } = router.query;

  if (isLoading) return;

  return (
    <>
      <Head>
        <title>
          {userProfile ? userProfile.name : 'User Not Found'} (@{username}) |
          Tweeter
        </title>
      </Head>

      <div className="bg-gray-300 w-full h-[168px] lg:h-[300px]"></div>

      <Main className="-translate-y-7 lg:-translate-y-20 pt-0">
        <Grid className="gap-y-5">
          <UserDescriptionContainer
            name={userProfile?.name}
            bio={userProfile?.bio}
            userImg={userProfile?.image}
            userId={userProfile?.id!}
            isUserSession={session.data?.user.id === userProfile?.id}
            followersCount={userProfile?._count.followers!}
            followingCount={userProfile?._count.following!}
            isAuthFollowing={isAuthFollowing}
          />

          {userProfile && (
            <StickyTopContainer className="top-20 col-span-1">
              <FilterTweetContainer>
                <FilterTweetLink
                  isActive={filter === 'tweets' || filter === undefined}
                  href={{
                    query: { filter: 'tweets', username },
                    pathname: '/[username]',
                  }}
                >
                  Tweets
                </FilterTweetLink>
                <FilterTweetLink
                  isActive={filter === 'replies'}
                  href={{
                    query: { filter: 'replies', username },
                    pathname: '/[username]',
                  }}
                >
                  Tweets & replies
                </FilterTweetLink>
                <FilterTweetLink
                  isActive={filter === 'media'}
                  href={{
                    query: { filter: 'media', username },
                    pathname: '/[username]',
                  }}
                >
                  Media
                </FilterTweetLink>
                <FilterTweetLink
                  isActive={filter === 'likes'}
                  href={{
                    query: { filter: 'likes', username },
                    pathname: '/[username]',
                  }}
                >
                  Likes
                </FilterTweetLink>
              </FilterTweetContainer>
            </StickyTopContainer>
          )}

          <section className="col-span-1 lg:col-span-2">
            <TweetContainer>
              {userTweets.data?.map((tweet) => (
                <TweetBox
                  key={tweet.id}
                  id={tweet.id}
                  body={tweet.body}
                  username={tweet.author.username!}
                  authorImg={tweet.author.image!}
                  authorName={tweet.author.name!}
                  bookmarkCount={tweet._count.bookmarks}
                  likeCount={tweet._count.likes}
                  commentCount={tweet._count.comments}
                  createdAt={tweet.createdAt}
                  isBookmarked={
                    tweet.bookmarks && tweet.bookmarks.length > 0 ? true : false
                  }
                  isLiked={tweet.likes && tweet.likes.length > 0 ? true : false}
                />
              ))}
            </TweetContainer>
          </section>
        </Grid>
      </Main>
    </>
  );
}
