import { Schedule } from '@prisma/client';
import { CoopHistoryDetailQuery } from 'src/dto/history.detail.request.dto';
import { CoopResultQuery } from 'src/dto/history.detail.response.dto';

/**
 *
 * @param results
 * @param schedules
 * @returns
 */
export const zip = (results: CoopHistoryDetailQuery.Request[], schedules: Schedule[]): CoopResultQuery.Request[] =>
  results.map((result, index) => CoopResultQuery.Request.from(result.data.coopHistoryDetail, schedules[index]));
