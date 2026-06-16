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

function getAppBasePath(): string {
  const base = document.querySelector('base')?.getAttribute('href') ?? '/';
  const trimmed = base.replace(/\/$/, '');
  return trimmed === '/' ? '' : trimmed;
}

export function buildShareUrl(path: string, pack: GamePack): string {
  const encoded = encodeGamePack(pack);
  const base = getAppBasePath();
  const route = path.startsWith('/') ? path : `/${path}`;
  return `${window.location.origin}${base}${route}?pack=${encoded}`;
}
