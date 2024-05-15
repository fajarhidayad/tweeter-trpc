import Head from 'next/head';
import React from 'react';
import {
  FilterTweetContainer,
  FilterTweetLink,
} from '~/components/FilterTweetContainer';
import { TweetBox, TweetContainer } from '~/components/TweetBox';
import Grid from '~/components/layouts/Grid';
import Main from '~/components/layouts/Main';

export default function BookmarkPage() {
  return (
    <Main>
      <Head>
        <title>Bookmarks | Tweeter</title>
      </Head>

      <Grid>
        <section className="col-span-1">
          <FilterTweetContainer>
            <FilterTweetLink isActive>Tweets</FilterTweetLink>
            <FilterTweetLink>Tweets & replies</FilterTweetLink>
            <FilterTweetLink>Media</FilterTweetLink>
            <FilterTweetLink>Likes</FilterTweetLink>
          </FilterTweetContainer>
        </section>
        <section className="col-span-2">
          <TweetContainer>
            <TweetBox body="bookmark" />
          </TweetContainer>
        </section>
      </Grid>
    </Main>
  );
}
