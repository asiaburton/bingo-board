import { BLOCK_CATEGORIES, BlockCategory } from '../models/block-category';
import { CardSquare } from '../models/card.models';
import { CallableItemDefinition } from '../models/game-pack.models';

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function categoryForNumber(num: number): BlockCategory {
  if (num <= 15) {
    return 'B';
  }
  if (num <= 30) {
    return 'I';
  }
  if (num <= 45) {
    return 'N';
  }
  if (num <= 60) {
    return 'G';
  }
  return 'O';
}

export function buildStandardCallableItems(): CallableItemDefinition[] {
  return Array.from({ length: 75 }, (_, index) => {
    const num = index + 1;
    return {
      id: `num-${num}`,
      label: String(num),
      definition: '',
      column: categoryForNumber(num),
    };
  });
}

function createSquare(column: BlockCategory, label: string, isFree: boolean): CardSquare {
  return {
    id: crypto.randomUUID(),
    column,
    label,
    definition: '',
    marked: isFree,
    isFree,
  };
}

export function generateStandardCard(): CardSquare[] {
  const card: CardSquare[] = [];

  BLOCK_CATEGORIES.forEach(column => {
    const start = column === 'B' ? 1 : column === 'I' ? 16 : column === 'N' ? 31 : column === 'G' ? 46 : 61;
    const pool = Array.from({ length: 15 }, (_, i) => start + i);

    if (column === 'N') {
      const picked = shuffle(pool).slice(0, 4);
      card.push(createSquare('N', String(picked[0]), false));
      card.push(createSquare('N', String(picked[1]), false));
      card.push(createSquare('N', 'FREE', true));
      card.push(createSquare('N', String(picked[2]), false));
      card.push(createSquare('N', String(picked[3]), false));
      return;
    }

    shuffle(pool)
      .slice(0, 5)
      .forEach(num => card.push(createSquare(column, String(num), false)));
  });

  return card;
}
