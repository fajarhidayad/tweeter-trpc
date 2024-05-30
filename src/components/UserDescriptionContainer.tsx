import Image from 'next/image';
import { trpc } from '~/utils/trpc';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import FollowButton from './FollowButton';
import Loading from './Loading';
import { Separator } from './ui/separator';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function UserDescriptionContainer(props: {
  userId: string;
  name?: string | null;
  userImg?: string | null;
  bio?: string | null;
  isUserSession: boolean;
  followersCount: number;
  followingCount: number;
  isAuthFollowing: boolean;
}) {
  const session = useSession();
  const utils = trpc.useUtils();
  const followMutation = trpc.user.follow.useMutation({
    onSuccess() {
      utils.user.profile.invalidate();
    },
  });

  const isProfileAuthHimself = props.userId === session.data?.user.id;

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
              {isProfileAuthHimself && (
                <Link
                  className="bg-white border border-blue-500 text-blue-500 hidden md:flex text-xs font-medium ml-auto rounded py-1 px-3 space-x-1"
                  href={'/settings'}
                >
                  Edit profile
                </Link>
              )}
              {!isProfileAuthHimself ? (
                <>
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
                </>
              ) : null}
            </div>
          </div>

          <p className="text-center md:text-start text-gray-500 max-w-[420px]">
            {props.bio ? props.bio : 'No bio'}
          </p>
          {isProfileAuthHimself && (
            <div className="text-center mt-2">
              <Link
                className="bg-white border border-blue-500 text-blue-500 md:hidden inline-block text-xs font-medium rounded py-1 px-3 space-x-1"
                href={'/settings'}
              >
                Edit profile
              </Link>
            </div>
          )}
          {!isProfileAuthHimself ? (
            <>
              {props.isUserSession && props.userId && !props.isAuthFollowing ? (
                <FollowButton
                  onClick={() =>
                    followMutation.mutate({ userId: props.userId })
                  }
                  className="flex md:hidden px-6 py-2 mx-auto mt-5"
                />
              ) : (
                <button className="bg-white border border-blue-500 text-blue-500 flex md:hidden text-xs font-medium mt-3 mx-auto rounded py-1 px-3 space-x-1">
                  Unfollow
                </button>
              )}
            </>
          ) : null}
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
                {item.following.following &&
                item.following.following.length < 1 ? (
                  <FollowButton />
                ) : (
                  <button className="flex border border-blue-500 text-blue-500 text-xs font-medium ml-auto rounded py-1 px-3 space-x-1">
                    Unfollow
                  </button>
                )}
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
