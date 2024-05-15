import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from './routers/_app';

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

export type TweetShowAllOutput = RouterOutput['tweet']['showAll'];
