import {
  IsArray, IsBoolean, IsDefined, IsIn, IsOptional, IsString, MaxLength, MinLength, ValidateNested
} from 'class-validator';
import { MediaDto } from '@gitroom/nestjs-libraries/dtos/media/media.dto';
import { Type } from 'class-transformer';

export class YoutubeTagsSettings {
  @IsString()
  value: string;

  @IsString()
  label: string;
}

export class YoutubeSettingsDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsDefined()
  title: string;

  @IsIn(['public', 'private', 'unlisted'])
  @IsDefined()
  type: string;

  @IsIn(['yes', 'no'])
  @IsOptional()
  selfDeclaredMadeForKids: 'no' | 'yes';

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaDto)
  thumbnail?: MediaDto;

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => YoutubeTagsSettings)
  tags: YoutubeTagsSettings[];

  @IsIn(['video_upload', 'live_stream'])
  @IsOptional()
  contentType?: 'video_upload' | 'live_stream';

  @IsString()
  @IsOptional()
  scheduledStartTime?: string;

  @IsString()
  @IsOptional()
  scheduledEndTime?: string;

  @IsBoolean()
  @IsOptional()
  enableAutoStart?: boolean;

  @IsBoolean()
  @IsOptional()
  enableAutoStop?: boolean;

  @IsBoolean()
  @IsOptional()
  enableEmbed?: boolean;

  @IsBoolean()
  @IsOptional()
  recordFromStart?: boolean;

  @IsIn(['normal', 'low', 'ultraLow'])
  @IsOptional()
  latencyPreference?: 'normal' | 'low' | 'ultraLow';
}
