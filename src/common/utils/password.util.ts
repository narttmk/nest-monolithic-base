import * as bcrypt from 'bcrypt';
const saltRounds = 10;
export const genSalt = () => {
  return bcrypt.genSalt(saltRounds);
};

export const hashPassword = (password: string, saltKey: string) => {
  return bcrypt.hash(password, saltKey);
};
