import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Gabriel Galati',
    description: 'Full name of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'gabriel@example.com',
    description: 'Email address of the user',
    required: false,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Password of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must include uppercase, lowercase, and numbers',
  })
  password?: string;

  @ApiProperty({
    example: ['user', 'admin'],
    description: 'Roles assigned to the user',
    required: false,
  })
  @IsArray()
  @IsOptional()
  roles?: string[];

  @ApiProperty({
    example: true,
    description: 'Whether the user is active',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
