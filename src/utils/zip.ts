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
export const zip = (request: CoopHistoryDetailQuery.Paginated, schedules: Schedule[]): CoopResultQuery.Request[] => {
  if (request.results.length !== schedules.length) {
    throw new Error('The lengths of the two arrays are different.');
  }
  if (request.results.length === 0) {
    throw new Error('Empty results.');
  }
  return request.results.map((result, index) =>
    plainToInstance(
      CoopResultQuery.Request,
      {
        ...result,
        schedule: schedules[index],
      },
      { excludeExtraneousValues: true },
    ),
  );
};
