import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @Max(5, {message: 'rating must not be between 1 and 5'})
  @Min(1, {message: 'rating must not be between 1 and 5'})
  @IsNumber()
  rating: number;

  @IsString()
  productId: string
}