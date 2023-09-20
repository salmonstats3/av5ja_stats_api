import { ApiProperty } from '@nestjs/swagger';
import { Mode, Prisma, Rule } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, ValidateNested } from 'class-validator';
import dayjs from 'dayjs';
import { scheduleHash } from 'src/utils/hash';

import { CoopStage, MainWeapon } from './schedule.dto';

class CoopHistoryDetail {
  @ApiProperty({ required: true, type: CoopStage })
  @Expose()
  @Type(() => CoopStage)
  @ValidateNested()
  readonly coopStage: CoopStage;

  @ApiProperty({ required: true, type: [MainWeapon] })
  @Expose()
  @Type(() => MainWeapon)
  @ValidateNested({ each: true })
  readonly weapons: MainWeapon[];
}

class HistoryNode {
  @ApiProperty({ required: true, type: [CoopHistoryDetail] })
  @Expose()
  @Type(() => CoopHistoryDetail)
  @ValidateNested({ each: true })
  nodes: CoopHistoryDetail[];
}

class CoopHistory {
  @ApiProperty({ example: '2023-08-27T16:00:00Z', name: 'startTime', required: true })
  @Transform(({ value }) => dayjs(value).toDate())
  @IsDate()
  @Expose()
  readonly startTime: Date;

  @ApiProperty({ example: '2023-08-29T08:00:00Z', name: 'endTime', required: true })
  @Transform(({ value }) => dayjs(value).toDate())
  @IsDate()
  @Expose()
  readonly endTime: Date;

  @ApiProperty({ required: true, type: Mode })
  @Expose()
  @IsEnum(Mode)
  readonly mode: Mode;

  @ApiProperty({ required: true, type: Rule })
  @Expose()
  @IsEnum(Rule)
  readonly rule: Rule;

  @ApiProperty({ required: true, type: [HistoryNode] })
  @Expose()
  @Type(() => HistoryNode)
  @ValidateNested({ each: true })
  readonly historyDetails: HistoryNode;

  get scheduleId(): string {
    return scheduleHash(this.mode, this.rule, this.startTime, this.endTime, this.historyDetails.nodes[0].coopStage.id, this.weaponList);
  }

  get query(): Prisma.ScheduleCreateInput {
    return {
      endTime: this.endTime,
      mode: this.mode,
      rule: this.rule,
      scheduleId: this.scheduleId,
      stageId: this.historyDetails.nodes[0].coopStage.id,
      startTime: this.startTime,
      weaponList: this.weaponList,
    };
  }

  get weaponList(): number[] {
    return this.historyDetails.nodes[0].weapons.map((weapon) => weapon.image.id);
  }
}

class Node {
  @ApiProperty({ required: true, type: CoopHistory })
  @Expose()
  @Type(() => CoopHistory)
  @ValidateNested({ each: true })
  nodes: CoopHistory[];
}

class CoopResult {
  @ApiProperty({ required: true, type: Node })
  @Expose()
  @Type(() => Node)
  @ValidateNested({ each: true })
  historyGroups: Node;
}

class CoopHistoryDataClass {
  @ApiProperty({ required: true, type: CoopResult })
  @Expose()
  @Type(() => CoopResult)
  @ValidateNested({ each: true })
  coopResult: CoopResult;
}

export class HistoryCreateDto {
  @ApiProperty({ required: true, type: CoopHistoryDataClass })
  @Expose()
  @Type(() => CoopHistoryDataClass)
  @ValidateNested({ each: true })
  data: CoopHistoryDataClass;

  get histories(): CoopHistory[] {
    return this.data.coopResult.historyGroups.nodes;
  }

  get create(): Prisma.ScheduleCreateManyArgs {
    return {
      data: this.histories.map((history) => history.query),
      skipDuplicates: true,
    };
  }
}
