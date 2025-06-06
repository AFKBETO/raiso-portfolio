export const useHorizontalNavbar = () => useState<boolean>(
  'horizontalNavbar',
  () => false
);
export const useSlideoverOpen = () => useState<boolean>(
  'slideoverOpen',
  () => false
);