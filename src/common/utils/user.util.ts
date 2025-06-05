import { User } from '@prisma/client';

export const removeSensitiveUserData = (user: User | null) => {
  if (!user) {
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, saltKey, ...userWithoutSensitiveData } = user;
  return userWithoutSensitiveData;
};

export const generateRandomCode = (length: number = 6): string => {
  const characters = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};
