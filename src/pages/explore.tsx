import { SearchIcon } from 'lucide-react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Session } from 'next-auth';
import Head from 'next/head';
import React, { useState } from 'react';
import {
  FilterTweetContainer,
  FilterTweetLink,
} from '~/components/FilterTweetContainer';
import { TweetBox, TweetContainer } from '~/components/TweetBox';
import Grid from '~/components/layouts/Grid';
import Main from '~/components/layouts/Main';
import StickyTopContainer from '~/components/layouts/StickyTopContainer';
import { auth } from '~/server/auth';
import { UserServerSessionProps } from '../../types/user-session';
import { trpc } from '~/utils/trpc';

export const getServerSideProps = (async ({ req, res }) => {
  const session = await auth({ req, res });
  return { props: { user: session?.user ?? null } };
}) satisfies GetServerSideProps<{ user: UserServerSessionProps }>;

export default function ExplorePage({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const tweets = trpc.tweet.showAll.useQuery();

  return (
    <Main>
      <Head>
        <title>Explore | Tweeter</title>
      </Head>

      <Grid>
        <StickyTopContainer>
          <FilterTweetContainer>
            <FilterTweetLink isActive={true}>Top</FilterTweetLink>
            <FilterTweetLink>Latest</FilterTweetLink>
            <FilterTweetLink>People</FilterTweetLink>
            <FilterTweetLink>Media</FilterTweetLink>
          </FilterTweetContainer>
        </StickyTopContainer>

        <section className="col-span-2">
          <SearchTweetInput />
          <TweetContainer>
            {tweets.data &&
              tweets.data.map((tweet) => (
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
                  // @ts-ignore
                  isBookmarked={tweet.bookmarks && tweet.bookmarks.length}
                />
              ))}
          </TweetContainer>
        </section>
      </Grid>
    </Main>
  );
}

function SearchTweetInput() {
  const [search, setSearch] = useState('');

  return (
    <div className="flex items-center bg-white rounded-lg shadow p-3 mb-4">
      <SearchIcon className="text-gray-400 mr-4" />
      <input
        name="search"
        className="flex-1 focus:outline-none"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="bg-blue-500 text-white rounded px-8 py-2">
        Search
      </button>
    </div>
  );
}
