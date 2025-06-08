
import { fetchAllShowcaseImages } from "~/database/showcaseData";
import type { ShowcaseImgInt } from "~/database/ShowcaseModel";

export default defineEventHandler(async (_event): Promise<ShowcaseImgInt> => {
  const imageUrls = await fetchAllShowcaseImages();
	
	return imageUrls;
})
