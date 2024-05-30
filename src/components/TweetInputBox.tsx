import { EarthIcon, ImageIcon, UsersIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { trpc } from '~/utils/trpc';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Visibility } from '@prisma/client';

export default function TweetInputBox() {
  const [body, setBody] = useState('');
  const [tweetVisibility, setTweetVisibilty] = useState<Visibility>(
    Visibility.PUBLIC
  );
  const session = useSession();

  const utils = trpc.useUtils();
  const tweetMutation = trpc.tweet.create.useMutation({
    onSuccess: () => {
      utils.tweet.showAll.invalidate();
      setBody('');
    },
  });

  function onSubmitTweet(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (body.length < 1) return;
    tweetMutation.mutate({
      body,
      visibility: tweetVisibility,
    });
  }

  return (
    <div className="bg-white rounded-xl px-3 md:px-5 py-3 mb-5 shadow">
      <h3 className="font-semibold text-xs">Tweet something</h3>
      <hr className="my-2" />
      <div className="flex space-x-3">
        <div className="w-10 h-10 bg-blue-200 rounded-lg overflow-hidden">
          {session.data && (
            <Image
              src={session.data.user.image as string}
              alt={session.data.user.name as string}
              width={40}
              height={40}
            />
          )}
        </div>

        <form className="flex-1" onSubmit={onSubmitTweet}>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={255}
            className="w-full py-2 focus:outline-none"
            placeholder="What's happening?"
          />
          <div className="flex">
            <button>
              <ImageIcon className="text-blue-500" size={20} />
            </button>
            <Popover>
              <PopoverTrigger className="text-blue-500 flex items-center font-medium text-xs space-x-1 ml-2">
                {tweetVisibility === Visibility.PUBLIC ? (
                  <>
                    <EarthIcon size={20} />
                    <p>Everyone can reply</p>
                  </>
                ) : (
                  <>
                    <UsersIcon size={20} />
                    <p>People you follow</p>
                  </>
                )}
              </PopoverTrigger>
              <PopoverContent className="rounded-xl px-3 py-2 text-gray-700 w-[230px]">
                <p className="font-semibold text-xs mb-1">Who can reply?</p>
                <p className="text-xs text-gray-600 mb-1">
                  Choose who can reply to this Tweet.
                </p>
                <button
                  onClick={() => setTweetVisibilty(Visibility.PUBLIC)}
                  className="font-medium text-xs flex items-center px-3 py-2 space-x-2 rounded-lg hover:bg-gray-100 w-full"
                >
                  <EarthIcon size={20} />
                  <span>Everyone</span>
                </button>
                <button
                  onClick={() => setTweetVisibilty(Visibility.FOLLOWERS_ONLY)}
                  className="font-medium text-xs flex items-center px-3 py-2 space-x-2 rounded-lg hover:bg-gray-100 w-full"
                >
                  <UsersIcon size={20} />
                  <span>People you follow</span>
                </button>
              </PopoverContent>
            </Popover>
            <button
              type="submit"
              disabled={body.length < 1 || tweetMutation.isPending}
              className="bg-blue-500 rounded text-white font-medium text-xs py-2 px-6 ml-auto disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              Tweet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
