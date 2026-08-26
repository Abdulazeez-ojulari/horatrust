import { IsNotEmpty, IsString } from 'class-validator';

export class LoadSemanticModelRequestDto {
    @IsString()
    @IsNotEmpty()
    projectRoot!: string;
}