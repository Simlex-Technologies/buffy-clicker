export type UserProfileInformation = {
  id: string;
  userId: number;
  username: string;
  email?: string;
  emailVerified?: boolean;
  role?: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
  phone?: string;
  referralCode?: string;
  referralCount?: number;
  points?: number;
  createdAt?: string;
  updatedAt?: string;
};
