export const isUsername = (username?: string) => {
  if (!username) {
    return false;
  }
  return username.includes('@');
};
