import Head from 'next/head';
import SuggestedFollowBox from '~/components/SuggestedFollowBox';
import TrendingTagBox from '~/components/TrendingTagBox';
import TweetInputBox from '~/components/TweetInputBox';
import Main from '~/components/layouts/Main';

export default function Home() {
  return (
    <Main>
      <Head>
        <title>Tweeter</title>
      </Head>

      <div className="grid grid-cols-3 gap-x-6">
        <section className="col-span-2">
          <TweetInputBox />
        </section>

        <section className="col-span-1">
          <TrendingTagBox />
          <SuggestedFollowBox />
        </section>
      </div>
    </Main>
  );
}
