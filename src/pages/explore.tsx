import { SearchIcon } from 'lucide-react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import {
  FilterTweetContainer,
  FilterTweetLink,
} from '~/components/FilterTweetContainer';
import { TweetBox, TweetContainer } from '~/components/TweetBox';
import Grid from '~/components/layouts/Grid';
import Main from '~/components/layouts/Main';
import StickyTopContainer from '~/components/layouts/StickyTopContainer';
import { auth } from '~/server/auth';
import { trpc } from '~/utils/trpc';
import { UserServerSessionProps } from '../../types/user-session';
import { useRouter } from 'next/router';
import { TweetFilterSearch } from '~/server/client';

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
  return { props: { user: session?.user ?? null } };
}) satisfies GetServerSideProps<{ user: UserServerSessionProps }>;

export default function ExplorePage({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [tweets, setTweets] = useState<TweetFilterSearch>([]);
  const router = useRouter();
  const { filter, search } = router.query;

  const { data, isLoading } = trpc.tweet.search.useQuery({
    search: (search as string) ?? '',
  });

  const onSearchTweet = useCallback(() => {
    if (data) setTweets(data);
  }, [data]);

  useEffect(() => {
    onSearchTweet();
  }, [onSearchTweet]);

  return (
    <Main>
      <Head>
        <title>Explore | Tweeter</title>
      </Head>

      <Grid>
        <StickyTopContainer>
          <FilterTweetContainer>
            <FilterTweetLink
              isActive={filter === 'top' || filter === undefined}
              href={{ query: { filter: 'top' } }}
            >
              Top
            </FilterTweetLink>
            <FilterTweetLink
              isActive={filter === 'latest'}
              href={{ query: { filter: 'latest' } }}
            >
              Latest
            </FilterTweetLink>
            <FilterTweetLink
              isActive={filter === 'people'}
              href={{ query: { filter: 'people' } }}
            >
              People
            </FilterTweetLink>
            <FilterTweetLink
              isActive={filter === 'media'}
              href={{ query: { filter: 'media' } }}
            >
              Media
            </FilterTweetLink>
          </FilterTweetContainer>
        </StickyTopContainer>

        <section className="col-span-2">
          <SearchTweetInput onSubmitSearch={onSearchTweet} />
          <TweetContainer>
            {tweets &&
              tweets.map((tweet) => (
                <TweetBox
                  key={tweet.id}
                  id={tweet.id}
                  body={tweet.body}
                  authorImg={tweet.author.image!}
                  authorName={tweet.author.name!}
                  username={tweet.author.username!}
                  createdAt={tweet.createdAt}
                  bookmarkCount={tweet._count.bookmarks}
                  likeCount={tweet._count.likes}
                  commentCount={tweet._count.comments}
                  retweetCount={tweet._count.retweets}
                  isBookmarked={
                    tweet.bookmarks && tweet.bookmarks.length > 0 ? true : false
                  }
                  isLiked={tweet.likes && tweet.likes.length > 0 ? true : false}
                />
              ))}
            {!isLoading && data && data.length < 1 && (
              <h2 className="text-2xl font-medium text-gray-700 text-center">
                No tweets discovered
              </h2>
            )}
          </TweetContainer>
        </section>
      </Grid>
    </Main>
  );
}

function SearchTweetInput(props: { onSubmitSearch: () => void }) {
  const [search, setSearch] = useState('');
  const router = useRouter();

  function onSubmitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (search.length < 1) return;
    router.push({
      query: {
        search,
      },
    });
    props.onSubmitSearch();
  }

  return (
    <form
      onSubmit={onSubmitForm}
      className="flex items-center bg-white rounded-lg shadow p-3 mb-4"
    >
      <SearchIcon className="text-gray-400 mr-4" />
      <input
        name="search"
        autoComplete="off"
        className="flex-1 focus:outline-none"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="submit"
        disabled={!search}
        className="bg-blue-500 disabled:bg-blue-400 text-white rounded px-8 py-2"
      >
        Search
      </button>
    </form>
  );
}
