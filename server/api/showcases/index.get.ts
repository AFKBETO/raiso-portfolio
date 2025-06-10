import { fetchAllShowcaseImages } from '~/database/workData';
import type { WorkImgInt } from '~/database/WorkModel';

export default defineEventHandler(async (_event): Promise<WorkImgInt[]> => {
  const imageUrls = await fetchAllShowcaseImages();

  return imageUrls;
});
