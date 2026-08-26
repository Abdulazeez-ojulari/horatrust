import {
    IsString,
    IsNotEmpty,
} from 'class-validator';

export class UploadProjectDto {

    @IsString()
    @IsNotEmpty()
    projectName!: string;
}