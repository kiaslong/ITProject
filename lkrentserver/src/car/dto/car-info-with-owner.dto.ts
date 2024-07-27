import { CarInfoDto, OwnerDto } from './car-info.dto';

export class CarInfoWithOwnerDto extends CarInfoDto {
  owner: OwnerDto;
}