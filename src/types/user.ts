// Path: src/types/user.ts

export interface User {
  userId: string; // Changed from id
  username: string; // Changed from name
  email: string;
  avatarUrl?: string | null; // URL to the user's avatar, allow null
  // TODO: Add other existing user properties if any from existing user type definition
  // As per docs/02_dashboard_domain_model.md
  profilePictureUrl?: string;
  notificationPreferences?: object;
  createdAt?: Date;
  updatedAt?: Date;
}