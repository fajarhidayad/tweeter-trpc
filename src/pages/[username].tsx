import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FilterTweetContainer,
  FilterTweetLink,
} from '~/components/FilterTweetContainer';
import FollowButton from '~/components/FollowButton';
import Loading from '~/components/Loading';
import { TweetBox, TweetContainer } from '~/components/TweetBox';
import Grid from '~/components/layouts/Grid';
import Main from '~/components/layouts/Main';
import StickyTopContainer from '~/components/layouts/StickyTopContainer';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { Separator } from '~/components/ui/separator';
import { trpc } from '~/utils/trpc';
import { UserServerSessionProps } from '../../types/user-session';
import { auth } from '~/server/auth';

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

function UserDescriptionContainer(props: {
  userId: string;
  name?: string | null;
  userImg?: string | null;
  bio?: string | null;
  isUserSession: boolean;
  followersCount: number;
  followingCount: number;
  isAuthFollowing: boolean;
}) {
  const utils = trpc.useUtils();
  const followMutation = trpc.user.follow.useMutation({
    onSuccess() {
      utils.user.profile.invalidate();
    },
  });

  return (
    <section className="col-span-1 lg:col-span-3 bg-white rounded-xl shadow p-5">
      <div className="flex flex-col md:flex-row items-center md:items-start -translate-y-20 md:translate-y-0">
        <div className="bg-white p-1 rounded-lg w-[152px] min-h-[152px] -translate-y-0 md:-translate-y-20 mb-3 md:mb-0 md:mr-5">
          {props.userImg && (
            <Image
              className="rounded-lg"
              src={props.userImg}
              alt="Profile Picture"
              width={152}
              height={152}
            />
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row items-center mb-5">
            <h2 className="font-semibold text-2xl text-gray-800 md:mr-6">
              {props.name ? props.name : 'User not found'}
            </h2>
            <div className="flex flex-col md:flex-row flex-1 items-center">
              <div className="flex items-center">
                <Dialog>
                  <DialogTrigger>
                    <p className="font-semibold text-xs text-gray-800 mr-5 hover:underline hover:cursor-pointer">
                      {props.followersCount}{' '}
                      <span className="text-gray-600 font-medium">
                        Following
                      </span>
                    </p>
                  </DialogTrigger>
                  <DialogContent className="rounded-lg py-5 px-0">
                    <UserFollowListPopover
                      userId={props.userId}
                      name={props.name!}
                    />
                  </DialogContent>
                </Dialog>
                <p className="font-semibold text-xs text-gray-800 hover:underline hover:cursor-pointer mr-auto">
                  {props.followingCount}{' '}
                  <span className="text-gray-600 font-medium">Followers</span>
                </p>
              </div>
              {!props.isUserSession &&
              props.userId &&
              !props.isAuthFollowing ? (
                <FollowButton
                  onClick={() =>
                    followMutation.mutate({ userId: props.userId })
                  }
                  className="hidden md:flex px-6 py-2"
                />
              ) : (
                <button className="bg-white border border-blue-500 text-blue-500 hidden md:flex text-xs font-medium ml-auto rounded py-1 px-3 space-x-1">
                  Unfollow
                </button>
              )}
            </div>
          </div>

          <p className="text-center md:text-start text-gray-500 max-w-[420px]">
            {props.bio ? props.bio : 'No bio'}
          </p>
          {props.isUserSession && props.userId && !props.isAuthFollowing ? (
            <FollowButton
              onClick={() => followMutation.mutate({ userId: props.userId })}
              className="flex md:hidden px-6 py-2 mx-auto mt-5"
            />
          ) : (
            <button className="bg-white border border-blue-500 text-blue-500 flex md:hidden text-xs font-medium mt-3 mx-auto rounded py-1 px-3 space-x-1">
              Unfollow
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function UserFollowListPopover(props: { userId: string; name: string }) {
  const following = trpc.user.showFollowing.useQuery({ userId: props.userId });

  if (following.isLoading) return <Loading />;

  return (
    <>
      <p className="font-semibold text-xs px-5">{props.name} is following</p>
      <Separator className="px-5 py-0" />
      <ul className="max-h-[400px] overflow-y-scroll px-5">
        {following.data && following.data.length > 0 ? (
          following.data?.map((item) => (
            <li key={item.id} className="border-b last:border-b-0 py-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-200 rounded-lg mr-4 overflow-hidden">
                  <Image
                    src={item.following.image!}
                    alt={item.following.name!}
                    width={40}
                    height={40}
                  />
                </div>
                <div className="font-medium">
                  <Link href={`/${item.following.username}`} className="mb-2">
                    {item.following.name}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {item.following._count.following} followers
                  </p>
                </div>
                <FollowButton />
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-sm text-gray-500">No following</p>
        )}
      </ul>
    </>
  );
}
