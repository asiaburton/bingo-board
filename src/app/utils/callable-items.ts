import { BLOCK_CATEGORIES, BlockCategory } from '../models/block-category';
import { CallableItemDefinition, CallableItemGroup, SquareEntry } from '../models/game-pack.models';
import { buildStandardCallableItems } from './standard-bingo';

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'item';
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

export function buildCustomCallableItems(entries: SquareEntry[]): CallableItemDefinition[] {
  return uniqueEntries(entries).map((entry, index) => ({
    id: `custom-${index}-${slugify(entry.text)}`,
    label: entry.text,
    definition: entry.definition,
    column: BLOCK_CATEGORIES[index % BLOCK_CATEGORIES.length] as BlockCategory,
  }));
}

export function groupCallableItems(items: CallableItemDefinition[]): CallableItemGroup[] {
  return BLOCK_CATEGORIES.map(category => ({
    category,
    items: items.filter(item => item.column === category),
  }));
}

export function buildCallableItemGroups(
  mode: 'standard' | 'custom',
  squares: SquareEntry[]
): CallableItemGroup[] {
  const items =
    mode === 'standard'
      ? buildStandardCallableItems()
      : buildCustomCallableItems(squares);
  return groupCallableItems(items);
}
