import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Nombre de la categoría' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descripción de la categoría', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Estado de activación de la categoría',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
