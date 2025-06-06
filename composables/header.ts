export const useLargeScreen = () => useState<boolean>(
  'largeScreen',
  () => false
);
export const useSlideoverOpen = () => useState<boolean>(
  'slideoverOpen',
  () => false
);