import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';
import { GamePack, migrateGamePack } from '../models/game-pack.models';

export function encodeGamePack(pack: GamePack): string {
  return compressToEncodedURIComponent(JSON.stringify(pack));
}

export function decodeGamePack(encoded: string): GamePack | null {
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) {
      return null;
    }
    return migrateGamePack(JSON.parse(json));
  } catch {
    return null;
  }
}

export function buildShareUrl(path: string, pack: GamePack): string {
  const encoded = encodeGamePack(pack);
  return `${window.location.origin}${path}?pack=${encoded}`;
}
