import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  BACKGROUND_LIBRARY_KEY,
  MAX_SAVED_BACKGROUNDS,
  SavedBackground,
} from '../models/background-library.models';
import { defaultBackgroundName, readImageAsDataUrl } from '../utils/image-utils';

@Injectable({ providedIn: 'root' })
export class BackgroundLibraryService {
  private readonly librarySubject = new BehaviorSubject<SavedBackground[]>(
    this.loadFromStorage()
  );

  readonly library$ = this.librarySubject.asObservable();

  list(): SavedBackground[] {
    return this.librarySubject.value;
  }

  getById(id: string): SavedBackground | undefined {
    return this.list().find(item => item.id === id);
  }

  findByDataUrl(dataUrl: string): SavedBackground | undefined {
    return this.list().find(item => item.dataUrl === dataUrl);
  }

  async addFromBlob(blob: Blob, name = defaultBackgroundName()): Promise<SavedBackground> {
    const dataUrl = await readImageAsDataUrl(blob);
    return this.add(dataUrl, name);
  }

  add(dataUrl: string, name: string): SavedBackground {
    const existing = this.findByDataUrl(dataUrl);
    if (existing) {
      return existing;
    }

    const entry: SavedBackground = {
      id: crypto.randomUUID().slice(0, 8),
      name: name.trim() || defaultBackgroundName(),
      dataUrl,
      createdAt: Date.now(),
    };

    let next = [entry, ...this.list()];
    if (next.length > MAX_SAVED_BACKGROUNDS) {
      next = next.slice(0, MAX_SAVED_BACKGROUNDS);
    }

    this.persist(next);
    return entry;
  }

  remove(id: string): void {
    this.persist(this.list().filter(item => item.id !== id));
  }

  private loadFromStorage(): SavedBackground[] {
    const raw = localStorage.getItem(BACKGROUND_LIBRARY_KEY);
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw) as SavedBackground[];
    } catch {
      return [];
    }
  }

  private persist(items: SavedBackground[]): void {
    localStorage.setItem(BACKGROUND_LIBRARY_KEY, JSON.stringify(items));
    this.librarySubject.next(items);
  }
}
