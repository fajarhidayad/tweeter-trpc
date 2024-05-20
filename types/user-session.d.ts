export interface UserSession {
  id: string;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
}

export type UserServerSessionProps = UserSession | null | undefined;
