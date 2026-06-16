import { BlockCategory } from './block-category';

export interface CardSquare {
  id: string;
  column: BlockCategory;
  label: string;
  definition: string;
  marked: boolean;
  isFree: boolean;
}
