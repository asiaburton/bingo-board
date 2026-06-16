import { BLOCK_CATEGORIES, BlockCategory } from '../models/block-category';
import { CardSquare } from '../models/card.models';
import { SquareEntry } from '../models/game-pack.models';

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function uniqueEntries(entries: SquareEntry[]): SquareEntry[] {
  const seen = new Set<string>();
  return entries
    .map(e => ({ text: e.text.trim(), definition: e.definition.trim() }))
    .filter(e => {
      if (!e.text || seen.has(e.text)) {
        return false;
      }
      seen.add(e.text);
      return true;
    });
}

function createSquare(
  column: BlockCategory,
  label: string,
  definition: string,
  isFree: boolean
): CardSquare {
  return {
    id: crypto.randomUUID(),
    column,
    label,
    definition,
    marked: isFree,
    isFree,
  };
}

export function validateCustomSquares(entries: SquareEntry[]): void {
  if (uniqueEntries(entries).length < 24) {
    throw new Error('Custom mode needs at least 24 unique square phrases');
  }
}

export function generateCustomCard(entries: SquareEntry[]): CardSquare[] {
  const pool = uniqueEntries(entries);
  if (pool.length < 24) {
    throw new Error('Need at least 24 unique square phrases');
  }

  const picked = shuffle(pool).slice(0, 24);
  const card: CardSquare[] = [];
  let pickIndex = 0;

  BLOCK_CATEGORIES.forEach(column => {
    if (column === 'N') {
      card.push(createSquare('N', picked[pickIndex].text, picked[pickIndex].definition, false));
      pickIndex++;
      card.push(createSquare('N', picked[pickIndex].text, picked[pickIndex].definition, false));
      pickIndex++;
      card.push(createSquare('N', 'FREE', '', true));
      card.push(createSquare('N', picked[pickIndex].text, picked[pickIndex].definition, false));
      pickIndex++;
      card.push(createSquare('N', picked[pickIndex].text, picked[pickIndex].definition, false));
      pickIndex++;
      return;
    }

    for (let row = 0; row < 5; row++) {
      const entry = picked[pickIndex++];
      card.push(createSquare(column, entry.text, entry.definition, false));
    }
  });

  return card;
}

export function groupSquaresByColumn(card: CardSquare[]): CardSquare[][] {
  return BLOCK_CATEGORIES.map(column => card.filter(square => square.column === column));
}
