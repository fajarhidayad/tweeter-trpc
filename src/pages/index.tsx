import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import SuggestedFollowBox from '~/components/SuggestedFollowBox';
import TrendingTagBox from '~/components/TrendingTagBox';
import { TweetBox, TweetContainer } from '~/components/TweetBox';
import TweetInputBox from '~/components/TweetInputBox';
import Grid from '~/components/layouts/Grid';
import Main from '~/components/layouts/Main';
import StickyTopContainer from '~/components/layouts/StickyTopContainer';
import { auth } from '~/server/auth';
import { trpc } from '~/utils/trpc';
import { UserServerSessionProps } from '../../types/user-session';
import Loading from '~/components/Loading';

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
  return { props: { user: session?.user ?? null } };
}) satisfies GetServerSideProps<{ user: UserServerSessionProps }>;

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const tweets = trpc.tweet.showAll.useQuery();

  return (
    <Main>
      <Head>
        <title>Tweeter</title>
      </Head>

      <Grid className="relative">
        <section className="col-span-1 lg:col-span-2">
          {user && <TweetInputBox />}
          {tweets.data ? (
            <TweetContainer>
              {tweets.data.map((tweet) => (
                <TweetBox
                  key={tweet.id}
                  id={tweet.id}
                  body={tweet.body}
                  authorName={tweet.author.name!}
                  username={tweet.author.username!}
                  authorImg={tweet.author.image!}
                  bookmarkCount={tweet._count.bookmarks}
                  likeCount={tweet._count.likes}
                  createdAt={tweet.createdAt}
                  // @ts-ignore
                  isBookmarked={tweet.bookmarks && tweet.bookmarks.length}
                  // @ts-ignore
                  isLiked={tweet.likes && tweet.likes.length}
                />
              ))}
            </TweetContainer>
          ) : (
            <Loading />
          )}
        </section>

        <StickyTopContainer className="hidden lg:block lg:col-span-1">
          <TrendingTagBox />
          <SuggestedFollowBox />
          <footer className="text-xs text-gray-700 italic mt-3">
            <p>
              Design by{' '}
              <a
                href="https://devchallenges.io"
                className="underline text-blue-300"
              >
                devchallenges.io
              </a>
            </p>
          </footer>
        </StickyTopContainer>
      </Grid>
    </Main>
  );
}
