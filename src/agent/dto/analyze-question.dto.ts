// import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AnalyzeQuestionDto {
    // @ApiProperty({
    //     example: 'Why did revenue decrease this month?',
    // })
    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    question!: string;
}