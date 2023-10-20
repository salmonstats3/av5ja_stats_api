import { Schedule } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { CoopHistoryDetailQuery } from 'src/dto/history.detail.request.dto';
import { CoopResultQuery } from 'src/dto/history.detail.response.dto';

/**
 * CoopResultQuery.Request形式に変換する
 * @param results
 * @param schedules
 * @returns
 */
export const zip = (
  results: CoopHistoryDetailQuery.Request[] | CoopResultQuery.Request[],
  schedules: Schedule[],
): CoopResultQuery.Request[] => {
  if (results.length !== schedules.length) {
    throw new Error('The lengths of the two arrays are different.');
  }
  if (results.length === 0) {
    throw new Error('Empty results.');
  }
  if (results[0] instanceof CoopHistoryDetailQuery.Request) {
    return (results as CoopHistoryDetailQuery.Request[]).map((result, index) =>
      CoopResultQuery.Request.from(result.data.coopHistoryDetail, schedules[index]),
    );
  }
  if (results[0] instanceof CoopResultQuery.Request) {
    return (results as CoopResultQuery.Request[]).map((result, index) =>
      plainToInstance(
        CoopResultQuery.Request,
        {
          ...result,
          schedule: schedules[index],
        },
        { excludeExtraneousValues: true },
      ),
    );
  }
  return [];
};
