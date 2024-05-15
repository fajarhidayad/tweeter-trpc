import { EarthIcon, ImageIcon } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { trpc } from '~/utils/trpc';

export default function TweetInputBox() {
  const [body, setBody] = useState('');

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
    });
  }

  return (
    <div className="bg-white rounded-xl px-5 py-3 mb-5 shadow">
      <h3 className="font-semibold text-xs">Tweet something</h3>
      <hr className="my-2" />
      <div className="flex space-x-3">
        <div className="w-10 h-10 bg-blue-200 rounded-lg" />

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
            <button className="text-blue-500 flex items-center font-medium text-xs space-x-1 ml-2">
              <EarthIcon size={20} />
              <p>Everyone can reply</p>
            </button>
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
