import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ADMIN_BACKGROUND } from '../models/background-library.models';
import { GamePack, GAME_PACK_KEY, migrateGamePack } from '../models/game-pack.models';
import { decodeGamePack } from '../utils/pack-url';

@Injectable({ providedIn: 'root' })
export class GamePackService {
  private readonly packSubject = new BehaviorSubject<GamePack | null>(this.loadFromStorage());
  private _loadedFromUrl = false;

  readonly pack$ = this.packSubject.asObservable();

  get loadedFromUrl(): boolean {
    return this._loadedFromUrl;
  }

  consumeLoadedFromUrl(): boolean {
    const val = this._loadedFromUrl;
    this._loadedFromUrl = false;
    return val;
  }

  getPack(): GamePack | null {
    return this.packSubject.value;
  }

  save(pack: GamePack): void {
    localStorage.setItem(GAME_PACK_KEY, JSON.stringify(pack));
    this.packSubject.next(pack);
  }

  loadFromUrlParam(): boolean {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('pack');
    if (!encoded) {
      return false;
    }

    const pack = decodeGamePack(encoded);
    if (!pack) {
      return false;
    }

    this.save(pack);
    this._loadedFromUrl = true;
    history.replaceState({}, '', window.location.pathname);
    return true;
  }

  applyAdminBackground(): void {
    this.applyBackground(ADMIN_BACKGROUND);
  }

  applyPlayerBackground(url: string): void {
    this.applyBackground(url || '');
  }

  applyBackground(url: string): void {
    const html = document.documentElement;
    const body = document.body;
    html.style.minHeight = '100vh';
    body.style.minHeight = '100vh';

    if (url) {
      html.style.backgroundImage = `url('${url}')`;
      html.style.backgroundSize = 'cover';
      html.style.backgroundPosition = 'center center';
      html.style.backgroundRepeat = 'no-repeat';
      html.style.backgroundAttachment = 'fixed';
    } else {
      html.style.backgroundImage = 'none';
      html.style.backgroundColor = '#f5f5f5';
      html.style.backgroundAttachment = 'scroll';
    }
  }

  createDefaultPack(): GamePack {
    return {
      id: crypto.randomUUID().slice(0, 8),
      name: 'Bingo Game',
      mode: 'standard',
      backgroundImageUrl: 'assets/juneteenth-bg.png',
      squares: [],
    };
  }

  private loadFromStorage(): GamePack | null {
    const raw = localStorage.getItem(GAME_PACK_KEY);
    if (!raw) {
      return null;
    }
    try {
      return migrateGamePack(JSON.parse(raw));
    } catch {
      return null;
    }
  }
}
