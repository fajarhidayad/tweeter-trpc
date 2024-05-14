import React from 'react';
import { trpc } from '~/utils/trpc';

export default function TweetList() {
  const tweets = trpc.tweet.showAll.useQuery();

  return (
    <ul className="space-y-4">
      {tweets.data?.map((tweet) => (
        <TweetBox key={tweet.id} body={tweet.body} />
      ))}
    </ul>
  );
}

function TweetBox(props: { body: string }) {
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

      <div className="flex justify-end items-center space-x-4">
        <p className="text-xs text-gray-400">449 Comments</p>
        <p className="text-xs text-gray-400">96 Retweets</p>
        <p className="text-xs text-gray-400">54 Saved</p>
      </div>
    </li>
  );
}
