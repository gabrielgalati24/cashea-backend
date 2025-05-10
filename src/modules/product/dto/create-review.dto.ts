import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min, Max, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'Título de la reseña' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Comentario detallado' })
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiProperty({ description: 'Calificación del producto (1-5)', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'ID del usuario que realiza la reseña' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
