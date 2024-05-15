import {
  BookmarkIcon,
  HeartIcon,
  MessageSquareIcon,
  Repeat2Icon,
} from 'lucide-react';
import { ReactNode } from 'react';

export function TweetContainer(props: { children: ReactNode }) {
  return <ul className="space-y-4">{props.children}</ul>;
}

export function TweetBox(props: { body: string }) {
  return (
    <li className="bg-white rounded-lg shadow p-5">
      <div className="flex mb-3.5">
        <div className="w-10 h-10 bg-blue-300 rounded-lg mr-4" />
        <div className="font-medium">
          <p>Peyton Lyons</p>
          <p className="text-xs text-gray-400 mt-1">24 August at 20:43</p>
        </div>
      </div>

      <p className="text-gray-800 mb-4">{props.body}</p>

      <div className="flex justify-end items-center space-x-4 mb-2">
        <p className="text-xs text-gray-400">449 Comments</p>
        <p className="text-xs text-gray-400">96 Retweets</p>
        <p className="text-xs text-gray-400">54 Saved</p>
      </div>

      <div className="grid grid-cols-4 border-y py-1 gap-x-5">
        <TweetBoxButton label="Comment">
          <MessageSquareIcon />
        </TweetBoxButton>
        <TweetBoxButton label="Retweet">
          <Repeat2Icon />
        </TweetBoxButton>
        <TweetBoxButton label="Like">
          <HeartIcon />
        </TweetBoxButton>
        <TweetBoxButton label="Save">
          <BookmarkIcon />
        </TweetBoxButton>
      </div>
    </li>
  );
}

function TweetBoxButton({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <button className="flex justify-center items-center space-x-3 text-sm text-gray-600 py-2.5 rounded-lg hover:bg-gray-100">
      {children}
      <span className="hidden lg:block">{label}</span>
    </button>
  );
}
