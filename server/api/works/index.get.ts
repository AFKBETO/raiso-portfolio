import { getAllWorkTitles } from '~/database/workData';
import type { WorkTimelineInt } from '~/database/WorkModel';

export default defineEventHandler(async (_event): Promise<WorkTimelineInt[]> => {
  return await getAllWorkTitles();
});
