import { BlockCategory } from './block-category';

export type BingoMode = 'standard' | 'custom';

export interface SquareEntry {
  text: string;
  definition: string;
}

export interface GamePack {
  id: string;
  name: string;
  mode: BingoMode;
  backgroundImageUrl: string;
  /** Custom mode only — min 24 unique entries. */
  squares: SquareEntry[];
  /** @deprecated — old packs may have this instead of squares */
  squareTexts?: string[];
}

export interface CallableItemDefinition {
  id: string;
  label: string;
  definition: string;
  column: BlockCategory;
}

export interface CallableItemGroup {
  category: BlockCategory;
  items: CallableItemDefinition[];
}

export interface CallState {
  calledIds: string[];
  lastCalledId: string | null;
}

export const BACKGROUND_PRESETS = [
  { label: 'Juneteenth', value: 'assets/juneteenth-bg.png' },
  { label: 'None (light gray)', value: '' },
] as const;

export const GAME_PACK_KEY = 'bb__game-pack';
export const PLAYER_CARD_KEY_PREFIX = 'bb__player-card-';
export const CALL_STATE_KEY_PREFIX = 'bb__call-state-';

export function migrateGamePack(raw: Record<string, unknown>): GamePack {
  const pack = raw as unknown as GamePack;
  if (!pack.squares && Array.isArray((raw as { squareTexts?: string[] }).squareTexts)) {
    pack.squares = ((raw as { squareTexts: string[] }).squareTexts).map(text => ({
      text,
      definition: '',
    }));
  }
  if (!pack.squares) {
    pack.squares = [];
  }
  return pack;
}
