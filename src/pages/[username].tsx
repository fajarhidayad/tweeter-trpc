import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  FilterTweetContainer,
  FilterTweetLink,
} from '~/components/FilterTweetContainer';
import FollowButton from '~/components/FollowButton';
import { TweetBox, TweetContainer } from '~/components/TweetBox';
import Grid from '~/components/layouts/Grid';
import Main from '~/components/layouts/Main';
import StickyTopContainer from '~/components/layouts/StickyTopContainer';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { Separator } from '~/components/ui/separator';

export default function UserPage() {
  const router = useRouter();
  const username = router.query.username;

  return (
    <>
      <Head>
        <title>User (@{username}) | Tweeter</title>
      </Head>

      <div className="bg-gray-300 w-full h-[168px] lg:h-[300px]"></div>

      <Main className="-translate-y-7 lg:-translate-y-16 pt-0">
        <Grid className="gap-y-5">
          <UserDescriptionContainer />

          <StickyTopContainer className="top-20 col-span-1">
            <FilterTweetContainer>
              <FilterTweetLink isActive>Tweets</FilterTweetLink>
              <FilterTweetLink>Tweets & replies</FilterTweetLink>
              <FilterTweetLink>Media</FilterTweetLink>
              <FilterTweetLink>Likes</FilterTweetLink>
            </FilterTweetContainer>
          </StickyTopContainer>

          <section className="col-span-1 lg:col-span-2">
            <TweetContainer>
              <></>
            </TweetContainer>
          </section>
        </Grid>
      </Main>
    </>
  );
}

function UserDescriptionContainer() {
  return (
    <section className="col-span-1 lg:col-span-3 bg-white rounded-xl shadow p-5">
      <div className="flex flex-col md:flex-row items-center md:items-start -translate-y-20 md:translate-y-0">
        <div className="bg-white p-1 rounded-lg w-[152px] min-h-[152px] -translate-y-0 md:-translate-y-20 mb-3 md:mb-0 md:mr-5">
          <Image
            className="rounded-lg"
            src={'https://github.com/shadcn.png'}
            alt="Profile Picture"
            width={152}
            height={152}
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row items-center mb-5">
            <h2 className="font-semibold text-2xl text-gray-800 md:mr-6">
              Daniel Jensen
            </h2>
            <div className="flex flex-col md:flex-row flex-1 items-center">
              <div className="flex items-center">
                <Dialog>
                  <DialogTrigger>
                    <p className="font-semibold text-xs text-gray-800 mr-5 hover:underline hover:cursor-pointer">
                      2,569{' '}
                      <span className="text-gray-600 font-medium">
                        Following
                      </span>
                    </p>
                  </DialogTrigger>
                  <DialogContent className="rounded-lg py-5 px-0">
                    <p className="font-semibold text-xs px-5">
                      Daniel Jensen is following
                    </p>
                    <Separator className="px-5 py-0" />
                    <ul className="max-h-[400px] overflow-y-scroll px-5">
                      <UserFollowItem />
                      <UserFollowItem />
                    </ul>
                  </DialogContent>
                </Dialog>
                <p className="font-semibold text-xs text-gray-800 hover:underline hover:cursor-pointer mr-auto">
                  10.8K{' '}
                  <span className="text-gray-600 font-medium">Followers</span>
                </p>
              </div>
              <FollowButton className="hidden md:flex px-6 py-2" />
            </div>
          </div>

          <p className="text-center md:text-start text-gray-500 max-w-[420px]">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Inventore,
            amet.
          </p>
          <FollowButton className="flex md:hidden px-6 py-2 mx-auto mt-5" />
        </div>
      </div>
    </section>
  );
}

function UserFollowItem() {
  return (
    <li className="border-b last:border-b-0 py-4">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-blue-200 rounded-lg mr-4"></div>
        <div className="font-medium">
          <h3 className="mb-2">Austin Neill</h3>
          <p className="text-xs text-gray-500">120 followers</p>
        </div>
        <FollowButton />
      </div>
    </li>
  );
}
