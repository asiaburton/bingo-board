import { Injectable } from '@angular/core';
import { CardSquare } from '../models/card.models';
import { GamePack, PLAYER_CARD_KEY_PREFIX } from '../models/game-pack.models';
import { generateCustomCard } from '../utils/card-generator';
import { generateStandardCard } from '../utils/standard-bingo';

@Injectable({ providedIn: 'root' })
export class PlayerCardService {
  getCard(pack: GamePack): CardSquare[] {
    const key = PLAYER_CARD_KEY_PREFIX + pack.id;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        let card = JSON.parse(raw) as CardSquare[];
        card = this.patchDefinitions(card, pack);
        return card;
      } catch {
        // fall through to generate
      }
    }

    const card =
      pack.mode === 'standard'
        ? generateStandardCard()
        : generateCustomCard(pack.squares);

    this.saveCard(pack.id, card);
    return card;
  }

  private patchDefinitions(card: CardSquare[], pack: GamePack): CardSquare[] {
    if (pack.mode !== 'custom' || !pack.squares.length) {
      return card;
    }
    const defMap = new Map(pack.squares.map(s => [s.text, s.definition]));
    let patched = false;
    const result = card.map(sq => {
      const def = defMap.get(sq.label) ?? '';
      if (def && sq.definition !== def) {
        patched = true;
        return { ...sq, definition: def };
      }
      if (!sq.definition) {
        return { ...sq, definition: '' };
      }
      return sq;
    });
    if (patched) {
      this.saveCard(pack.id, result);
    }
    return result;
  }

  saveCard(packId: string, card: CardSquare[]): void {
    localStorage.setItem(PLAYER_CARD_KEY_PREFIX + packId, JSON.stringify(card));
  }

  resetCard(pack: GamePack): CardSquare[] {
    const key = PLAYER_CARD_KEY_PREFIX + pack.id;
    localStorage.removeItem(key);
    return this.getCard(pack);
  }
}
