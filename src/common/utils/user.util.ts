import { User } from '@prisma/client';

export const removeSensitiveUserData = (user: User | null) => {
  if (!user) {
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, saltKey, ...userWithoutSensitiveData } = user;
  return userWithoutSensitiveData;
};
