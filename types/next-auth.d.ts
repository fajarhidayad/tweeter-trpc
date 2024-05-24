import NextAuth, { DefaultSession, User } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      username: string | null;
    } & DefaultSession['user'];
  }

  interface User extends User {
    username: string | null | undefined;
  }
}
