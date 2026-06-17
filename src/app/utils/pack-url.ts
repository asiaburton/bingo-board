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

function normalizeBasePath(base: string): string {
  if (base.startsWith('http://') || base.startsWith('https://')) {
    try {
      const pathname = new URL(base).pathname.replace(/\/$/, '');
      return pathname && pathname !== '/' ? pathname : '';
    } catch {
      return '';
    }
  }

  const trimmed = base.replace(/\/$/, '');
  if (!trimmed || trimmed === '/') {
    return '';
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function getAppBasePath(): string {
  const baseAttr = document.querySelector('base')?.getAttribute('href') ?? '/';
  const fromBase = normalizeBasePath(baseAttr);
  if (fromBase) {
    return fromBase;
  }

  // Fallback when base href is "/" but the app is hosted under a subpath
  // (e.g. https://user.github.io/bingo-board/admin/setup).
  const { pathname } = window.location;
  for (const route of ['/admin', '/play']) {
    const index = pathname.indexOf(route);
    if (index > 0) {
      return pathname.slice(0, index).replace(/\/$/, '');
    }
  }

  return '';
}

export function buildShareUrl(path: string, pack: GamePack): string {
  const encoded = encodeGamePack(pack);
  const base = getAppBasePath();
  const route = path.startsWith('/') ? path : `/${path}`;
  return `${window.location.origin}${base}${route}?pack=${encoded}`;
}
