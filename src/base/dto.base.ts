import {
  IsBooleanString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { QueryPattern } from 'src/validators/query-pattern.validator';

export class BrowseQuery {
  @QueryPattern()
  @IsOptional()
  search?: string;

  @QueryPattern()
  @IsOptional()
  starts?: string;

  @QueryPattern()
  @IsOptional()
  where?: string;

  @QueryPattern()
  @IsOptional()
  in_?: string;

  @QueryPattern()
  @IsOptional()
  nin_?: string;

  @IsOptional()
  isnull?: string;

  @QueryPattern()
  @IsOptional()
  gte?: string;

  @QueryPattern()
  @IsOptional()
  lte?: string;

  @QueryPattern()
  @IsOptional()
  gt?: string;

  @QueryPattern()
  @IsOptional()
  lt?: string;

  @QueryPattern()
  @IsOptional()
  between?: string;

  @IsBooleanString()
  @IsNotEmpty()
  all: string = 'false';

  @IsBooleanString()
  @IsNotEmpty()
  trash: string = 'false';

  @IsBooleanString()
  @IsNotEmpty()
  paginate: string = 'false';

  @IsNumberString()
  @IsNotEmpty()
  limit: string = '10';

  @IsNumberString()
  @IsNotEmpty()
  page: string = '1';

  @QueryPattern()
  @IsOptional()
  order?: string;
}
