import { trpc } from '~/utils/trpc';
import FollowButton from './FollowButton';
import Link from 'next/link';
import Image from 'next/image';
import Loading from './Loading';

export default function SuggestedFollowBox() {
  const { data: user, isLoading } = trpc.user.profile.useQuery({
    username: 'donni',
  });

  return (
    <div className="bg-white py-2.5 px-5 rounded-xl shadow">
      <h3 className="font-semibold text-xs text-gray-700 mb-2">
        Who to follow
      </h3>
      <hr />
      <ul>
        {user && !isLoading ? (
          <SuggestedFollowItem
            name={user.name!}
            followersCount={208}
            username={user.username!}
            image={user.image!}
          />
        ) : (
          <div className="mt-3">
            <Loading />
          </div>
        )}
      </ul>
    </div>
  );
}

function SuggestedFollowItem(props: {
  name: string;
  followersCount: number;
  image: string;
  username: string;
}) {
  return (
    <li className="mt-6 pb-5 last:border-b-0 border-b">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-blue-300 rounded-lg mr-4 overflow-hidden">
          <Image src={props.image} alt={props.name} height={40} width={40} />
        </div>
        <div className="self-stretch">
          <Link href={`/${props.username}`} className="font-medium mb-1">
            {props.name}
          </Link>
          <p className="text-xs text-gray-500">
            {props.followersCount} followers
          </p>
        </div>
        <FollowButton />
      </div>
    </li>
  );
}
