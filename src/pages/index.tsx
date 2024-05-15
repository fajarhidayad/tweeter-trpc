import Head from 'next/head';
import SuggestedFollowBox from '~/components/SuggestedFollowBox';
import TrendingTagBox from '~/components/TrendingTagBox';
import { TweetBox, TweetContainer } from '~/components/TweetBox';
import TweetInputBox from '~/components/TweetInputBox';
import Grid from '~/components/layouts/Grid';
import Main from '~/components/layouts/Main';
import { trpc } from '~/utils/trpc';

export default function Home() {
  const tweets = trpc.tweet.showAll.useQuery();

  return (
    <Main>
      <Head>
        <title>Tweeter</title>
      </Head>

      <Grid>
        <section className="col-span-1 lg:col-span-2">
          <TweetInputBox />
          {tweets.data && (
            <TweetContainer>
              {tweets.data.map((tweet) => (
                <TweetBox key={tweet.id} body={tweet.body} />
              ))}
            </TweetContainer>
          )}
        </section>

        <section className="hidden lg:block lg:col-span-1">
          <TrendingTagBox />
          <SuggestedFollowBox />
        </section>
      </Grid>
    </Main>
  );
}
