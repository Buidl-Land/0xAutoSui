import { User } from '@/types/user';

export const mockUser: User = {
  userId: 'user-mock-001', // Standardized mock user ID
  username: 'Ricky',
  email: 'ricky@example.com',
  avatarUrl: null, // Set to null to ensure DiceBear is used by default
  // Add other User fields here if needed for mocks, e.g.:
  // profilePictureUrl: '/default-avatar.svg',
  // notificationPreferences: { email: true, push: false },
  // createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
  // updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
};

export const fetchMockCurrentUser = async (): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUser);
    }, 300); // Short delay to simulate network
  });
};