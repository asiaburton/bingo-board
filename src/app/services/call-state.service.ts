import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CallState, CALL_STATE_KEY_PREFIX } from '../models/game-pack.models';

@Injectable({ providedIn: 'root' })
export class CallStateService {
  private readonly stateSubject = new BehaviorSubject<CallState>({
    calledIds: [],
    lastCalledId: null,
  });

  readonly state$ = this.stateSubject.asObservable();
  private packId = '';

  init(packId: string): void {
    this.packId = packId;
    this.stateSubject.next(this.load(packId));
  }

  getState(): CallState {
    return this.stateSubject.value;
  }

  getCalledIds(): Set<string> {
    return new Set(this.stateSubject.value.calledIds);
  }

  toggleItem(itemId: string): void {
    const current = this.stateSubject.value;
    let calledIds: string[];
    let lastCalledId: string | null;

    if (current.calledIds.includes(itemId)) {
      calledIds = current.calledIds.filter(id => id !== itemId);
      lastCalledId = calledIds[calledIds.length - 1] ?? null;
    } else {
      calledIds = [...current.calledIds, itemId];
      lastCalledId = itemId;
    }

    const next = { calledIds, lastCalledId };
    this.persist(next);
    this.stateSubject.next(next);
  }

  clear(): void {
    const next: CallState = { calledIds: [], lastCalledId: null };
    this.persist(next);
    this.stateSubject.next(next);
  }

  private load(packId: string): CallState {
    const raw = localStorage.getItem(CALL_STATE_KEY_PREFIX + packId);
    if (!raw) {
      return { calledIds: [], lastCalledId: null };
    }
    try {
      return JSON.parse(raw) as CallState;
    } catch {
      return { calledIds: [], lastCalledId: null };
    }
  }

  private persist(state: CallState): void {
    if (!this.packId) {
      return;
    }
    localStorage.setItem(CALL_STATE_KEY_PREFIX + this.packId, JSON.stringify(state));
  }
}
