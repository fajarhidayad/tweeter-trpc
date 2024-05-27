import {
  BookmarkIcon,
  HeartIcon,
  ImageIcon,
  MessageSquareIcon,
  Repeat2Icon,
} from 'lucide-react';
import { ReactNode } from 'react';
import Avatar from './Avatar';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { trpc } from '~/utils/trpc';
import { formatDate } from '~/utils/format-date';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

export function TweetContainer(props: { children: ReactNode }) {
  return <ul className="space-y-4">{props.children}</ul>;
}

export function TweetBox(props: {
  id: number;
  body: string;
  authorName: string;
  authorImg: string;
  bookmarkCount: number;
  likeCount: number;
  username: string;
  createdAt: string;
  isBookmarked?: boolean;
  isLiked?: boolean;
}) {
  const utils = trpc.useUtils();
  const saveTweet = trpc.tweet.bookmark.useMutation({
    onSuccess() {
      utils.tweet.showUserBookmarks.invalidate();
      utils.tweet.showAll.invalidate();
      utils.tweet.userTweets.invalidate();
    },
  });
  const likeTweet = trpc.tweet.like.useMutation({
    onSuccess() {
      utils.tweet.showUserBookmarks.invalidate();
      utils.tweet.showAll.invalidate();
      utils.tweet.userTweets.invalidate();
    },
  });

  const date = formatDate(props.createdAt);

  return (
    <li className="bg-white rounded-lg shadow p-5">
      <div className="flex mb-3.5">
        <div className="w-10 h-10 bg-blue-300 rounded-lg mr-4 overflow-hidden">
          <Image
            src={props.authorImg}
            alt={props.authorName}
            width={40}
            height={40}
          />
        </div>
        <div className="font-medium">
          <Link href={`/${props.username}`} className="hover:underline">
            {props.authorName}
          </Link>
          <p className="text-xs text-gray-400 mt-1">{date}</p>
        </div>
      </div>

      <p className="text-gray-800 mb-4">{props.body}</p>

      <div className="flex justify-end items-center space-x-4 mb-2">
        <p className="text-xs text-gray-400">{props.likeCount} Likes</p>
        <p className="text-xs text-gray-400">0 Comments</p>
        <p className="text-xs text-gray-400">0 Retweets</p>
        <p className="text-xs text-gray-400">
          {props.bookmarkCount ?? 0} Saved
        </p>
      </div>

      <div className="grid grid-cols-4 border-y py-1 gap-x-5 mb-2">
        <TweetBoxButton label="Comment">
          <MessageSquareIcon />
        </TweetBoxButton>
        <TweetBoxButton label="Retweet">
          <Repeat2Icon />
        </TweetBoxButton>
        <TweetBoxButton
          label={props.isLiked ? 'Liked' : 'Like'}
          className={props.isLiked ? 'text-red-500' : ''}
          onClick={() => likeTweet.mutate({ tweetId: props.id })}
        >
          <HeartIcon />
        </TweetBoxButton>
        <TweetBoxButton
          label={props.isBookmarked ? 'Saved' : 'Save'}
          className={props.isBookmarked ? 'text-yellow-400' : ''}
          onClick={() => saveTweet.mutate({ tweetId: props.id })}
        >
          <BookmarkIcon />
        </TweetBoxButton>
      </div>

      <ReplySection />
    </li>
  );
}

function TweetBoxButton(props: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={props.onClick}
      className={twMerge(
        'flex justify-center items-center space-x-3 text-sm py-2.5 rounded-lg hover:bg-gray-100 text-gray-600',
        props.className
      )}
    >
      {props.children}
      <span className="hidden lg:block">{props.label}</span>
    </button>
  );
}

function ReplySection() {
  const session = useSession();

  if (!session.data) return null;

  return (
    <div className="flex">
      <Avatar
        image={session.data.user.image!}
        alt={session.data.user.name!}
        className="mr-4"
      />
      <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
        <input
          type="text"
          name="comment"
          placeholder="Tweet your reply"
          className="flex-1 bg-transparent focus:outline-none"
        />
        <button className="text-gray-400 hover:text-gray-600">
          <ImageIcon />
        </button>
      </div>
    </div>
  );
}
