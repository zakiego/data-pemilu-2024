export const nullGuard = <T>(value: T | null) => {
  if (value === null) {
    return null;
  }

  return value as unknown as number;
};
