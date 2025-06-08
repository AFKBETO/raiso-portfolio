import { getAllWorkTitles } from "~/database/workData";
import type { WorkTitleInt } from "~/database/WorkModel";
import type { Locale } from "~/types/locale";
import type { Page } from "~/types/page";

export default defineEventHandler(async (event): Promise<Page<WorkTitleInt>> => {
  const query = getQuery(event);
  const locale = query.locale as Locale || 'fr';
  const works = await getAllWorkTitles(locale) || [];
  
  const result = {
    count: works.length,
    page: 1,
    pageSize: works.length,
    results: works
  };
	
	return result;
})
