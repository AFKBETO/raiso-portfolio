
import { fetchAllShowcaseImages } from "~/database/showcaseData";
import { ShowcaseImgInt } from "~/database/ShowcaseModel";

export default defineEventHandler(async (event): Promise<ShowcaseImgInt> => {
  const imageUrls = await fetchAllShowcaseImages();
	
	return imageUrls;
})
