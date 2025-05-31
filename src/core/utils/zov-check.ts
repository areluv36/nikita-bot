export const zovCheck = (text: string) => {
  if (text.toLowerCase().includes('zov')) {
    return true;
  }
  if (
    text.length < 2 &&
    (text.toLowerCase().includes('v') || text.toLowerCase().includes('z'))
  ) {
    return true;
  }
  if (text.toLowerCase().includes('хохл')) {
    return true;
  }

  return false;
};
