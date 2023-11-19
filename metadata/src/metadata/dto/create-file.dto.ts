import { IsNotEmpty } from 'class-validator';

import { EntityType } from '../entity-type.constant';

export class CreateFileDto {
  @IsNotEmpty()
  readonly entityType: EntityType;

  @IsNotEmpty()
  readonly entityId: number;
}
