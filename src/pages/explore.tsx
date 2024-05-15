import { SearchIcon } from 'lucide-react';
import Head from 'next/head';
import React, { useState } from 'react';
import {
  FilterTweetContainer,
  FilterTweetLink,
} from '~/components/FilterTweetContainer';
import { TweetBox, TweetContainer } from '~/components/TweetBox';
import Grid from '~/components/layouts/Grid';
import Main from '~/components/layouts/Main';

export default function ExplorePage() {
  return (
    <Main>
      <Head>
        <title>Explore | Tweeter</title>
      </Head>

      <Grid>
        <section className="col-span-1">
          <FilterTweetContainer>
            <FilterTweetLink isActive={true}>Top</FilterTweetLink>
            <FilterTweetLink>Latest</FilterTweetLink>
            <FilterTweetLink>People</FilterTweetLink>
            <FilterTweetLink>Media</FilterTweetLink>
          </FilterTweetContainer>
        </section>

        <section className="col-span-2">
          <SearchTweetInput />
          <TweetContainer>
            <TweetBox body="coba" />
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
