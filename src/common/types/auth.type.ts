export type JwtAuthPayload = {
  sub: string; // User ID
  email: string; // User email
};

export type JwtUser = {
  id: string;
  email: string;
};
