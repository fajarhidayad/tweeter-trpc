import Head from 'next/head';
import SuggestedFollowBox from '~/components/SuggestedFollowBox';
import TrendingTagBox from '~/components/TrendingTagBox';
import TweetInputBox from '~/components/TweetInputBox';
import TweetList from '~/components/TweetList';
import Main from '~/components/layouts/Main';
import { trpc } from '~/utils/trpc';

export default function Home() {
  // const tweet = trpc.tweet.showAll.useQuery();
  // console.log(tweet.data);
  return (
    <Main>
      <Head>
        <title>Tweeter</title>
      </Head>

      <div className="grid grid-cols-3 gap-x-6">
        <section className="col-span-2">
          <TweetInputBox />
          <TweetList />
        </section>

        <section className="col-span-1">
          <TrendingTagBox />
          <SuggestedFollowBox />
        </section>
      </div>
    </Main>
  );
}
