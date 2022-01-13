export const getImageUrl = (icon: string) => {
  return require(`@/assets/images/${icon}.png`).default;
};
