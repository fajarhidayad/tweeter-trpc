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

export const getServerSideProps = (async ({ req, res }) => {
  const session = await auth({ req, res });
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
          {tweets.data && (
            <TweetContainer>
              {tweets.data.map((tweet) => (
                <TweetBox
                  key={tweet.id}
                  body={tweet.body}
                  authorName={tweet.author.name!}
                  authorImg={tweet.author.image!}
                />
              ))}
            </TweetContainer>
          )}
        </section>

        <StickyTopContainer className="hidden lg:block lg:col-span-1">
          <TrendingTagBox />
          <SuggestedFollowBox />
        </StickyTopContainer>
      </Grid>
    </Main>
  );
}
