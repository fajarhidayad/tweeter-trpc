import classNames from 'classnames';
import { HeartIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { formatDate } from '~/utils/format-date';
import { trpc } from '~/utils/trpc';
import Loading from './Loading';

export default function CommentSection(props: { tweetId: number }) {
  const utils = trpc.useUtils();
  const comments = trpc.tweet.showComment.useQuery({ tweetId: props.tweetId });
  const likeCommentMutation = trpc.tweet.likeComment.useMutation({
    onSuccess() {
      utils.tweet.showComment.invalidate();
    },
  });

  if (comments.isLoading)
    return (
      <div className="pt-5">
        <Loading />
      </div>
    );

  return (
    <ul className="pt-5 space-y-4 overflow-y-auto flex-1">
      {comments.data && comments.data.length < 1 && (
        <p className="text-center font-semibold text-gray-500">
          No comments yet
        </p>
      )}
      {comments.data &&
        comments.data.map((comment) => (
          <li className="flex" key={comment.id}>
            <div className="w-10 h-10 rounded bg-blue-200 overflow-hidden mr-2.5 flex-shrink-0">
              <Image
                src={comment.user.image!}
                alt={comment.user.name!}
                width={40}
                height={40}
              />
            </div>
            <div>
              <div className="bg-gray-100 rounded-lg px-4 pt-3 pb-5 mb-1">
                <div className="flex items-center mb-2">
                  <Link
                    href={`/${comment.user.username}`}
                    className="text-sm font-medium mr-2 hover:underline"
                  >
                    {comment.user.name}
                  </Link>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700">{comment.comment}</p>
              </div>
              <div className="flex items-center text-xs text-gray-400 space-x-2">
                <button
                  onClick={() =>
                    likeCommentMutation.mutate({ commentId: comment.id })
                  }
                  className={classNames({
                    'flex space-x-1 hover:text-red-500': true,
                    'text-red-500': comment.like && comment.like.length,
                  })}
                >
                  <HeartIcon size={16} />{' '}
                  <span>
                    {comment.like && comment.like.length ? 'Liked' : 'Like'}
                  </span>
                </button>
                <span>&bull;</span>
                <span>{comment._count.like} Likes</span>
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
}
