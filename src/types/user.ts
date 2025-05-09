// Path: src/types/user.ts

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string; // URL to the user's avatar
  // TODO: Add other existing user properties if any from existing user type definition
}