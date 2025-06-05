import * as bcrypt from 'bcrypt';
const saltRounds = 10;
export const genSalt = () => {
  return bcrypt.genSalt(saltRounds);
};

export const hashString = (rawString: string, saltKey: string) => {
  return bcrypt.hash(rawString, saltKey);
};
