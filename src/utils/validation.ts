export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateUUIDs = (currentUserId: string, userId: string): boolean => {
  return UUID_REGEX.test(currentUserId) && UUID_REGEX.test(userId);
};