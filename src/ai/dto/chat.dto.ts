import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChatDto {
    @ApiProperty({
        example: 'Hello',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(5000)
    prompt!: string;
}