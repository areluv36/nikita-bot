export const zovCheck = (text: string) => {
  if (text.toLowerCase().includes('z')) {
    return true;
  }
  if (text.toLowerCase().includes('v')) {
    return true;
  }
  if (text.toLowerCase().includes('хох')) {
    return true;
  }

  return false;
};
