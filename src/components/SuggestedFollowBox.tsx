import FollowButton from './FollowButton';

export default function SuggestedFollowBox() {
  return (
    <div className="bg-white py-2.5 px-5 rounded-xl shadow">
      <h3 className="font-semibold text-xs text-gray-700 mb-2">
        Who to follow
      </h3>
      <hr />
      <ul>
        <SuggestedFollowItem name="Mikael Stanley" followersCount={208} />
      </ul>
    </div>
  );
}

function SuggestedFollowItem(props: { name: string; followersCount: number }) {
  return (
    <li className="mt-6 pb-5 last:border-b-0 border-b">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-blue-300 rounded-lg mr-4" />
        <div className="self-stretch">
          <h4 className="font-medium mb-1">{props.name}</h4>
          <p className="text-xs text-gray-500">
            {props.followersCount} followers
          </p>
        </div>
        <FollowButton />
      </div>
    </li>
  );
}