import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  FilterTweetContainer,
  FilterTweetLink,
} from '~/components/FilterTweetContainer';
import FollowButton from '~/components/FollowButton';
import { TweetBox, TweetContainer } from '~/components/TweetBox';
import Grid from '~/components/layouts/Grid';
import Main from '~/components/layouts/Main';

export default function UserPage() {
  const router = useRouter();
  const username = router.query.username;

  return (
    <>
      <Head>
        <title>User (@{username}) | Tweeter</title>
      </Head>

      <div className="bg-gray-200 w-full h-[300px]"></div>

      <Main className="-translate-y-16 pt-0">
        <Grid>
          <UserDescriptionContainer />

          <FilterTweetContainer>
            <FilterTweetLink isActive>Tweets</FilterTweetLink>
            <FilterTweetLink>Tweets & replies</FilterTweetLink>
            <FilterTweetLink>Media</FilterTweetLink>
            <FilterTweetLink>Likes</FilterTweetLink>
          </FilterTweetContainer>

          <section className="col-span-2">
            <TweetContainer>
              <TweetBox body="Traveling" />
            </TweetContainer>
          </section>
        </Grid>
      </Main>
    </>
  );
}

function UserDescriptionContainer() {
  return (
    <section className="col-span-3 flex bg-white rounded-xl shadow p-5 mb-6">
      <div className="bg-white p-1 rounded-lg w-[152px] min-h-[152px] -translate-y-20 mr-5">
        <div className="bg-blue-200 w-full h-full rounded-lg"></div>
      </div>

      <div className="flex-1">
        <div className="flex items-center mb-5">
          <h2 className="font-semibold text-2xl text-gray-800 mr-6">
            Daniel Jensen
          </h2>
          <p className="font-semibold text-xs text-gray-800 mr-5 hover:underline hover:cursor-pointer">
            2,569 <span className="text-gray-600 font-medium">Following</span>
          </p>
          <p className="font-semibold text-xs text-gray-800 hover:underline hover:cursor-pointer mr-auto">
            10.8K <span className="text-gray-600 font-medium">Followers</span>
          </p>
          <FollowButton className="px-6 py-2" />
        </div>

        <p className=" text-gray-500 max-w-[420px]">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Inventore,
          amet.
        </p>
      </div>
    </section>
  );
}
